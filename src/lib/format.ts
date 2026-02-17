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

export function formatPercent(n: number): string {
  return n.toFixed(1) + '%';
}

export function riskColor(flagCount: number): string {
  if (flagCount >= 3) return 'text-red-400';
  if (flagCount >= 2) return 'text-amber-400';
  if (flagCount >= 1) return 'text-yellow-400';
  return 'text-slate-400';
}

export function riskBgColor(flagCount: number): string {
  if (flagCount >= 3) return 'bg-red-500/15 border-red-500/30';
  if (flagCount >= 2) return 'bg-amber-500/15 border-amber-500/30';
  if (flagCount >= 1) return 'bg-yellow-500/15 border-yellow-500/30';
  return 'bg-slate-500/10 border-slate-500/20';
}

export function riskLabel(flagCount: number): string {
  if (flagCount >= 3) return 'CRITICAL';
  if (flagCount >= 2) return 'HIGH';
  if (flagCount >= 1) return 'MODERATE';
  return 'LOW';
}

export function riskDot(flagCount: number): string {
  if (flagCount >= 3) return 'bg-red-500';
  if (flagCount >= 2) return 'bg-amber-500';
  if (flagCount >= 1) return 'bg-yellow-500';
  return 'bg-slate-500';
}

// ── Flag descriptions (all 9 fraud tests) ─────────────────────────

export interface FlagInfo {
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const FLAG_INFO: Record<string, FlagInfo> = {
  'outlier_spending': {
    label: 'Unusually High Spending',
    description: "This provider's total payments are significantly above the median for their specialty.",
    color: 'text-red-400',
    bgColor: 'bg-red-500/15 border-red-500/30',
  },
  'unusual_cost_per_claim': {
    label: 'High Cost Per Claim',
    description: 'Average payment per claim is much higher than peers billing the same procedures.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15 border-amber-500/30',
  },
  'unusual_cost': {
    label: 'High Cost Per Claim',
    description: 'Average payment per claim is much higher than peers billing the same procedures.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15 border-amber-500/30',
  },
  'beneficiary_stuffing': {
    label: 'High Claims Per Patient',
    description: 'Filing an unusually high number of claims per beneficiary compared to peers.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15 border-blue-500/30',
  },
  'bene_stuffing': {
    label: 'High Claims Per Patient',
    description: 'Filing an unusually high number of claims per beneficiary compared to peers.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15 border-blue-500/30',
  },
  'spending_spike': {
    label: 'Spending Spike',
    description: 'Experienced a dramatic increase in billing over a short period.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15 border-purple-500/30',
  },
  'explosive_growth': {
    label: 'Explosive Growth',
    description: 'Billing increased over 500% year-over-year \u2014 far beyond normal growth patterns.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/15 border-red-500/30',
  },
  'instant_high_volume': {
    label: 'Instant High Volume',
    description: 'New provider billing over $1M in their first year of Medicaid participation.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15 border-amber-500/30',
  },
  'procedure_concentration': {
    label: 'Single-Code Billing',
    description: 'Billing almost exclusively for 1-2 procedure codes despite high total volume.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15 border-orange-500/30',
  },
  'billing_consistency': {
    label: 'Suspiciously Consistent',
    description: 'Monthly billing amounts show almost no natural variation (CV < 0.1).',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/15 border-cyan-500/30',
  },
  'extreme_beneficiary_stuffing': {
    label: 'Extreme Claims Per Patient',
    description: 'Filing over 100 claims per beneficiary \u2014 far exceeding any normal treatment pattern.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/15 border-red-500/30',
  },
  // ── Smart fraud tests (code-specific) ──
  'code_specific_outlier': {
    label: 'Code-Specific Cost Outlier',
    description: 'Billing over 3\u00d7 the national median for specific procedure codes.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/15 border-red-500/30',
  },
  'billing_swing': {
    label: 'Major Billing Swing',
    description: 'Experienced over 200% change in year-over-year billing with >$1M absolute change.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15 border-purple-500/30',
  },
  'massive_new_entrant': {
    label: 'Massive New Entrant',
    description: 'Started billing recently but already receiving millions in Medicaid payments.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15 border-amber-500/30',
  },
  'rate_outlier_multi_code': {
    label: 'Multi-Code Rate Outlier',
    description: 'Billing above the 90th percentile across multiple procedure codes simultaneously.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15 border-orange-500/30',
  },
};

export function getFlagInfo(flag: string): FlagInfo {
  return FLAG_INFO[flag] || {
    label: flag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: 'Statistical anomaly detected in billing patterns.',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/15 border-slate-500/30',
  };
}

export function flagLabel(flag: string): string {
  return getFlagInfo(flag).label;
}

export function flagColor(flag: string): string {
  const info = getFlagInfo(flag);
  return info.bgColor + ' ' + info.color;
}

// Parse pipe-separated flag strings from old data format
export function parseFlags(flags: string[] | string | undefined): string[] {
  if (!flags) return [];
  if (typeof flags === 'string') {
    return flags.split('|').map(f => f.trim()).filter(Boolean);
  }
  const result: string[] = [];
  for (const f of flags) {
    if (f.includes('|')) {
      result.push(...f.split('|').map(s => s.trim()).filter(Boolean));
    } else {
      result.push(f);
    }
  }
  return Array.from(new Set(result));
}

// ── HCPCS Code Descriptions ─────────────────────────

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
  'T2028': 'Specialized supply, NOS; per unit',
  'T2040': 'Financial management, self-directed; per month',
  'T1028': 'Assessment of home, physical & family environments',
  'K0606': 'Automated external defibrillator',
  '99211': 'Office/outpatient visit, minimal complexity',
  '99212': 'Office/outpatient visit, low complexity',
  '99215': 'Office/outpatient visit, high complexity',
  '99282': 'Emergency dept visit, low complexity',
  '99281': 'Emergency dept visit, minimal complexity',
  '90832': 'Psychotherapy, 30 minutes',
  '90847': 'Family psychotherapy with patient, 50 min',
  '90846': 'Family psychotherapy without patient, 50 min',
  '96372': 'Therapeutic injection, subcutaneous/intramuscular',
  '99202': 'Office/outpatient visit, new patient, low complexity',
  '99203': 'Office/outpatient visit, new patient, low-mod complexity',
  '99204': 'Office/outpatient visit, new patient, mod-high complexity',
  '99205': 'Office/outpatient visit, new patient, high complexity',
  // COVID-related codes
  '87635': 'COVID-19 SARS-CoV-2 amplified probe detection',
  '91300': 'COVID-19 vaccine (Pfizer), first dose',
  '91301': 'COVID-19 vaccine (Moderna), first dose',
  '91302': 'COVID-19 vaccine (AstraZeneca), first dose',
  '91303': 'COVID-19 vaccine (J&J/Janssen), single dose',
  '0001A': 'COVID-19 vaccine admin, Pfizer, 1st dose',
  '0002A': 'COVID-19 vaccine admin, Pfizer, 2nd dose',
  '0003A': 'COVID-19 vaccine admin, Pfizer, 3rd dose',
  '0011A': 'COVID-19 vaccine admin, Moderna, 1st dose',
  '0012A': 'COVID-19 vaccine admin, Moderna, 2nd dose',
  '0031A': 'COVID-19 vaccine admin, J&J, single dose',
  // Expensive procedure codes (J-codes = drugs)
  'J2326': 'Nusinersen (Spinraza), 12 mg intrathecal injection',
  'J1426': 'Casimersen (Amondys 45) injection, 10 mg',
  'J7170': 'Emicizumab-kxwh (Hemlibra) injection, 0.5 mg',
  'J1428': 'Eteplirsen (Exondys 51) injection, 10 mg',
  'J7175': 'Factor X (human), per IU',
  'J0219': 'Atezolizumab (Tecentriq) injection, 10 mg',
  'J1303': 'Ravulizumab (Ultomiris) injection, 10 mg',
  'J3032': 'Voretigene neparvovec (Luxturna) injection',
  'J0179': 'Avelumab (Bavencio) injection, 10 mg',
  'J9299': 'Nivolumab (Opdivo) injection, 1 mg',
  'J0222': 'Patisiran (Onpattro) injection, 0.1 mg',
  'J2350': 'Ocrelizumab (Ocrevus) injection, 1 mg',
  // Fast-growing procedure codes
  'S5121': 'Attendant care services, in-home, per 15 min',
  'W1793': 'State-defined waiver service',
  'S9977': 'Home infusion therapy, unspecified',
  '81416': 'Exome sequence analysis',
  'D2740': 'Crown, porcelain/ceramic substrate',
  '97151': 'Behavior identification assessment',
  '97154': 'Group adaptive behavior treatment, per 15 min',
  // Other procedure codes
  '0128': 'Insertion of brain-computer interface',
};

// ── Decile/benchmark display helpers ─────────────────────────

export function decileColor(decile: string): string {
  switch (decile) {
    case 'Top 1%': return 'text-red-400';
    case 'Top 5%': return 'text-red-400';
    case 'Top 10%': return 'text-orange-400';
    case 'Top 25%': return 'text-yellow-400';
    default: return 'text-green-400';
  }
}

export function decileBgColor(decile: string): string {
  switch (decile) {
    case 'Top 1%': return 'bg-red-500/15 border-red-500/30';
    case 'Top 5%': return 'bg-red-500/10 border-red-500/20';
    case 'Top 10%': return 'bg-orange-500/10 border-orange-500/20';
    case 'Top 25%': return 'bg-yellow-500/10 border-yellow-500/20';
    default: return 'bg-green-500/10 border-green-500/20';
  }
}

export function formatCpc(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '\u2014';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function hcpcsDescription(code: string): string {
  return HCPCS_DESCRIPTIONS[code] || '';
}

export function hcpcsLabel(code: string): string {
  const desc = HCPCS_DESCRIPTIONS[code];
  return desc ? `${code} \u2014 ${desc}` : code;
}

// ── State name mapping ─────────────────────────

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida',
  GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana',
  IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', PR: 'Puerto Rico',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming',
};

export function stateName(code: string): string {
  return STATE_NAMES[code] || code;
}
