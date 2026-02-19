import type { Metadata } from "next";
import Link from "next/link";
import RelatedInsights from "@/components/RelatedInsights";
import { formatNumber } from "@/lib/format";
import data from "../../../../public/data/mn-fraud-capital.json";

export const metadata: Metadata = {
  title: "Minnesota: America's Medicaid Fraud Capital — OpenMedicaid",
  description: "Minnesota has 4x its population share of fraud-heavy OIG exclusions, the $250M+ Feeding Our Future scandal, autism therapy fraud, and a housing program so broken the state shut it down. How generous programs with weak oversight became a magnet for organized fraud.",
  openGraph: {
    title: "Minnesota: America's Medicaid Fraud Capital",
    description: "One state has 4x its population share of Medicaid fraud exclusions. Home care, transportation, and interpreter services are the epicenter.",
  },
};

const stats = data.stats;

export default function MinnesotaFraudCapital() {
  const perCapitaRanked = [...data.stateComparison].sort((a, b) => b.perMillion - a.perMillion);
  const mnRank = perCapitaRanked.findIndex(s => s.state === "MN") + 1;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
        <span>/</span>
        <span className="text-slate-400">Minnesota: Fraud Capital</span>
      </nav>

      {/* Headline */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium text-red-400">Investigation</span>
          <span className="text-xs text-slate-500">February 19, 2026</span>
          <span className="text-xs text-slate-600">&middot;</span>
          <span className="text-xs text-slate-500">12 min read</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
          Minnesota: America&apos;s Medicaid Fraud Capital
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Minnesota has some of the most generous Medicaid programs in the country — and some of the weakest oversight.
          The result? A state with 1.7% of America&apos;s population accounts for <strong className="text-white">{stats.fraudHeavyPct}%</strong> of
          all federal exclusions in fraud-heavy categories like home health, personal care, and transportation services. 
          The DOJ has set up a special strike force just for Minnesota. People literally fly in from other states to commit Medicaid fraud here.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-red-400">{formatNumber(stats.totalMNExclusions)}</div>
          <div className="text-xs text-slate-400 mt-1">MN Providers Excluded</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-amber-400">{stats.fraudHeavyPct}%</div>
          <div className="text-xs text-slate-400 mt-1">Of National Fraud-Heavy Exclusions</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-orange-400">81%</div>
          <div className="text-xs text-slate-400 mt-1">Of All Interpreter Fraud is in MN</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-white">{stats.a1ConvictionsSince2023}</div>
          <div className="text-xs text-slate-400 mt-1">Fraud Convictions Since 2023</div>
        </div>
      </div>

      {/* The Scale */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">The Scale of the Problem</h2>
        <p className="text-slate-300 mb-4">
          When the federal government catches a healthcare provider committing fraud, they&apos;re placed on the 
          OIG Exclusion List — permanently banned from billing Medicare and Medicaid. There are currently {formatNumber(stats.totalUSExclusions)} providers 
          on this list nationwide.
        </p>
        <p className="text-slate-300 mb-4">
          Minnesota has {formatNumber(stats.totalMNExclusions)} of them — {stats.mnPctOfTotal}% of the national total. That alone isn&apos;t shocking for a 
          mid-sized state. But look closer at <em>what types</em> of fraud these exclusions involve, and a disturbing pattern emerges.
        </p>
        <p className="text-slate-300 mb-6">
          In fraud-heavy categories — home health agencies, personal care providers, medical transportation companies, 
          and interpreter services — Minnesota accounts for <strong className="text-red-400">{stats.fraudHeavyPct}%</strong> of 
          all national exclusions. That&apos;s nearly <strong className="text-white">4 times</strong> what you&apos;d expect based on population.
        </p>

        {/* State comparison table */}
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/40">
            <h3 className="text-sm font-semibold text-white">Fraud-Heavy Exclusions Per Million Residents</h3>
            <p className="text-xs text-slate-500 mt-1">Home health, personal care, transportation, interpreter services</p>
          </div>
          <div className="divide-y divide-slate-700/30">
            {perCapitaRanked.slice(0, 10).map((s, i) => (
              <div key={s.state} className={`flex items-center justify-between px-4 py-2.5 ${s.state === 'MN' ? 'bg-red-500/10' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-6">#{i + 1}</span>
                  <span className={`text-sm font-medium ${s.state === 'MN' ? 'text-red-400' : 'text-white'}`}>
                    {s.state} {s.state === 'MN' && '⚠️'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">{s.fraudHeavy} exclusions</span>
                  <span className={`text-sm font-bold ${s.state === 'MN' ? 'text-red-400' : 'text-slate-300'}`}>
                    {s.perMillion}/M
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Being Exploited */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">What&apos;s Being Exploited</h2>
        <p className="text-slate-300 mb-4">
          Minnesota&apos;s Medicaid program offers unusually generous community-based services: personal care attendants, 
          home health aides, medical transportation, housing stabilization, interpreter services, and day treatment. 
          These programs were designed with good intentions — keeping disabled and elderly people in their communities 
          instead of institutions.
        </p>
        <p className="text-slate-300 mb-4">
          But generous programs with minimal verification create a simple equation: <strong className="text-white">more money 
          + less oversight = more fraud</strong>. And that&apos;s exactly what happened.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🏥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Personal Care & Home Health</h3>
            <p className="text-sm text-slate-400 mb-3">
              {stats.fraudHeavyMN > 200 ? '270+' : stats.fraudHeavyMN} providers excluded. Billing for care never provided, 
              ghost employees, fabricated timesheets. PCA services (code T1019) alone account for over $113 billion 
              in national Medicaid spending.
            </p>
            <div className="text-xs text-red-400 font-medium">MN: 155 personal care + 117 home health exclusions</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🚐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Medical Transportation</h3>
            <p className="text-sm text-slate-400 mb-3">
              29 transportation companies excluded in Minnesota — 4th highest in the nation. 
              Billing for rides that never happened, phantom passengers, made-up destinations. 
              Faribault (pop. 24,000) alone has 8 transportation fraud exclusions.
            </p>
            <div className="text-xs text-red-400 font-medium">MN #4 nationally for transport fraud</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🗣️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Interpreter Services</h3>
            <p className="text-sm text-slate-400 mb-3">
              This is the most striking number: <strong className="text-white">13 of 16</strong> interpreter/translator 
              fraud exclusions in the <em>entire country</em> are in Minnesota. 81%. 
              Billing for interpretation services that never occurred or greatly exaggerating hours.
            </p>
            <div className="text-xs text-red-400 font-medium">81% of ALL national interpreter fraud</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="text-lg font-semibold text-white mb-2">Housing Stabilization</h3>
            <p className="text-sm text-slate-400 mb-3">
              Minnesota&apos;s Housing Stabilization Services (HSS) program has attracted &quot;fraud tourists&quot; — 
              people traveling from other states to exploit the program. In February 2026, two Philadelphia 
              men pleaded guilty to a $3.5 million HSS fraud scheme using AI-generated fake records.
            </p>
            <div className="text-xs text-red-400 font-medium">DOJ: First AI-assisted Medicaid fraud case</div>
          </div>
        </div>
      </section>

      {/* The Fraud Tourist Phenomenon */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">&quot;Fraud Tourists&quot;: When Other States Target Your Programs</h2>
        <div className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-6 mb-6">
          <p className="text-slate-300 mb-3">
            On February 10, 2026, the DOJ announced that two Pennsylvania men had pleaded guilty to &quot;repeatedly 
            traveling from Philadelphia to Minneapolis to defraud Minnesota&apos;s Housing Stabilization Services program 
            of approximately $3.5 million.&quot;
          </p>
          <p className="text-slate-300 mb-3">
            They marketed themselves as &quot;The Housing Guys&quot; at homeless shelters, recruited vulnerable Medicaid 
            beneficiaries, and when insurance companies questioned their claims, <strong className="text-white">they used artificial 
            intelligence to fabricate records</strong>.
          </p>
          <p className="text-sm text-slate-400">
            The DOJ called it &quot;part of a collaboration between the U.S. Attorney&apos;s Office for the District of 
            Minnesota and the Criminal Division&apos;s Fraud Section to combat prolific fraud on government programs in 
            Minnesota.&quot; When the DOJ has a special collaboration just for your state&apos;s fraud problem, you know it&apos;s bad.
          </p>
          <div className="mt-3 text-xs text-slate-500">
            Source: <a href="https://oig.hhs.gov/fraud/enforcement/fraud-tourists-plead-guilty-to-minneapolis-medicaid-fraud/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">HHS OIG Enforcement Actions, Feb 10, 2026</a>
          </div>
        </div>
        <p className="text-slate-300 mb-4">
          Minnesota is so well-known for fraud vulnerability that it has become a destination. 
          The term &quot;fraud tourist&quot; — used in the DOJ&apos;s own press release — tells you everything about how the state&apos;s 
          programs are perceived by organized criminals.
        </p>
      </section>

      {/* The Faribault Cluster */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">The Faribault Cluster</h2>
        <p className="text-slate-300 mb-4">
          Faribault, Minnesota is a city of about 24,000 people, roughly 50 miles south of Minneapolis. 
          It has <strong className="text-white">21 OIG-excluded providers</strong> — 
          a staggering number for a small city. Eight of those are transportation company fraud cases, 
          nearly all since 2019.
        </p>
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/40">
            <h3 className="text-sm font-semibold text-white">Faribault Exclusions ({data.faribaultCluster.length} total)</h3>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-80 overflow-y-auto">
            {data.faribaultCluster.map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-4 py-2">
                <div>
                  <span className="text-sm text-white">{p.name}</span>
                  <span className="text-xs text-slate-500 ml-2">{p.specialty}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {p.date.slice(0,4)}-{p.date.slice(4,6)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Surge */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">A Fraud Epidemic That&apos;s Getting Worse</h2>
        <p className="text-slate-300 mb-4">
          The numbers have been accelerating. In 2018, Minnesota had just 9 exclusions in fraud-heavy categories. 
          By 2023 and 2024, that number hit 44 each year — a <strong className="text-white">nearly 5x increase</strong>.
        </p>
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/40">
            <h3 className="text-sm font-semibold text-white">MN Fraud-Heavy Exclusions by Year</h3>
          </div>
          <div className="px-4 py-4">
            {data.yearlyTrend.filter((y: any) => y.year >= 2018).map((y: any) => (
              <div key={y.year} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-slate-400 w-10">{y.year}</span>
                <div className="flex-1 bg-slate-700/30 rounded-full h-5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(8, (y.fraudHeavy / 50) * 100)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{y.fraudHeavy}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 w-16 text-right">{y.total} total</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Bigger Picture: 2020s Minnesota Fraud Scandals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">The Bigger Picture: Minnesota&apos;s Fraud Epidemic Goes Far Beyond Medicaid</h2>
        <p className="text-slate-300 mb-4">
          Our OIG exclusion data captures only the Medicaid/Medicare fraud side. But Minnesota&apos;s fraud problem
          extends across virtually every federal social services program the state administers — and the scale is staggering.
        </p>

        <div className="space-y-4 mb-6">
          {/* Feeding Our Future */}
          <div className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🍽️</span>
              <h3 className="text-lg font-semibold text-white">Feeding Our Future — $250M+ Stolen</h3>
              <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">Largest Pandemic Fraud in US History</span>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              A Minnesota nonprofit that claimed to distribute meals to schoolchildren during COVID-19. Federal prosecutors say 
              it stole over <strong className="text-white">$250 million</strong> while providing few or no meals at most locations. 
              Attorney General Merrick Garland called it the country&apos;s largest pandemic relief fraud scheme.
            </p>
            <p className="text-sm text-slate-300 mb-3">
              At its peak, Feeding Our Future listed 299 &quot;meal sites&quot; claiming to serve 90 million meals in under 2 years — 
              over 120,000 meals per day. One site the FBI surveilled claimed 6,000 meals/day but averaged about 40 visitors.
              Only ~3% of funding was actually spent on food.
            </p>
            <p className="text-sm text-slate-300 mb-3">
              As of early 2026, <strong className="text-white">79 individuals have been indicted</strong>, with more than 50 guilty pleas and 
              7 found guilty at trial, including scheme leader Aimee Bock. The state&apos;s education department flagged fraud signs 
              as early as 2019, but a lawsuit alleging racial discrimination created a chilling effect on oversight — a state 
              legislative audit later confirmed this pressure compromised the agency&apos;s ability to investigate.
            </p>
            <div className="bg-slate-800/40 rounded-lg p-3 mt-3">
              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Political connections:</strong> The scheme involved ties to Minneapolis Mayor Jacob Frey&apos;s 
                office (adviser Abdi Salah pled guilty to wire fraud), council member Jamal Osman (whose wife ran a meal site 
                receiving $400K+), and state senator Omar Fateh. Multiple politicians returned donations from implicated individuals.
              </p>
            </div>
          </div>

          {/* Autism Therapy (EIDBI) */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🧩</span>
              <h3 className="text-lg font-semibold text-white">Autism Therapy (EIDBI) Fraud</h3>
            </div>
            <p className="text-sm text-slate-300 mb-2">
              Federal investigators found at least a dozen Feeding Our Future defendants also owned or were associated 
              with autism therapy centers in Minnesota. In December 2025, Asha Farhan Hassan pled guilty to stealing 
              <strong className="text-white"> $14 million</strong> in EIDBI (Early Intensive Developmental and Behavioral Intervention) funding.
              Minnesota has since <strong className="text-white">paused payments in 14 Medicaid programs</strong> including autism therapy 
              while conducting audits.
            </p>
          </div>

          {/* Housing Stabilization */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏠</span>
              <h3 className="text-lg font-semibold text-white">Housing Stabilization — Shut Down Entirely</h3>
            </div>
            <p className="text-sm text-slate-300 mb-2">
              Minnesota&apos;s Integrated Community Supports (ICS) program went from $4.6 million/year at launch in 2021 to 
              <strong className="text-white"> $180 million in 2025</strong> — &quot;explosive growth&quot; that Minnesota has now recognized was 
              largely fraudulent. At least 17 providers were suspended for credible fraud allegations. One ICS enrollee, 
              Rick Clemmer, died in 2025 from a medical emergency with no one present — despite his provider billing 
              for 12 hours of daily one-on-one care. Minnesota has since <strong className="text-white">shut down the entire 
              housing stabilization system</strong>.
            </p>
          </div>

          {/* Substance Abuse */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💊</span>
              <h3 className="text-lg font-semibold text-white">Substance Abuse Treatment Fraud</h3>
            </div>
            <p className="text-sm text-slate-300 mb-2">
              Evergreen, a substance abuse provider, billed for <strong className="text-white">203 hours of service from a single 
              employee in one day</strong>. Its CEO and CFO pled guilty to conspiracy to commit wire fraud. Separately, 
              Kyros (Minnesota&apos;s largest addiction recovery provider) used a shell nonprofit to bill Medicaid 
              for questionable services like &quot;watching movies&quot; — routing 96% of the nonprofit&apos;s revenue back to for-profit Kyros 
              subsidiaries. DHS halted payments in 2024.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/5 to-red-500/5 border border-amber-500/20 rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-2">⚡ The Common Thread</h3>
          <p className="text-sm text-slate-300">
            These aren&apos;t isolated incidents — they&apos;re interconnected. The same individuals and networks 
            appear across multiple fraud schemes: Feeding Our Future defendants running autism therapy centers, 
            housing fraud operators expanding into personal care, substance abuse providers exploiting billing loopholes.
            Minnesota&apos;s oversight apparatus failed to connect the dots across programs, allowing the same actors to 
            exploit multiple funding streams simultaneously.
          </p>
        </div>
      </section>

      {/* Where It's Concentrated */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Minneapolis: The Epicenter</h2>
        <p className="text-slate-300 mb-4">
          More than a quarter of all Minnesota exclusions — {data.topCities[0]?.total || 353} — are in Minneapolis alone. 
          Combined with Saint Paul, the Twin Cities metro accounts for the vast majority of the state&apos;s Medicaid fraud.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {data.topCities.slice(0, 10).map((c: any, i: number) => (
            <div key={c.city} className="flex items-center justify-between bg-slate-800/30 rounded-lg px-4 py-2.5 border border-slate-700/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">#{i + 1}</span>
                <span className="text-sm text-white">{c.city.charAt(0) + c.city.slice(1).toLowerCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">{c.total}</span>
                {c.fraudHeavy > 0 && (
                  <span className="text-xs text-red-400 ml-2">({c.fraudHeavy} fraud-heavy)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Exclusions</h2>
        <p className="text-slate-300 mb-4">
          Here are the most recent providers excluded from federal healthcare programs in Minnesota for 
          fraud-heavy service categories. Each of these individuals was convicted of healthcare fraud (1128a1) 
          or excluded for program-related conduct.
        </p>
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40 bg-slate-800/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400">City</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400">Category</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {data.recentCases.slice(0, 20).map((c: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2 text-white">{c.name}</td>
                    <td className="px-4 py-2 text-slate-400">{c.city}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.specialty.includes('HOME HEALTH') ? 'bg-red-500/10 text-red-400' :
                        c.specialty.includes('PERSONAL CARE') ? 'bg-orange-500/10 text-orange-400' :
                        c.specialty.includes('TRANSPORTATION') ? 'bg-amber-500/10 text-amber-400' :
                        c.specialty.includes('INTERPRETER') ? 'bg-purple-500/10 text-purple-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {c.specialty.includes('HOME HEALTH') ? 'Home Health' :
                         c.specialty.includes('PERSONAL CARE') ? 'Personal Care' :
                         c.specialty.includes('TRANSPORTATION') ? 'Transportation' :
                         c.specialty.includes('INTERPRETER') ? 'Interpreter' :
                         c.specialty.includes('COUNSELING') ? 'Counseling' :
                         c.specialty.includes('ASSISTED') ? 'Assisted Living' :
                         c.specialty}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-500 text-xs">
                      {c.date.slice(0,4)}-{c.date.slice(4,6)}-{c.date.slice(6,8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Prosecution Clusters */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Organized Rings: When Multiple People Go Down Together</h2>
        <p className="text-slate-300 mb-4">
          Medicaid fraud in Minnesota isn&apos;t just lone actors — it&apos;s organized. Since 2018, there have been <strong className="text-white">{data.prosecutionClusters?.length || 55} dates</strong> where 
          3 or more Minnesota providers were excluded simultaneously — a sign they were caught in the same investigation. 
          The largest single-day action took down <strong className="text-white">{stats.largestCluster || 20} people at once</strong>.
        </p>
        <p className="text-slate-300 mb-4">
          These coordinated exclusions typically involve clusters of home health agencies, personal care providers, 
          interpreters, and transportation companies — all the services needed to create a complete phantom billing operation.
        </p>
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/40">
            <h3 className="text-sm font-semibold text-white">Largest Coordinated Exclusion Actions (2023–2026)</h3>
          </div>
          <div className="divide-y divide-slate-700/30">
            {(data.prosecutionClusters || []).filter((c: any) => c.date >= '20230101' && c.count >= 8).map((c: any) => (
              <div key={c.date} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
                    {c.date.slice(0,4)}-{c.date.slice(4,6)}-{c.date.slice(6,8)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">{c.count} excluded</span>
                    {c.fraudHeavyCount > 0 && (
                      <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">{c.fraudHeavyCount} fraud-heavy</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.people.slice(0, 12).map((p: any, i: number) => (
                    <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded">
                      {p.name || 'Unnamed'} <span className="text-slate-500">({p.specialty?.includes('HOME HEALTH') ? 'HH' : p.specialty?.includes('PERSONAL CARE') ? 'PCA' : p.specialty?.includes('TRANSPORT') ? 'Trans' : p.specialty?.includes('INTERPRETER') ? 'Interp' : p.specialty?.includes('HEALTH CARE AIDE') ? 'HCA' : p.specialty?.includes('NURSE') ? 'Nurse' : p.specialty?.slice(0,10)})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address Clusters */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Same Address, Multiple Exclusions</h2>
        <p className="text-slate-300 mb-4">
          When multiple excluded providers share the same address, it often indicates an organized operation — 
          a single location running multiple fraudulent entities. We found <strong className="text-white">{data.addressClusters?.length || 21} addresses</strong> in 
          Minnesota with 2 or more excluded providers.
        </p>
        <div className="space-y-3 mb-6">
          {(data.addressClusters || []).filter((a: any) => a.count >= 2).slice(0, 8).map((a: any, i: number) => (
            <div key={i} className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-white">{a.address}</span>
                  <span className="text-xs text-slate-500 ml-2">{a.city}</span>
                </div>
                <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">{a.count} excluded</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {a.people.map((p: any, j: number) => (
                  <span key={j} className="text-xs text-slate-400">
                    {p.name} <span className="text-slate-600">({p.specialty?.slice(0, 15)}, {p.date.slice(0,4)})</span>
                    {j < a.people.length - 1 && ' · '}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-400">
          Notable: The Akore family at 2200 Homestead Ave N, Saint Paul — Kwesi Akore (home health, excluded Jan 2024), 
          followed by Angela Stover-Akore (home health, excluded Jul 2024). Same address, same service type, 
          six months apart. The Clement family at 3931 Princeton Trl, Saint Paul — both excluded for home health agency fraud. 
          And three providers at 3567 Commonwealth Rd, Saint Paul — personal care and interpreter services, all excluded within a year.
        </p>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Why This Keeps Happening</h2>
        <p className="text-slate-300 mb-4">
          Minnesota&apos;s Medicaid fraud problem isn&apos;t a mystery. It&apos;s a predictable consequence of program design:
        </p>
        <div className="space-y-4 mb-6">
          <div className="flex gap-4 items-start">
            <div className="text-2xl">1️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Generous Benefits, Minimal Verification</h3>
              <p className="text-sm text-slate-400">
                Minnesota pays for services — personal care, transportation, interpretation — that many states don&apos;t cover 
                at all, or cover with strict caps. The state&apos;s self-directed PCA program allows beneficiaries to hire 
                their own caregivers with minimal state verification that care actually occurred.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-2xl">2️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Low Barriers to Entry</h3>
              <p className="text-sm text-slate-400">
                Starting a home health agency or transportation company in Minnesota and getting enrolled as a Medicaid 
                provider is relatively easy. The &quot;fraud tourists&quot; case proves this — out-of-state individuals can 
                set up operations and start billing quickly.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-2xl">3️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Pay-and-Chase Model</h3>
              <p className="text-sm text-slate-400">
                Like most states, Minnesota pays claims first and investigates later. By the time fraud is detected, 
                the money is often gone — sometimes sent overseas. The average time between fraud and exclusion is years, 
                not months.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-2xl">4️⃣</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Vulnerable Populations as Targets</h3>
              <p className="text-sm text-slate-400">
                Fraudsters recruit Medicaid beneficiaries — often elderly, disabled, or non-English-speaking 
                individuals — to sign forms for services they never received. The beneficiaries often don&apos;t understand 
                what they&apos;re signing or are given small payments as incentives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Bottom Line */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">The Bottom Line</h2>
          <p className="text-slate-300 mb-3">
            Minnesota taxpayers and Medicaid beneficiaries deserve better. The state&apos;s generous programs were 
            created to help vulnerable people — instead, they&apos;ve become a feeding ground for organized fraud schemes. 
            The DOJ shouldn&apos;t need a special strike force for one state&apos;s Medicaid fraud.
          </p>
          <p className="text-slate-300 mb-3">
            The numbers don&apos;t lie: {formatNumber(stats.totalMNExclusions)} exclusions, {stats.fraudHeavyPct}% of national fraud-heavy exclusions, 
            81% of all interpreter fraud in America, and a 5x increase in fraud-heavy exclusions since 2018. 
            This isn&apos;t just bad luck — it&apos;s a systemic oversight failure.
          </p>
          <p className="text-sm text-slate-400">
            Until Minnesota implements meaningful provider verification, pre-payment auditing, and higher barriers 
            to enrollment, the state will continue to be a magnet for fraud. And taxpayers will keep footing the bill.
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-white mb-3">Methodology</h2>
        <p className="text-sm text-slate-400 mb-2">
          This analysis uses the HHS Office of Inspector General (OIG) List of Excluded Individuals/Entities (LEIE), 
          which contains {formatNumber(stats.totalUSExclusions)} providers excluded from federal healthcare programs. 
          We categorized exclusions by specialty type, state, and exclusion code.
        </p>
        <p className="text-sm text-slate-400 mb-2">
          &quot;Fraud-heavy categories&quot; include: Home Health Agency, Personal Care Provider, Transportation Company, 
          Interpreter/Translator, Assisted Living Facility, and Counseling Center — service types with the highest 
          rates of documented Medicaid fraud nationally.
        </p>
        <p className="text-sm text-slate-400">
          Exclusion type 1128a1 indicates conviction of a criminal offense related to the delivery of an item or 
          service under Medicare or a State health care program. Per-capita rates use 2023 Census population estimates.
          DOJ case details from HHS-OIG Enforcement Actions database.
        </p>
      </section>

      <RelatedInsights currentSlug="minnesota-fraud-capital" relatedSlugs={["arizona-problem", "ny-home-care", "pandemic-profiteers", "spending-growth", "city-hotspots"]} />
    </article>
  );
}
