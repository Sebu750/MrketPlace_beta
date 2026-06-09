const items = [
  "Independent Designers",
  "Heritage Craftsmanship",
  "Limited Editions",
  "Ships Worldwide",
  "Made in Pakistan",
  "Curated Not Catalogued",
  "Designer-First Platform",
];

export default function MarqueeTicker() {
  const text = items.join("  ·  ");
  const doubled = `${text}  ·  ${text}`;

  return (
    <section className="bg-ivory-50 border-t border-b border-stone-100 overflow-hidden">
      <div className="py-5 flex whitespace-nowrap">
        <div className="animate-marquee flex shrink-0">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="text-[9px] uppercase tracking-[0.4em] text-charcoal-400 font-light px-6"
            >
              {doubled}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
