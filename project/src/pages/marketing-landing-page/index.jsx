import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import legacyArchitectLogo from '../../assets/legacy-architect-logo.svg';

const faqItems = [
  {
    q: 'What exactly is Legacy Architect OS?',
    a: 'Legacy Architect OS is an AI-powered operating system for service businesses. It combines the Hidden Profit + Exit Audit, mission-based automations, and a practical dashboard to plug profit leaks and build a business that is easier to run and easier to transfer or sell.',
  },
  {
    q: 'Who is Legacy Architect OS for?',
    a: 'It is built for local service owners in HVAC, plumbing, electrical, roofing, and similar trades who are busy and profitable but still too owner-dependent.',
  },
  {
    q: 'Do I need to be technical to use it?',
    a: 'No. The experience is plain-English and guided. If you can manage texts, emails, and a calendar, you can run missions successfully.',
  },
  {
    q: 'How fast will I see results?',
    a: 'Most owners see early wins in 30 to 60 days from Cash-Boost or AI Reception. Exit-readiness and data-room gains generally compound over 3 to 12 months.',
  },
  {
    q: 'What is the Hidden Profit + Exit Audit?',
    a: 'A 15 to 20 minute check-up that scores AI Readiness and Exit Readiness, highlights major leaks, and recommends your top missions in priority order.',
  },
  {
    q: 'Can I start with one mission only?',
    a: 'Yes. Many owners start with a single mission, prove ROI, then activate the second mission once operations are ready.',
  },
  {
    q: 'Is this compliant for outreach?',
    a: 'The workflows are designed to support compliant outreach patterns and opt-out handling. You still need to follow local laws and only contact people you are allowed to contact.',
  },
  {
    q: 'Does this replace my CPA, lawyer, or broker?',
    a: 'No. It makes their job easier by organizing your numbers, documentation, and operating story.',
  },
  {
    q: 'What happens after trial?',
    a: 'You choose a paid plan or export key insights and reports. Your data is not held hostage.',
  },
  {
    q: 'Can I use this if I never plan to sell?',
    a: 'Yes. The same systems that improve exit value also reduce daily chaos and increase owner freedom.',
  },
];

const missionCards = [
  {
    title: 'Cash-Boost',
    body: 'Re-activate past customers, stale quotes, and old leads into booked jobs.',
  },
  {
    title: 'AI Reception',
    body: 'Stop losing revenue to missed calls with 24/7 qualification and booking.',
  },
  {
    title: 'Reviews & Reputation',
    body: 'Trigger review requests at the right moment and improve trust at scale.',
  },
  {
    title: 'Buyer-Ready Data Room',
    body: 'Organize financials, SOPs, contracts, and documentation buyers expect.',
  },
];

const kbCards = [
  'What Is Legacy Architect OS? (Plain-English Overview)',
  'The Fastest Way to Get Value in Your First 30 Days',
  'How the Hidden Profit + Exit Audit Works (Step-by-Step)',
  'Cash-Boost Mission Overview: How It Works',
  'Understanding Your AI Readiness Score',
  'Understanding Your Exit Readiness Score',
];

const scoreBullets = [
  'AI Readiness baseline with your fastest automation opportunities',
  'Exit Readiness baseline with top de-risking priorities',
  'Mission order ranked by expected speed-to-impact',
  'A practical 90-day action sequence to execute with your team',
];

const MarketingLandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#03070a] text-[#ebf4f8]">
      <Helmet>
        <title>Legacy Architect OS | Exit Readiness for Business Owners Who Want Options</title>
        <meta
          name="description"
          content="Run the Hidden Profit + Exit Readiness Check-Up. Launch mission-based automations to increase cash flow, reduce owner dependence, and build a buyer-ready business."
        />
      </Helmet>

      <header className="sticky top-0 z-40 border-b border-[#0d1e26] bg-[#03070a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-left"
          >
            <img src={legacyArchitectLogo} alt="Legacy Architect OS" className="h-10 w-auto sm:h-12" />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/audit-checkup')}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#03131b] transition hover:bg-[#bfe8ff]"
            >
              Start Check-Up
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center md:pb-24 md:pt-28">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-[#0f4f6b] bg-[#022e41] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#69d4ff]">
            Built for Main Street Owners
          </div>
          <h1
            className="mx-auto max-w-3xl text-4xl leading-tight text-white md:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
          >
            Exit Readiness for Business Owners Who Want Options
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#a5c2cf] md:text-base">
            Legacy Architect OS helps you identify hidden profit leaks, reduce owner dependence, and build buyer-ready
            infrastructure without adding chaos. Start with one check-up, then launch one mission at a time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/audit-checkup')}
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#03131b] transition hover:bg-[#bfe8ff]"
            >
              Start Hidden Profit + Exit Readiness Check-Up
            </button>
            <button
              onClick={() => navigate('/help-center')}
              className="rounded-full border border-[#21424f] px-7 py-3 text-sm font-medium text-[#9fc5d6] transition hover:border-[#2b6175] hover:text-white"
            >
              Explore Knowledge Base
            </button>
          </div>
        </section>

        <section className="border-y border-[#0e1f28] bg-[#040b10]">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
            <div>
              <h2
                className="text-3xl text-white md:text-4xl"
                style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
              >
                Hidden Profits and Owner Dependence
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#a3bfcc] md:text-base">
                Most service businesses are profitable, but fragile. Revenue depends on the owner, follow-up is
                inconsistent, and documentation is scattered. This platform turns those weak points into structured
                systems you can measure.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {missionCards.map((card) => (
                <article key={card.title} className="border border-[#193341] bg-[#050f15] p-4">
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#93b4c2]">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <h2
            className="text-center text-3xl text-white md:text-4xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
          >
            Start with the Hidden Profits + Exit Readiness Check-Up
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#9dbecd] md:text-base">
            In 15-20 minutes you get a baseline score, top priorities, and mission recommendations.
          </p>
          <div className="mx-auto mt-8 max-w-2xl border border-[#0b4d66] bg-[#032636] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#79dcff]">You Receive</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#d2ecf6]">
              {scoreBullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-[#51d4ff]">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/audit-checkup')}
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#03131b] transition hover:bg-[#bfe8ff]"
            >
              Start My Check-Up Now
            </button>
          </div>
        </section>

        <section className="border-y border-[#0e1f28] bg-[#050d12]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2
              className="text-center text-3xl text-white md:text-4xl"
              style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
            >
              How It Works
            </h2>
            <div className="mx-auto mt-10 grid max-w-4xl gap-4">
              {[
                ['1', 'Run the Check-Up', 'Complete the Hidden Profit + Exit Audit to find your biggest gaps.'],
                ['2', 'Activate One Mission', 'Launch Cash-Boost, AI Reception, Reviews, or Data Room based on priority.'],
                ['3', 'Track Progress', 'Measure booked jobs, response rates, and readiness score improvements over time.'],
              ].map(([step, title, body]) => (
                <div key={step} className="flex gap-4 border border-[#1a3442] bg-[#07131a] p-5">
                  <div className="h-8 w-8 rounded-full bg-[#0f5675] text-center text-sm font-bold leading-8 text-[#8be2ff]">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-lg text-white">{title}</h3>
                    <p className="mt-1 text-sm text-[#9ab8c6]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <h2
            className="text-center text-3xl text-white md:text-4xl"
            style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="mt-8 divide-y divide-[#1b3642] border border-[#17313d] bg-[#050d12]">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white"
                  >
                    <span>{item.q}</span>
                    <span className="ml-4 text-[#7edaff]">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-[#9dbbc8]">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-[#0e1f28] bg-[#040a0f]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2
              className="text-center text-3xl text-white md:text-4xl"
              style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
            >
              Knowledge Base
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#9dbecd]">
              Practical guides your team can use immediately.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {kbCards.map((title) => (
                <button
                  key={title}
                  onClick={() => navigate('/help-center')}
                  className="border border-[#17323f] bg-[#050f15] p-4 text-left transition hover:border-[#27617a]"
                >
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-xs text-[#95b5c4]">Open in Help Center</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#022736] via-[#05384b] to-[#012733]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-12 text-center md:flex-row md:text-left">
            <div>
              <h2
                className="text-3xl text-white md:text-4xl"
                style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
              >
                Stop Guessing. Start Building a Business That Can Exit Clean.
              </h2>
            </div>
            <button
              onClick={() => navigate('/audit-checkup')}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#03131b] transition hover:bg-[#bfe8ff]"
            >
              Run Check-Up
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MarketingLandingPage;
