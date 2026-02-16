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
