'use client';

import Link from 'next/link';

const INSIGHT_MAP: Record<string, { title: string; description: string }> = {
  'covid-vaccines': {
    title: 'COVID Vaccine Spending',
    description: 'How $28B in vaccine administration reshaped Medicaid billing patterns',
  },
  'covid-testing': {
    title: 'COVID Testing Gold Rush',
    description: 'The labs and clinics that billed millions for pandemic-era testing',
  },
  'pandemic-profiteers': {
    title: 'Pandemic Profiteers',
    description: 'Providers whose billing surged during COVID — and never came back down',
  },
  'most-expensive': {
    title: 'Most Expensive Procedures',
    description: 'The costliest procedure codes driving Medicaid spending nationwide',
  },
  'fastest-growing': {
    title: 'Fastest-Growing Procedures',
    description: 'Procedure codes with the sharpest year-over-year spending increases',
  },
  'top-doctors': {
    title: 'Top Individual Providers',
    description: 'The doctors and clinicians billing the most to Medicaid',
  },
  'specialty-breakdown': {
    title: 'Specialty Breakdown',
    description: 'How Medicaid spending distributes across medical specialties',
  },
  'arizona-problem': {
    title: 'Arizona\u2019s Fraud Problem',
    description: 'Why Arizona leads the nation in flagged Medicaid providers',
  },
  'ny-home-care': {
    title: 'New York Home Care',
    description: 'The $20B home care industry and its billing anomalies',
  },
  'specialty-drugs': {
    title: 'Specialty Drug Costs',
    description: 'High-cost specialty drugs and the providers dispensing them',
  },
  'most-patients': {
    title: 'Most Patients Served',
    description: 'Providers treating the highest volume of Medicaid beneficiaries',
  },
  'impossible-volume': {
    title: 'Impossible Billing Volume',
    description: 'Providers billing for more hours than exist in a day',
  },
  'benford-analysis': {
    title: 'Benford\u2019s Law Analysis',
    description: 'Digit-frequency tests reveal unnatural patterns in billing data',
  },
  'change-points': {
    title: 'Billing Change Points',
    description: 'Detecting sudden shifts in provider billing behavior over time',
  },
  'billing-similarity': {
    title: 'Billing Similarity Clusters',
    description: 'Groups of providers with suspiciously identical billing patterns',
  },
  'highest-confidence': {
    title: 'Highest-Confidence Flags',
    description: 'Providers flagged by the most independent fraud indicators',
  },
  'geographic-hotspots': {
    title: 'Geographic Hotspots',
    description: 'States and regions with concentrated billing anomalies',
  },
  'billing-networks': {
    title: 'Billing Networks',
    description: 'Connected provider groups sharing patients and billing patterns',
  },
  'round-numbers': {
    title: 'Round-Number Billing',
    description: 'Providers whose charges cluster suspiciously at round dollar amounts',
  },
  'self-billers': {
    title: 'Self-Billing Providers',
    description: 'Clinicians who bill Medicaid under their own name rather than a group',
  },
  'spending-growth': {
    title: 'Spending Growth Trends',
    description: 'Year-over-year Medicaid spending trajectories across categories',
  },
  'city-hotspots': {
    title: 'City Fraud Hotspots',
    description: 'The cities with the highest concentration of flagged providers',
  },
  'smooth-billers': {
    title: 'Suspiciously Smooth Billers',
    description: 'Providers with unnaturally consistent month-to-month billing',
  },
  'dual-billing': {
    title: 'Dual-Billing Anomalies',
    description: 'Providers billing under multiple identifiers or arrangements',
  },
  'cares-inc-exposed': {
    title: 'CARES INC: 6,886% Billing Explosion',
    description: 'From $1.6M to $112.6M in one year — seven fraud flags triggered',
  },
  'banned-but-billing': {
    title: 'Banned But Still Billing',
    description: '40 excluded providers found in Medicaid billing data',
  },
  'chicago-exposed': {
    title: 'City of Chicago: 942% Surge',
    description: '$23M to $240M in ambulance billing at 10× the national median',
  },
  'srh-chn-exposed': {
    title: 'SRH CHN: $239M From Nowhere',
    description: 'A brand-new entity billing hundreds of millions immediately',
  },
  'minnesota-fraud-capital': {
    title: 'Minnesota: Fraud Capital',
    description: 'One state has 4× its population share of Medicaid fraud exclusions',
  },
};

interface RelatedInsightsProps {
  currentSlug: string;
  relatedSlugs: string[];
}

export default function RelatedInsights({ currentSlug, relatedSlugs }: RelatedInsightsProps) {
  const links = relatedSlugs
    .filter((slug) => slug !== currentSlug && INSIGHT_MAP[slug])
    .slice(0, 3);

  if (links.length === 0) return null;

  return (
    <div className="border-t border-dark-500/50 pt-8 mt-12">
      <h3 className="text-sm font-semibold text-slate-400 mb-3">Related Investigations</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((slug) => {
          const insight = INSIGHT_MAP[slug];
          return (
            <Link
              key={slug}
              href={`/insights/${slug}`}
              className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400 transition-colors group"
            >
              <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                {insight.title}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {insight.description} &rarr;
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
