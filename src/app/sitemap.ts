import { MetadataRoute } from 'next';
import topProviders from '../../public/data/top-providers-1000.json';
import allProcedures from '../../public/data/all-procedures.json';
import statesSummary from '../../public/data/states-summary.json';
import fs from 'fs';
import path from 'path';

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
    { url: `${baseUrl}/guides/how-medicaid-fraud-works`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/top-billing-codes`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/medicaid-fraud-by-state`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/understanding-hcpcs-codes`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/reading-medicaid-billing`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/check`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/cares-inc-exposed`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/chicago-exposed`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/insights/srh-chn-exposed`, lastModified: new Date("2026-02-19"), changeFrequency: 'monthly', priority: 0.9 },
  ];

  // Provider pages (from file system)
  let providerPages: MetadataRoute.Sitemap = [];
  try {
    const providersDir = path.join(process.cwd(), 'public', 'data', 'providers');
    const files = fs.readdirSync(providersDir);
    providerPages = files
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        url: `${baseUrl}/providers/${f.replace('.json', '')}`,
        lastModified: new Date("2026-02-19"),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
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

  return [...corePages, ...providerPages, ...statePages, ...procedurePages];
}
