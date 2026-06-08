const items = [
  "New Arrivals",
  "Heritage Craft",
  "Emerging Designers",
  "Ships Worldwide",
  "Handmade in Pakistan",
  "Authentic & Verified",
  "Spotlight Alumni",
];

export default function MarqueeTicker() {
  const text = items.join("  ·  ");
  const doubled = `${text}  ·  ${text}`;

  return (
    <section className="bg-parchment-100 border-t border-b border-gold-200 overflow-hidden">
      <div className="py-4 flex whitespace-nowrap">
        <div className="animate-marquee flex shrink-0">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="text-[11px] uppercase tracking-[0.3em] text-crimson-600 font-medium px-4"
            >
              {doubled}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
