export function formatMoney(n: number): string {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n.toFixed(0);
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toLocaleString();
}

export function formatMoneyFull(n: number): string {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function riskColor(flagCount: number): string {
  if (flagCount >= 3) return 'text-red-400';
  if (flagCount >= 2) return 'text-amber-400';
  return 'text-green-400';
}

export function riskLabel(flagCount: number): string {
  if (flagCount >= 3) return '🔴 CRITICAL';
  if (flagCount >= 2) return '🟠 HIGH';
  return '🟡 MODERATE';
}

export function flagLabel(flag: string): string {
  const map: Record<string, string> = {
    'outlier_spending': 'Outlier Spending',
    'unusual_cost_per_claim': 'Unusual Cost/Claim',
    'unusual_cost': 'Unusual Cost/Claim',
    'beneficiary_stuffing': 'Bene Stuffing',
    'bene_stuffing': 'Bene Stuffing',
    'spending_spike': 'Spending Spike',
  };
  return map[flag] || flag;
}

export function flagColor(flag: string): string {
  if (flag.includes('spending') && !flag.includes('spike')) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (flag.includes('cost')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (flag.includes('stuffing') || flag.includes('bene')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (flag.includes('spike')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

const HCPCS_DESCRIPTIONS: Record<string, string> = {
  'T1019': 'Personal care services, per 15 min',
  'T1015': 'Clinic visit/encounter, all-inclusive',
  'T2016': 'Habilitation, residential, waiver; per diem',
  '99213': 'Office/outpatient visit, est. patient, low-mod complexity',
  'S5125': 'Attendant care services, per 15 min',
  '99214': 'Office/outpatient visit, est. patient, mod-high complexity',
  '99284': 'Emergency dept visit, high complexity',
  'H2016': 'Comprehensive community support services, per 15 min',
  '99283': 'Emergency dept visit, moderate complexity',
  'H2015': 'Comprehensive community support services, per 15 min',
  '99285': 'Emergency dept visit, high/urgent complexity',
  '90837': 'Psychotherapy, 60 minutes',
  'S5102': 'Day care services, adult; per 15 min',
  '90834': 'Psychotherapy, 45 minutes',
  'T2021': 'Day habilitation, waiver; per 15 min',
  'H2017': 'Psychosocial rehabilitation services, per 15 min',
  'T1017': 'Targeted case management, per 15 min',
  'T1020': 'Personal care services, per diem',
  '90999': 'Unlisted dialysis procedure',
  'A0427': 'Ambulance, ALS emergency transport Level 1',
  '92507': 'Speech/hearing/language treatment',
  'H2019': 'Therapeutic behavioral services, per 15 min',
  'T2033': 'Residential care, NOS; per diem',
  'T1000': 'Private duty/independent nursing service(s)',
  'H2014': 'Skills training & development, per 15 min',
  'H0004': 'Behavioral health counseling & therapy, per 15 min',
  'S5140': 'Foster care, adult; per diem',
  'H0020': 'Alcohol/drug services; methadone administration',
  '97530': 'Therapeutic activities, each 15 min',
  'A0429': 'Ambulance, BLS emergency transport',
  'H0019': 'Behavioral health; residential, per diem',
  'T1040': 'Medicaid certified CCBHC services',
  '99509': 'Home visit, assistance w/ ADLs',
  '00003': 'Anesthesia services',
  'T2023': 'Community transition, waiver; per service',
  'T1016': 'Case management, each 15 min',
  '97153': 'Adaptive behavior treatment by protocol, per 15 min',
  '97110': 'Therapeutic exercises, each 15 min',
  'S9124': 'Nursing care, in the home; per hour',
  'S5130': 'Homemaker service, NOS; per 15 min',
  'H2036': 'Alcohol/drug treatment, per hour',
  'T2031': 'Waiver services, not otherwise specified',
  'H0036': 'Community psychiatric supportive treatment, per 15 min',
  'G0463': 'Hospital outpatient clinic visit',
  'S5126': 'Attendant care services, per diem',
  'H0018': 'Behavioral health; short-term residential, per diem',
  'T2046': 'Habilitation, residential, waiver; per month',
  'U0003': 'Infectious disease detection (COVID-19)',
  'A0100': 'Non-emergency transportation; per trip',
  'H2022': 'Community-based wrap-around services, per diem',
  'A0110': 'Non-emergency taxi transport',
  'A0120': 'Non-emergency mini-bus transport',
  'A0434': 'Ambulance, specialty care transport',
  'T1021': 'Home health aide visit, per 15 min',
  'S5110': 'Home care training, family; per 15 min',
  'H0044': 'Supported housing, per diem',
  'H2010': 'Comprehensive medication services, per 15 min',
  'T2003': 'Non-emergency transport; encounter/trip',
  'T2017': 'Habilitation, residential, waiver; 15 min',
  'T1024': 'Evaluation & treatment, integrated specialty team',
};

export function hcpcsDescription(code: string): string {
  return HCPCS_DESCRIPTIONS[code] || '';
}

export function hcpcsLabel(code: string): string {
  const desc = HCPCS_DESCRIPTIONS[code];
  return desc ? `${code} \u2014 ${desc}` : code;
}
