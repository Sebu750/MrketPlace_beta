const stats = [
  { value: "12", label: "Countries" },
  { value: "48+", label: "Designers" },
  { value: "3", label: "Cities" },
  { value: "200+", label: "Artisan Partners" },
];

export default function GlobalReach() {
  return (
    <section className="relative py-24 md:py-32 bg-white border-y border-noir-100 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(187,148,87,0.04)_0%,_transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <p className="section-label mb-4">Global Footprint</p>
        <h2 className="section-heading mb-20">
          From Pakistan to the World
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-serif text-5xl md:text-6xl lg:text-7xl text-noir-900 font-medium tracking-tight">
                {stat.value}
              </span>
              <span className="mt-3 text-xs uppercase tracking-[0.25em] text-noir-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
