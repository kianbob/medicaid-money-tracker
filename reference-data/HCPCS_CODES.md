# Key HCPCS Procedure Code Descriptions

These are the top procedure codes appearing in the Medicaid Provider Spending dataset, with descriptions and fraud context.

## Top Spending Codes in Our Data

| Code | Description | Category | Fraud Risk Context |
|------|-------------|----------|-------------------|
| T1019 | Personal care services, per 15 minutes | Home Health / Personal Care | #1 spending code ($122.7B). High fraud risk — difficult to verify hours were actually worked. Personal care attendant fraud is one of the most common Medicaid fraud types. |
| T1015 | Clinic visit/encounter, all-inclusive | Clinic Services | #2 ($49.2B). Bundled payment code — covers everything in a visit. Fraud risk: billing for visits that didn't happen. |
| T2016 | Habilitation, residential, waiver; per diem | Residential Care / Waiver | #3 ($34.9B). Per-day residential care. The code at the CENTER of our Massachusetts DDS findings — those 3 agencies charged 37-51x the median rate. |
| 99213 | Office/outpatient visit, established patient, low-moderate complexity | Office Visits (E&M) | #4 ($33.0B). One of the most common medical billing codes in existence. Fraud: upcoding (billing 99214/99215 for a 99213-level visit). |
| S5125 | Attendant care services; per 15 minutes | Attendant Care | #5 ($31.3B). Similar to T1019 — personal attendant services. Same fraud vulnerabilities. |
| 99214 | Office/outpatient visit, established patient, moderate-high complexity | Office Visits (E&M) | #6 ($29.9B). Higher-level office visit. Upcoding risk. |
| 99284 | Emergency department visit, high complexity | Emergency Dept | #7 ($20.2B). ER visits. Fraud: billing ER-level for non-emergency care. |
| H2016 | Comprehensive community support services, per 15 minutes | Behavioral Health | #8 ($19.7B). Community behavioral health. Fraud risk: ghost employees, phantom services. |
| 99283 | Emergency department visit, moderate complexity | Emergency Dept | #9 ($16.9B). Mid-level ER visits. |
| H2015 | Comprehensive community support services, per 15 minutes | Behavioral Health | #10 ($16.5B). Community support services. Featured in our Santa Clara County findings. |
| 99285 | Emergency department visit, high/urgent complexity | Emergency Dept | #11 ($15.1B). Highest-level ER visits. |
| 90837 | Psychotherapy, 60 minutes | Mental Health | #12 ($12.1B). Individual therapy sessions. Fraud: billing for sessions that didn't occur or weren't the full duration. |
| S5102 | Day care services, adult; per 15 minutes | Adult Day Care | #13 ($9.3B). Adult day programs. |
| 90834 | Psychotherapy, 45 minutes | Mental Health | #14 ($8.8B). Shorter therapy sessions. |
| T2021 | Day habilitation, waiver; per 15 minutes | Waiver Services | #15 ($8.7B). Day programs for disabled individuals. |
| H2017 | Psychosocial rehabilitation services, per 15 minutes | Behavioral Health | #16 ($8.5B). Psychosocial rehab. |
| T1017 | Targeted case management, per 15 minutes | Case Management | #17 ($8.4B). Case management services. |
| T1020 | Personal care services, per diem | Home Health | #18 ($8.2B). Full-day personal care. |
| 90999 | Unlisted dialysis procedure | Dialysis | #19 ($7.7B). "Unlisted" procedures are higher fraud risk because they're harder to verify. |
| A0427 | Ambulance service, ALS, emergency transport, Level 1 | Ambulance | #20 ($7.7B). Emergency ambulance. Featured in our City of Chicago findings ($1,611 vs $163 median). |

## Ambulance Codes (Key for Chicago Finding)
| Code | Description |
|------|-------------|
| A0427 | Ambulance, ALS emergency transport Level 1 |
| A0429 | Ambulance, BLS emergency transport |
| A0110 | Non-emergency taxi transport |
| A0120 | Non-emergency mini-bus transport |
| A0434 | Ambulance, specialty care transport |

## Home Health / Personal Care Codes (Highest Fraud Risk Category)
| Code | Description |
|------|-------------|
| T1019 | Personal care services, per 15 min |
| T1020 | Personal care services, per diem |
| T1021 | Home health aide visit, per 15 min |
| S5125 | Attendant care services, per 15 min |
| S5126 | Attendant care services, per diem |
| S5110 | Home care training, family member, per 15 min |
| S5130 | Homemaker service, NOS; per 15 min |

## Behavioral Health Codes
| Code | Description |
|------|-------------|
| H0036 | Community psychiatric supportive treatment, face-to-face, per 15 min |
| H0044 | Supported housing, per diem |
| H2010 | Comprehensive medication services, per 15 min |
| H2015 | Comprehensive community support services, per 15 min |
| H2016 | Comprehensive community support services, per diem |
| H2017 | Psychosocial rehabilitation services, per 15 min |
| H0018 | Behavioral health; short-term residential, per diem |

## Residential/Waiver Codes (Key for MA DDS Finding)
| Code | Description |
|------|-------------|
| T2016 | Habilitation, residential, waiver; per diem |
| T2003 | Non-emergency transport; encounter/trip |
| T2017 | Habilitation, residential, waiver; 15 min |
| T2021 | Day habilitation, waiver; per 15 min |

## Important Context

### Why Personal Care/Home Health Is #1 for Fraud
- Services provided in private homes — no witnesses, hard to verify
- Often paid per 15-minute increment — easy to inflate hours
- Large workforce of individual attendants — hard to audit
- Beneficiaries may be cognitively impaired — can't verify care received
- The OIG has identified personal care services as consistently the highest-risk Medicaid category

### Why "Per Diem" vs "Per 15 Min" Matters
- T2016 (per diem = per day) for residential care typically costs $200-400/day
- Our MA DDS findings: $13,000-15,000/day — this is extraordinary
- Per-15-minute codes can be inflated by claiming more units (hours) than delivered
- Per-diem codes can be inflated by claiming a higher per-day rate than warranted

### The Minnesota Autism Fraud Connection
DOGE specifically mentioned this dataset could detect "large-scale autism diagnosis fraud in Minnesota." This refers to:
- Multiple Minnesota providers billing for autism therapy services (EIDBI — Early Intensive Developmental and Behavioral Intervention)
- Procedure codes like H2019, T1024 for autism-related behavioral services
- Providers billing for therapy that was never delivered
- Estimated $100M+ in fraudulent autism therapy billing
- Multiple federal indictments in 2023-2024
- Pattern: sudden spike in autism therapy providers, unrealistic billing volumes, beneficiaries enrolled in multiple providers simultaneously
