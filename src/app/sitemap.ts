import { MetadataRoute } from 'next';
import topProviders from '../../public/data/top-providers-1000.json';
import allProcedures from '../../public/data/all-procedures.json';
import statesSummary from '../../public/data/states-summary.json';
import fs from 'fs';
import path from 'path';
import specialtiesData from '../../public/data/specialties.json';
import cityHotspots from '../../public/data/city-fraud-hotspots.json';
import geoRisk from '../../public/data/geographic-risk.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.openmedicaid.org';

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date("2026-02-19"), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/watchlist`, lastModified: new Date("2026-02-19"), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/providers`, lastModified: new Date("2026-02-19"), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/states`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/procedures`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/analysis`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/trends`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/insights`, lastModified: new Date("2026-02-19"), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/insights/covid-vaccines`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/covid-testing`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/pandemic-profiteers`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/most-expensive`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/fastest-growing`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/top-doctors`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/specialty-breakdown`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/downloads`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/timeline`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/insights/minnesota-fraud-capital`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/arizona-problem`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/ny-home-care`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/specialty-drugs`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/most-patients`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/impossible-volume`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/benford-analysis`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/change-points`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/billing-similarity`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/highest-confidence`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/geographic-hotspots`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/billing-networks`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/round-numbers`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/self-billers`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/spending-growth`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/city-hotspots`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lookup`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/dual-billing`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/smooth-billers`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/ml-analysis`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/specialties`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/how-medicaid-fraud-works`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/top-billing-codes`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/medicaid-fraud-by-state`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/understanding-hcpcs-codes`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/reading-medicaid-billing`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/check`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/2025-fraud-takedown`, lastModified: new Date('2026-02-19'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/cares-inc-exposed`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/chicago-exposed`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/srh-chn-exposed`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/doge-medicaid`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/improper-payments`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/insights/banned-but-billing`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date("2026-03-04"), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-03-04"), changeFrequency: 'yearly', priority: 0.4 },
  ];

  // Provider pages — top 5,000 by spending + all flagged providers
  // (Full 24K dilutes crawl budget; rest are discoverable via internal links)
  let providerPages: MetadataRoute.Sitemap = [];
  try {
    const providersDir = path.join(process.cwd(), 'public', 'data', 'providers');
    const files = fs.readdirSync(providersDir).filter((f: string) => f.endsWith('.json'));

    // Load watchlist NPIs for priority inclusion
    const watchlistNpis = new Set<string>();
    try {
      const sw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'smart-watchlist.json'), 'utf-8'));
      const ew = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'expanded-watchlist.json'), 'utf-8'));
      for (const p of sw) watchlistNpis.add(p.npi);
      for (const p of ew) watchlistNpis.add(p.npi);
    } catch {}

    // Read all providers, sort by totalPaid desc, take top 5000 + all flagged
    const providers: { npi: string; totalPaid: number; flagged: boolean }[] = [];
    for (const f of files) {
      const npi = f.replace('.json', '');
      const flagged = watchlistNpis.has(npi);
      try {
        const data = JSON.parse(fs.readFileSync(path.join(providersDir, f), 'utf-8'));
        providers.push({ npi, totalPaid: data.totalPaid || 0, flagged });
      } catch {
        providers.push({ npi, totalPaid: 0, flagged });
      }
    }
    providers.sort((a, b) => b.totalPaid - a.totalPaid);

    const included = new Set<string>();
    // Add all flagged first
    for (const p of providers) {
      if (p.flagged) included.add(p.npi);
    }
    // Add top by spending until 5000
    for (const p of providers) {
      if (included.size >= 5000) break;
      included.add(p.npi);
    }

    providerPages = Array.from(included).map(npi => ({
      url: `${baseUrl}/providers/${npi}`,
      lastModified: new Date("2026-02-19"),
      changeFrequency: 'monthly' as const,
      priority: watchlistNpis.has(npi) ? 0.6 : 0.5,
    }));
  } catch {
    providerPages = (topProviders as any[]).map((p: any) => ({
      url: `${baseUrl}/providers/${p.npi}`,
      lastModified: new Date("2026-02-19"),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  }

  // State pages
  const statePages: MetadataRoute.Sitemap = (statesSummary as any[])
    .filter((s: any) => s.state !== 'Unknown')
    .map((s: any) => ({
      url: `${baseUrl}/states/${s.state}`,
      lastModified: new Date("2026-02-19"),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // Procedure pages (top 500 only for sitemap, rest discoverable via search)
  const procedurePages: MetadataRoute.Sitemap = (allProcedures as any[])
    .slice(0, 500)
    .map((p: any) => ({
      url: `${baseUrl}/procedures/${p.code}`,
      lastModified: new Date("2026-02-19"),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }));

  // Specialty pages
  const specialtyPages: MetadataRoute.Sitemap = (specialtiesData as any[]).map((s: any) => ({
    url: `${baseUrl}/specialties/${s.slug}`,
    lastModified: new Date("2026-02-19"),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Hotspot pages
  const hotspotPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/hotspots`, lastModified: new Date("2026-02-19"), changeFrequency: 'weekly', priority: 0.8 },
    ...(cityHotspots as any[]).map((c: any) => ({
      url: `${baseUrl}/hotspots/${c.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`,
      lastModified: new Date("2026-02-19"),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // State risk profile pages
  const riskPages: MetadataRoute.Sitemap = (geoRisk as any[]).map((s: any) => ({
    url: `${baseUrl}/risk/${s.state}`,
    lastModified: new Date("2026-02-19"),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...corePages, ...providerPages, ...statePages, ...procedurePages, ...specialtyPages, ...hotspotPages, ...riskPages];
}
