const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Authenticated Craft",
    text: "Every piece is verified by our textile specialists before listing — provenance documented, artisan credited, quality assured.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Zero Middleman",
    text: "Direct from atelier to wardrobe. Designers set their own prices — artisans earn fairly, buyers pay honestly.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Global Shipping",
    text: "From Karachi to New York, London to Dubai — insured international delivery with full tracking within 7–14 business days.",
  },
];

export default function WhyShopHere() {
  return (
    <section className="py-24 md:py-32 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-4">The Adorzia Standard</p>
          <h2 className="section-heading max-w-xl mx-auto">
            Why Designers & Collectors Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white p-10 md:p-12 group hover:bg-stone-50 transition-colors duration-500"
            >
              <div className="text-bronze-500/80 group-hover:text-bronze-600 transition-colors duration-500">
                {v.icon}
              </div>
              <h3 className="mt-6 font-serif text-xl text-charcoal-900">{v.title}</h3>
              <p className="mt-4 text-charcoal-400 leading-relaxed text-sm">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
