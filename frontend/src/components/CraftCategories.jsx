const crafts = [
  "Ajrak",
  "Phulkari",
  "Rilli",
  "Pashmina",
  "Khaddar",
  "Chikankari",
  "Sindhi Topi",
  "Kamdani",
  "Zardozi",
  "Gota Kinara",
  "Block Print",
  "Suzani",
  "Katan Silk",
  "Hala Craft",
];

export default function CraftCategories() {
  const doubled = [...crafts, ...crafts];

  return (
    <section className="relative py-16 border-y border-stone-100 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="section-label">Craft & Textile Heritage</p>
      </div>

      {/* Scrolling strip */}
      <div className="overflow-hidden">
        <div className="flex gap-4 animate-scroll-x w-max">
          {doubled.map((craft, i) => (
            <span
              key={i}
              className="shrink-0 px-6 py-2.5 border border-stone-200 text-sm text-charcoal-500 tracking-wide whitespace-nowrap transition-colors duration-300 hover:border-charcoal-900 hover:text-charcoal-900 cursor-default"
            >
              {craft}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
