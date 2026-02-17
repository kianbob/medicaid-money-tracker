# Competitor Fraud Analysis: "Confidence Cartography Project" (Feb 2026)

## What They Did
- Logistic regression model (AUC 0.883, 19 features, 5-fold CV) on 617K providers
- Filtered: >$1M total paid, >98% model confidence, not on LEIE
- Produced 20 investigation targets + 6 confirmed fraud (appendix) + 6 false positives
- Total exposure of top 20: $192.9M across 14 states

## Their 20 Targets (we should check if our model catches them)
1. Larry Onate, MD (AZ) - $1.5M - NPI 1316045750 - Psychiatrist billing H2010/H0020 SUD codes, 14K claims/mo in 9 months
2. Kaying Vang (MN) - $8.8M - NPI 1750461042 - "Homeopath" billing PCA codes, no web presence
3. Steven Klein, PhD (WI) - $1.8M - NPI 1700897766 - Likely legitimate (ABA psychologist) 
4. Tajuana Kesler (NC) - $2.3M - NPI 1801162490 - Home health aide, impossible volume
5. Luis Araujo, BCBA (CA) - $5.3M - NPI 1922475318 - $5.3M in 18mo from Earlimart (pop 8K)
6. Robin Boykin (MO) - $48.7M - NPI 1972646255 - "Homemaker" billing $49M from town of 1,800
7. Yovany Abreu (FL) - $9.0M - NPI 1609280197 - Miami in-home care
8. Lora Namoff, LCSW (FL) - $20.9M - NPI 1700973252 - Social worker billing $21M
9. Natacha Padrino, MD (FL) - $3.8M - NPI 1427237528 - 98% single code (H2017)
10. Mark Stavros, MD (MS) - $1.9M - NPI 1336103241 - Possibly legit (addiction medicine)
11. Landelina Mendoza, OT (TX) - $1.1M - NPI 1013274562 - Likely legit (rehab hospital)
12. James McGlamery, MD (AZ) - $1.1M - NPI 1558390278 - Tucson SUD cluster
13. Joseph Kang, MD (CA) - $2.6M - NPI 1982636288 - 1000 new patients/mo, abrupt stop
14. Susan Hadley, MD (AZ) - $1.3M - NPI 1437148533 - Tucson SUD cluster
15. Roberto Rodriguez (FL) - $10.7M - NPI 1043627755 - Behavior tech billing $10.7M
16. Josephine Garcia (TX) - $11.8M - NPI 1790020675 - Individual billing $12M, 2 codes
17. Julieta Orres (AK) - $4.2M - NPI 1629457932 - Community health worker + PCA + NEMT
18. Frederick Myles (NC) - $9.1M - NPI 1295043800 - 1 code for 7 years, $9.1M
19. Cynthia Dial (NC) - $14.3M - NPI 1700943628 - Small town, 2 codes, $14.3M
20. Anthony Oghoghorie (CA) - $4.2M - NPI 1184869547 - "Driver" billing $4.2M NEMT

## Confirmed Fraud (Appendix A) - Their Model Caught These
1. Teri Hourihan (AZ) - $29.8M - NPI flagged before AHCCCS suspended payment Sep 2023
2. Tymeka Hester (FL) - $2.2M - Arrested May 2023 for Medicaid fraud
3. Pedro Denga (AZ) - $20.6M - Family charged with NEMT fraud, Pedro's NPI 46x scale
4. Santa Barbara County Behavioral Wellness (CA) - $1.7M - $28M False Claims settlement
5. Halikierra Community Services (NC) - $4.7M - Medicaid participation suspended 2018
6. National Medtrans (NY) - $118.7M - NY NEMT fraud ring, $196M estimated

## 4 Fraud Typologies They Identified
1. **PCA Billing Mill** (MN/MO/NC/TX/AK) - Individual NPIs billing massive T1019/S5125/99509
2. **Behavioral Health Code Surfing** (FL/CA) - Miami providers, H2019/H2014/H2017, impossible volumes
3. **SUD Treatment Cluster** (AZ/MS) - Same codes, same city, same time window
4. **NEMT Phantom Billing** (CA) - Dual-code pattern per trip, impossible mileage

## Key Methodology Strengths We Should Adopt
- 19 behavioral features (we have 13 tests — could add more)
- Web validation for each flagged provider (we don't do this yet)
- Confirmed fraud cases as validation (we haven't checked)  
- Taxonomy mismatch detection (homeopath billing PCA, driver billing NEMT)
- Self-billing ratio as key feature
- Geographic clustering detection (3 AZ providers, same codes, same window)
- Transparent about false positives (state fiscal intermediaries, tribal NEMT, COVID testing)

## What We Do Better
- Interactive website (they have a static PDF)
- Code-specific benchmarks with full decile distributions
- State-level analysis
- More providers analyzed (1,360 flagged vs their 20)
- Public access (they seem to be a private report)
- Viral editorial content (COVID spending, pandemic profiteers)
- Procedure-level exploration

## What They Do Better
- ML model with validated AUC (0.883) vs our statistical thresholds
- Web validation / OSINT for each target
- Confirmed fraud cross-reference (found 6 confirmed cases)
- Specific, named, actionable targets with narrative write-ups
- Geographic clustering analysis
- Taxonomy mismatch as a feature
- Self-billing ratio as a feature
- Abrupt billing cessation detection
- False positive documentation (transparency)
