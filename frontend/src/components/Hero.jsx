import { Link } from "react-router-dom";

const IconArrowDown = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      <div className="w-full max-w-[1520px] mx-auto min-h-[100svh] grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]">

        {/* ── Left: Editorial type ────────────────────────────── */}
        <div className="flex flex-col justify-center px-6 lg:px-10 py-28 lg:py-0 relative z-10">
          {/* Season label */}
          <p className="text-[9px] uppercase tracking-[0.4em] text-charcoal-400 mb-8 opacity-0 animate-drift-up" style={{ animationDelay: "0.3s" }}>
            Spring / Summer 2026
          </p>

          {/* Hero headline — large serif display */}
          <h1 className="font-serif text-display-lg lg:text-display-xl font-light text-charcoal-900 opacity-0 animate-drift-up" style={{ animationDelay: "0.5s" }}>
            Where Craft
            <br />
            <span className="italic font-light">Becomes</span>
            <br />
            Couture
          </h1>

          {/* Subtext — minimal, refined */}
          <p className="mt-8 text-charcoal-500 text-sm md:text-base leading-[1.8] max-w-md font-light opacity-0 animate-drift-up" style={{ animationDelay: "0.7s" }}>
            A curated marketplace of independent Pakistani designers —
            heritage craftsmanship reimagined through contemporary design.
          </p>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-8 opacity-0 animate-drift-up" style={{ animationDelay: "0.9s" }}>
            <Link to="/shop" className="btn-primary">
              Explore the Collection
            </Link>
            <Link to="/designers" className="btn-text">
              Our Designers
            </Link>
          </div>
        </div>

        {/* ── Right: Full-bleed imagery ───────────────────────── */}
        <div className="relative opacity-0 animate-fade-in-slow" style={{ animationDelay: "0.2s" }}>
          <div className="absolute inset-0">
            <img
              src="/assets/images/home-hero-runway.webp"
              alt="Adorzia — Spring Summer 2026 Campaign"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Subtle gradient fade to white at left edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/5 to-transparent hidden lg:block" />

          {/* Designer credit — bottom right */}
          <div className="absolute bottom-8 right-8 text-right hidden lg:block opacity-0 animate-fade-in" style={{ animationDelay: "1.6s" }}>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-1">Featured Designer</p>
            <p className="font-serif text-lg text-white/90 font-light">Ayesha Siddiqui</p>
            <Link
              to="/ayesha-siddiqui"
              className="text-[9px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-500 mt-1 inline-block"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "2s" }}>
        <span className="text-[8px] uppercase tracking-[0.4em] text-charcoal-400">Scroll</span>
        <IconArrowDown className="w-4 h-4 text-charcoal-300 animate-pulse" />
      </div>
    </section>
  );
}
