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
    <section className="relative bg-ivory-50 border-t border-b border-stone-100 overflow-hidden group/ticker">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-ivory-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-ivory-50 to-transparent z-10 pointer-events-none" />

      <div className="py-5 flex whitespace-nowrap">
        <div className="animate-marquee flex shrink-0 group-hover/ticker:[animation-play-state:paused]">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="font-display text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-charcoal-400 px-6"
            >
              {doubled}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
