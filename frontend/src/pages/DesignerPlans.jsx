import { Link } from "react-router-dom";

/* ── Inline SVG icons ─────────────────────────────────────────────── */
const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconVerified = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    <polyline points="8.5 12.5 11 15 16 10" />
  </svg>
);

/* ── Plan data ────────────────────────────────────────────────────── */
const plans = [
  {
    name: "Free",
    price: "Rs. 0",
    period: "forever",
    tagline: "For students and new talent",
    highlight: false,
    commission: "10%",
    listings: [
      "1 collection only",
      "Up to 3 products",
      "Standard designer profile",
    ],
    ecommerce: [
      "Basic order notifications",
      "Customer reviews on profile",
    ],
    excluded: [
      "No analytics",
      "No inventory tools",
      "No messaging",
    ],
    storefront: [],
    tools: [],
  },
  {
    name: "Pro Monthly",
    price: "Rs. 2,800",
    period: "/ month",
    tagline: "Billed monthly, cancel anytime",
    highlight: true,
    commission: "9%",
    listings: [
      "Up to 5 collections",
      "Up to 30 products",
      "Standard designer profile",
    ],
    ecommerce: [],
    excluded: [
      "No full brand colour customisation",
      "No downloadable reports",
    ],
    storefront: [
      "Custom logo and banner",
      "Lookbook builder",
    ],
    tools: [
      "Sales analytics dashboard",
      "Order and inventory management",
      "Customer messaging",
    ],
    support: "Standard",
  },
  {
    name: "Pro Yearly",
    price: "Rs. 28,000",
    period: "/ year",
    subprice: "Rs. 2,333/month",
    savings: "2 months free , save Rs. 5,600",
    tagline: "Best value for serious designers",
    highlight: false,
    goldAccent: true,
    commission: "8%",
    listings: [
      "Unlimited collections",
      "Unlimited products",
      "Priority designer profile",
    ],
    ecommerce: [],
    excluded: [],
    storefront: [
      "Custom logo and banner",
      "Lookbook builder",
      "Full brand colour customisation",
    ],
    tools: [
      "Sales analytics dashboard",
      "Order and inventory management",
      "Customer messaging",
      "Downloadable sales reports (CSV/PDF)",
    ],
    support: "Priority",
    extras: ["Early access to new features"],
  },
];

/* ────────────────────────────────────────────────────────────────── */
export default function DesignerPlans() {
  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="border-b border-charcoal-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl text-white">Adorzia</Link>
          <div className="flex items-center gap-4">
            <Link to="/designer/login" className="text-xs uppercase tracking-[0.18em] text-stone-400 hover:text-ivory-200 transition-colors">
              Sign In
            </Link>
            <Link
              to="/designer/register"
              className="text-xs uppercase tracking-[0.18em] bg-bronze-600 text-charcoal-900 px-4 py-2 hover:bg-bronze-500 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-bronze-400 mb-4">Designer Plans</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight">
          Build your brand<br />
          <span className="text-bronze-400">on your terms</span>
        </h1>
        <p className="mt-5 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
          Choose the plan that fits where you are. Upgrade, downgrade, or cancel anytime , no lock-in contracts, no hidden fees.
        </p>
      </section>

      {/* ── Plan cards ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-charcoal-800 border-2 border-bronze-500"
                  : plan.goldAccent
                  ? "bg-charcoal-800 border border-bronze-600/40"
                  : "bg-charcoal-800 border border-charcoal-700"
              }`}
            >
              {/* Savings badge */}
              {plan.savings && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bronze-600 text-charcoal-900 text-[10px] uppercase tracking-[0.15em] px-3 py-1 font-medium whitespace-nowrap">
                  {plan.savings}
                </div>
              )}

              {/* Highlight badge */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bronze-600 text-charcoal-900 text-[10px] uppercase tracking-[0.15em] px-3 py-1 font-medium">
                  Most Popular
                </div>
              )}

              {/* Card header */}
              <div className={`px-8 pt-10 pb-6 border-b ${plan.highlight || plan.goldAccent ? "border-bronze-600/30" : "border-charcoal-700"}`}>
                <p className={`text-xs uppercase tracking-[0.22em] mb-3 ${plan.highlight || plan.goldAccent ? "text-bronze-400" : "text-stone-500"}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl text-white">{plan.price}</span>
                  <span className="text-sm text-stone-500">{plan.period}</span>
                </div>
                {plan.subprice && (
                  <p className="text-xs text-stone-500 mt-1">{plan.subprice}</p>
                )}
                <p className="text-sm text-stone-400 mt-3">{plan.tagline}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-charcoal-900 px-3 py-1.5 border border-charcoal-700">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Commission</span>
                  <span className="text-sm font-serif text-bronze-400">{plan.commission}</span>
                </div>
              </div>

              {/* Card body */}
              <div className="px-8 py-6 flex-1 flex flex-col">
                {/* Listings */}
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-3">Listings</p>
                  <ul className="space-y-2">
                    {plan.listings.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ivory-300">
                        <IconCheck className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Storefront */}
                {plan.storefront.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-3">Storefront</p>
                    <ul className="space-y-2">
                      {plan.storefront.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-ivory-300">
                          <IconCheck className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Business Tools */}
                {plan.tools.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-3">Business Tools</p>
                    <ul className="space-y-2">
                      {plan.tools.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-ivory-300">
                          <IconCheck className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ecommerce */}
                {plan.ecommerce.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-3">E-commerce</p>
                    <ul className="space-y-2">
                      {plan.ecommerce.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-ivory-300">
                          <IconCheck className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excluded */}
                {plan.excluded.length > 0 && (
                  <div className="mb-5">
                    <ul className="space-y-2">
                      {plan.excluded.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-stone-400">
                          <IconX className="w-4 h-4 text-charcoal-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extras */}
                {plan.extras?.length > 0 && (
                  <div className="mb-5">
                    <ul className="space-y-2">
                      {plan.extras.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-bronze-300">
                          <IconCheck className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Support level */}
                {plan.support && (
                  <p className="text-xs text-stone-500 mt-auto pt-4 border-t border-charcoal-700">
                    Support: <span className="text-ivory-300">{plan.support}</span>
                  </p>
                )}

                {/* CTA */}
                <div className="mt-6">
                  <Link
                    to="/designer/register"
                    className={`block text-center text-xs uppercase tracking-[0.18em] py-3 transition-colors ${
                      plan.highlight
                        ? "bg-bronze-600 text-charcoal-900 hover:bg-bronze-500"
                        : plan.goldAccent
                        ? "bg-bronze-700 text-charcoal-900 hover:bg-bronze-600"
                        : "border border-white0 text-ivory-300 hover:bg-ivory-50/5 hover:text-white"
                    }`}
                  >
                    {plan.name === "Free" ? "Start Free" : "Choose Plan"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Verified Badge section ─────────────────────────────── */}
      <section className="border-t border-charcoal-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 flex items-center justify-center border-2 border-bronze-500 text-bronze-400">
                <IconVerified className="w-7 h-7" />
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze-400 mb-3">Adorzia Verified Badge</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">
              Earned, never purchased
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed max-w-lg mx-auto">
              Available on all plans. Earned through product quality verification by the Adorzia team, or by building your collection with Adorzia at a coworking studio.
            </p>
            <p className="text-sm text-stone-400 leading-relaxed max-w-lg mx-auto mt-3">
              Appears on your profile and every verified product listing , a signal of craft quality that customers trust.
            </p>

            {/* Visual badge examples */}
            <div className="mt-10 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 bg-charcoal-800 border border-charcoal-700 px-4 py-2">
                <IconVerified className="w-4 h-4 text-bronze-400" />
                <span className="text-xs text-ivory-300">Profile badge</span>
              </div>
              <div className="flex items-center gap-2 bg-charcoal-800 border border-charcoal-700 px-4 py-2">
                <IconVerified className="w-4 h-4 text-bronze-400" />
                <span className="text-xs text-ivory-300">Product listing badge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="border-t border-charcoal-800">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="font-serif text-2xl text-white mb-3">Ready to showcase your work?</p>
          <p className="text-sm text-stone-500 mb-8">Start free. Upgrade when you're ready.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/designer/register"
              className="text-xs uppercase tracking-[0.18em] bg-bronze-600 text-charcoal-900 px-8 py-3 hover:bg-bronze-500 transition-colors"
            >
              Apply as a Designer
            </Link>
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.18em] text-stone-400 hover:text-ivory-200 transition-colors px-4 py-3"
            >
              Return to marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
