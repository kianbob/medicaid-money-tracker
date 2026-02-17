#!/usr/bin/env python3
"""Clean data + enrich provider files with code-level benchmarks."""
import duckdb
import json
import csv
import os
import re

PARQUET = os.path.expanduser("~/.openclaw/workspace/medicaid-provider-spending.parquet")
REF = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data")
OUT = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")

# --- TITLE CASE HELPER ---
SMALL_WORDS = {'of', 'the', 'and', 'in', 'for', 'to', 'a', 'an', 'at', 'by', 'or', 'on', 'is', 'with'}
KEEP_UPPER = {'LLC', 'INC', 'LP', 'LLP', 'PC', 'PA', 'MD', 'DO', 'DDS', 'DMD', 'PhD', 'RN',
              'NP', 'PLLC', 'DPM', 'OD', 'PT', 'II', 'III', 'IV', 'VA', 'NY', 'CA', 'TX',
              'FL', 'IL', 'OH', 'MI', 'NJ', 'NC', 'MA', 'WA', 'CO', 'MN', 'OR', 'WI', 'CT',
              'SC', 'AL', 'KY', 'OK', 'IA', 'AR', 'MS', 'KS', 'NV', 'NM', 'NE', 'WV', 'ID',
              'HI', 'NH', 'ME', 'MT', 'RI', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC', 'PR',
              'DDS', 'HHS', 'DHHS', 'PHS', 'IHS', 'DPH', 'USA', 'US', 'CDC'}

def title_case(s):
    if not s:
        return s
    words = s.split()
    result = []
    for i, w in enumerate(words):
        upper = w.upper()
        if upper in KEEP_UPPER:
            result.append(upper)
        elif i > 0 and w.lower() in SMALL_WORDS:
            result.append(w.lower())
        else:
            # Title case but preserve internal caps like "McDonald"
            result.append(w.capitalize())
        # Handle hyphenated words
    return ' '.join(result)

def clean_city(city):
    if not city:
        return city
    return title_case(city)

def clean_name(name):
    if not name:
        return name
    return title_case(name)

# --- LOAD EXISTING DATA ---
print("Loading NPI lookups...")
npi_info = {}
with open(os.path.join(REF, 'npi_lookups_expanded.csv')) as f:
    for row in csv.DictReader(f):
        npi_info[row['npi']] = row

print("Loading code benchmarks...")
with open(os.path.join(OUT, 'code-benchmarks.json')) as f:
    code_benchmarks = json.load(f)

# --- CLEAN & ENRICH PROVIDER DETAIL FILES ---
print("Enriching provider detail files...")
provider_dir = os.path.join(OUT, 'providers')
files = [f for f in os.listdir(provider_dir) if f.endswith('.json')]
fixed = 0
enriched = 0

for fname in files:
    path = os.path.join(provider_dir, fname)
    with open(path) as f:
        data = json.load(f)
    
    changed = False
    
    # Clean names
    if data.get('name'):
        cleaned = clean_name(data['name'])
        if cleaned != data['name']:
            data['name'] = cleaned
            changed = True
    
    if data.get('city'):
        cleaned = clean_city(data['city'])
        if cleaned != data['city']:
            data['city'] = cleaned
            changed = True
    
    # Enrich procedures with code benchmarks
    if data.get('procedures'):
        for proc in data['procedures']:
            code = proc.get('code')
            if code and code in code_benchmarks:
                bench = code_benchmarks[code]
                proc['nationalAvgCpc'] = bench['avgCostPerClaim']
                proc['nationalMedianCpc'] = bench['medianCostPerClaim']
                proc['p90'] = bench['p90']
                proc['p99'] = bench['p99']
                claims = proc.get('claims', 0)
                payments = proc.get('payments', 0)
                if claims > 0:
                    proc['providerCpc'] = round(payments / claims, 2)
                    if bench['medianCostPerClaim'] and bench['medianCostPerClaim'] > 0:
                        proc['cpcRatio'] = round((payments / claims) / bench['medianCostPerClaim'], 2)
                        # Determine which decile this falls in
                        cpc = payments / claims
                        if bench['p99'] and cpc > bench['p99']:
                            proc['decile'] = 'Top 1%'
                        elif bench['p95'] and cpc > bench['p95']:
                            proc['decile'] = 'Top 5%'
                        elif bench['p90'] and cpc > bench['p90']:
                            proc['decile'] = 'Top 10%'
                        elif bench['p75'] and cpc > bench['p75']:
                            proc['decile'] = 'Top 25%'
                        else:
                            proc['decile'] = 'Normal range'
                enriched += 1
        changed = True
    
    if changed:
        with open(path, 'w') as f:
            json.dump(data, f)
        fixed += 1

print(f"  Updated {fixed} provider files, enriched {enriched} procedure entries")

# --- CLEAN TOP PROVIDERS LIST ---
print("Cleaning top-providers-1000.json...")
with open(os.path.join(OUT, 'top-providers-1000.json')) as f:
    top_provs = json.load(f)
for p in top_provs:
    if p.get('name'):
        p['name'] = clean_name(p['name'])
    if p.get('city'):
        p['city'] = clean_city(p['city'])
with open(os.path.join(OUT, 'top-providers-1000.json'), 'w') as f:
    json.dump(top_provs, f)

# Also clean top-providers.json (the original 50)
if os.path.exists(os.path.join(OUT, 'top-providers.json')):
    with open(os.path.join(OUT, 'top-providers.json')) as f:
        tp = json.load(f)
    for p in tp:
        if p.get('name'):
            p['name'] = clean_name(p['name'])
        if p.get('city'):
            p['city'] = clean_city(p['city'])
    with open(os.path.join(OUT, 'top-providers.json'), 'w') as f:
        json.dump(tp, f)

# --- CLEAN WATCHLIST ---
print("Cleaning watchlist files...")
for wl_file in ['watchlist.json', 'expanded-watchlist.json']:
    path = os.path.join(OUT, wl_file)
    if os.path.exists(path):
        with open(path) as f:
            wl = json.load(f)
        for p in wl:
            if p.get('name'):
                p['name'] = clean_name(p['name'])
            if p.get('city'):
                p['city'] = clean_city(p['city'])
        with open(path, 'w') as f:
            json.dump(wl, f)

# --- CLEAN STATE FILES ---
print("Cleaning state data files...")
state_dir = os.path.join(OUT, 'states')
if os.path.exists(state_dir):
    for fname in os.listdir(state_dir):
        if not fname.endswith('.json'):
            continue
        path = os.path.join(state_dir, fname)
        with open(path) as f:
            data = json.load(f)
        if data.get('top_providers'):
            for p in data['top_providers']:
                if p.get('name'):
                    p['name'] = clean_name(p['name'])
                if p.get('city'):
                    p['city'] = clean_city(p['city'])
        with open(path, 'w') as f:
            json.dump(data, f)

# --- CLEAN VIRAL DATA FILES ---
print("Cleaning viral data files...")
for viral_file in ['covid-vaccine-top-billers.json', 'covid-testing-top-billers.json',
                    'pandemic-billing-jumps.json', 'top-individuals.json']:
    path = os.path.join(OUT, viral_file)
    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
        for p in data:
            if p.get('name'):
                p['name'] = clean_name(p['name'])
            if p.get('city'):
                p['city'] = clean_city(p['city'])
        with open(path, 'w') as f:
            json.dump(data, f)

print("\nDone with cleaning and enrichment!")
