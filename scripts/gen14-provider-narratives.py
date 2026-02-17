#!/usr/bin/env python3
"""
Generate auto-narratives for provider detail pages.
Creates plain-English analysis paragraphs for each provider based on their data.
"""
import json, os, glob

BASE = os.path.expanduser("~/Projects/medicaid-tracker-app/public/data")
BENCHMARKS_FILE = os.path.join(BASE, "code-benchmarks.json")

with open(BENCHMARKS_FILE) as f:
    benchmarks = json.load(f)

# Load HCPCS descriptions
HCPCS = {}
hcpcs_path = os.path.expanduser("~/Projects/medicaid-tracker-app/reference-data/HCPCS_CODES.md")
if os.path.exists(hcpcs_path):
    with open(hcpcs_path) as f:
        for line in f:
            if line.startswith("- **"):
                parts = line.split("**")
                if len(parts) >= 3:
                    code = parts[1].strip()
                    desc = parts[2].strip().lstrip("— :").strip()
                    HCPCS[code] = desc

def fmt_money(n):
    if n >= 1e9: return f"${n/1e9:.1f}B"
    if n >= 1e6: return f"${n/1e6:.1f}M"
    if n >= 1e3: return f"${n/1e3:.0f}K"
    return f"${n:,.0f}"

def fmt_num(n):
    if n >= 1e6: return f"{n/1e6:.1f}M"
    if n >= 1e3: return f"{n/1e3:.0f}K"
    return f"{n:,.0f}"

def generate_narrative(p):
    """Generate a multi-paragraph analysis for a provider."""
    sections = []
    name = p.get('name', f"NPI {p['npi']}")
    total = p.get('totalPaid', 0)
    claims = p.get('totalClaims', 0) or 0
    benes = p.get('totalBeneficiaries', 0) or 0
    # If totalBeneficiaries is None/0 but codes have bene data, sum from codes
    if not benes and p.get('codes'):
        benes = sum(c.get('beneficiaries', 0) or 0 for c in p['codes'])
    codes = p.get('codes', [])
    flags = p.get('flags', [])
    if isinstance(flags, str):
        flags = flags.split('|')
    specialty = p.get('specialty', '')
    city = p.get('city', '')
    state = p.get('state', '')
    first = p.get('firstMonth', '')
    last = p.get('lastMonth', '')
    yearly = p.get('yearlyTrend', [])
    risk = p.get('riskLevel', 'MODERATE')
    
    # 1. Provider Overview
    location = f"{city}, {state}" if city and state else state or "Unknown location"
    period = f"{first} through {last}" if first and last else "the 2018–2024 period"
    overview = f"{name} is "
    if specialty:
        overview += f"a {specialty} provider based in {location}. "
    else:
        overview += f"a Medicaid provider based in {location}. "
    bene_text = f" serving {fmt_num(benes)} beneficiaries" if benes > 0 else ""
    overview += f"From {period}, this provider received {fmt_money(total)} in Medicaid payments across {fmt_num(claims)} claims{bene_text}"
    if len(codes) > 0:
        overview += f", billing {len(codes)} distinct procedure codes."
    else:
        overview += "."
    sections.append({"title": "Provider Overview", "text": overview})
    
    # 2. Key findings
    findings = []
    
    # Cost per claim analysis
    if claims > 0:
        cpc = total / claims
        # Check top code against benchmarks
        if codes:
            top_code = codes[0]
            code_id = top_code.get('code', '')
            code_paid = top_code.get('payments', 0)
            code_claims = top_code.get('claims', 0)
            bm = benchmarks.get(code_id, {})
            median_cpc = bm.get('medianCostPerClaim', 0)
            p90_cpc = bm.get('p90', 0)
            p99_cpc = bm.get('p99', 0)
            code_desc = HCPCS.get(code_id, code_id)
            
            if code_claims > 0 and median_cpc > 0:
                provider_cpc = code_paid / code_claims
                ratio = provider_cpc / median_cpc
                if ratio > 3:
                    findings.append(f"Bills {ratio:.1f}× the national median for {code_id} ({code_desc}), at {fmt_money(provider_cpc)} per claim vs. the median of {fmt_money(median_cpc)}. This places them well above the 99th percentile nationally.")
                elif ratio > 1.5:
                    tier = "above the 90th percentile" if p90_cpc and provider_cpc > p90_cpc else "above the 75th percentile"
                    findings.append(f"Bills {ratio:.1f}× the national median for {code_id} ({code_desc}), at {fmt_money(provider_cpc)} per claim vs. the median of {fmt_money(median_cpc)}, placing them {tier}.")
    
    # Procedure concentration
    if codes and total > 0:
        top_code = codes[0]
        conc = top_code.get('payments', 0) / total if total > 0 else 0
        if conc > 0.90 and len(codes) > 1:
            code_desc = HCPCS.get(top_code['code'], top_code['code'])
            findings.append(f"{conc:.0%} of all billing comes from a single procedure code: {top_code['code']} ({code_desc}). This extreme concentration is unusual and may indicate specialized services or a narrow billing pattern.")
        elif conc > 0.75:
            code_desc = HCPCS.get(top_code['code'], top_code['code'])
            findings.append(f"{conc:.0%} of billing is concentrated in {top_code['code']} ({code_desc}), indicating significant specialization in this service.")
    
    # Volume analysis
    if benes > 0 and claims > 0:
        cpb = claims / benes
        if cpb > 500:
            findings.append(f"Averages {cpb:.0f} claims per beneficiary, which is exceptionally high and may indicate intensive services or billing for many service units per patient.")
        elif cpb > 100:
            findings.append(f"Averages {cpb:.0f} claims per beneficiary, significantly above typical levels.")
    
    # Growth analysis
    if yearly and len(yearly) >= 2:
        payments = [(y.get('year', ''), y.get('payments', 0)) for y in yearly if y.get('payments', 0) > 0]
        if len(payments) >= 2:
            first_yr = payments[0]
            last_yr = payments[-1]
            peak = max(payments, key=lambda x: x[1])
            if first_yr[1] > 0:
                growth = (last_yr[1] - first_yr[1]) / first_yr[1] * 100
                if growth > 500:
                    findings.append(f"Spending grew {growth:.0f}% from {fmt_money(first_yr[1])} in {first_yr[0]} to {fmt_money(last_yr[1])} in {last_yr[0]}.")
                elif growth > 100:
                    findings.append(f"Spending more than doubled from {fmt_money(first_yr[1])} in {first_yr[0]} to {fmt_money(last_yr[1])} in {last_yr[0]} ({growth:.0f}% growth).")
            
            # Check for sudden spikes
            for i in range(1, len(payments)):
                prev = payments[i-1][1]
                curr = payments[i][1]
                if prev > 0 and curr / prev > 3:
                    findings.append(f"Saw a {curr/prev:.1f}× spike in {payments[i][0]} ({fmt_money(prev)} → {fmt_money(curr)}), a sharp year-over-year increase.")
                    break
    
    # Active billing period
    if first and last:
        # Parse months
        try:
            fy, fm = int(first[:4]), int(first[5:7]) if len(first) > 5 else 1
            ly, lm = int(last[:4]), int(last[5:7]) if len(last) > 5 else 12
            months = (ly - fy) * 12 + (lm - fm) + 1
            if months <= 12 and total > 1e6:
                findings.append(f"Billed {fmt_money(total)} in just {months} months — a short, intense billing period that may warrant attention.")
            if ly < 2024 and months < 36:
                findings.append(f"Billing stopped in {last}, suggesting this provider is no longer active in Medicaid. Abrupt cessation of billing can be a risk indicator.")
        except:
            pass
    
    if findings:
        sections.append({"title": "Key Findings", "items": findings})
    
    # 3. Legitimate context
    context = []
    if specialty and any(w in specialty.lower() for w in ['fiscal', 'intermediary', 'management']):
        context.append("This provider appears to operate as a fiscal intermediary or management organization, processing payments on behalf of many individual caregivers. High aggregate billing is expected for this type of entity.")
    if any(w in (name or '').lower() for w in ['department', 'county', 'state of', 'city of']):
        context.append("This is a government entity that may serve as a fiscal agent for large populations. Government providers often bill at high volumes due to the scale of public programs they administer.")
    if any(w in (name or '').lower() for w in ['public partnerships', 'consumer direct', 'tempus', 'modivcare']):
        context.append("This provider is a known fiscal management organization for self-directed care programs. They manage billing on behalf of thousands of individual caregivers, so aggregate billing is high by design. However, the self-directed care category has been identified as fraud-prone by regulators.")
    if codes:
        top_code = codes[0].get('code', '')
        if top_code.startswith('T2016'):
            context.append("T2016 is a per diem code for residential habilitation, covering an entire day of care. High per-claim costs may reflect bundled services for complex patients. Dividing by ~30 days brings values closer to expected daily rates.")
        if top_code.startswith('J') and top_code[1:].isdigit():
            context.append("J-codes represent drugs administered by a provider. High costs per claim often reflect pharmaceutical pricing rather than provider markup.")
        if top_code in ['91300', '91301', '91302', '91303', '91304', '91305', '91306', '91307', '0001A', '0002A', '0003A', '0004A', '0011A', '0012A']:
            context.append("This provider's billing is dominated by COVID-19 vaccine administration codes, consistent with participation in the pandemic vaccination campaign.")
        if top_code in ['U0003', 'U0004', 'U0005']:
            context.append("This provider's billing is dominated by COVID-19 testing codes. The spike in billing likely reflects pandemic testing demand rather than anomalous behavior.")
    
    if context:
        sections.append({"title": "Important Context", "items": context})
    
    # 4. Why this matters
    if total > 1e8:
        matters = f"This provider received {fmt_money(total)} in taxpayer-funded Medicaid payments — enough to fund healthcare for approximately {int(total/8000):,} Medicaid beneficiaries for a full year at average per-enrollee costs."
    elif total > 1e7:
        matters = f"At {fmt_money(total)} in Medicaid payments, this provider represents significant public healthcare spending. Understanding where these dollars go helps ensure the program serves those who need it most."
    elif total > 1e6:
        matters = f"This provider received {fmt_money(total)} in Medicaid payments. While not among the largest billers, unusual patterns in providers of this size can still indicate systemic issues worth monitoring."
    else:
        matters = None
    
    if matters:
        sections.append({"title": "Why This Matters", "text": matters})
    
    return sections

# Process all provider detail files
provider_dir = os.path.join(BASE, "providers")
files = glob.glob(os.path.join(provider_dir, "*.json"))
updated = 0

for filepath in files:
    with open(filepath) as f:
        p = json.load(f)
    
    narrative = generate_narrative(p)
    if narrative:
        p['narrative'] = narrative
        with open(filepath, 'w') as f:
            json.dump(p, f)
        updated += 1

print(f"Generated narratives for {updated} of {len(files)} providers")
