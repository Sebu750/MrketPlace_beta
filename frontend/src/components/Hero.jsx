import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

/* ── Helpers ───────────────────────────────────────────────────────── */
const IconArrowDown = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

/* ── Staggered word reveal ─────────────────────────────────────────── */
function StaggerText({ text, baseDelay = 0.4, className = "" }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="hero-char"
              style={{ animationDelay: `${baseDelay + wi * 0.06 + ci * 0.025}s` }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const imgRef = useRef(null);

  // Subtle parallax on hero image
  useEffect(() => {
    const onScroll = () => {
      const el = imgRef.current;
      if (!el) return;
      const y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        el.style.transform = `translateY(${y * 0.12}px) scale(1.04)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      <div className="w-full max-w-[1520px] mx-auto min-h-[100svh] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">

        {/* ── Left: Editorial type ────────────────────────────────── */}
        <div className="flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-32 lg:py-0 relative z-10">
          {/* Season label */}
          <p
            className="text-[9px] uppercase tracking-[0.45em] text-bronze-500 mb-10 font-medium opacity-0 animate-drift-up"
            style={{ animationDelay: "0.2s" }}
          >
            Spring / Summer 2026
          </p>

          {/* Hero headline , Italiana display font with staggered reveal */}
          <h1 className="font-display text-display-lg lg:text-display-xl text-charcoal-900 leading-[0.85]">
            <span className="block">
              <StaggerText text="Where" baseDelay={0.35} />
            </span>
            <span className="block mt-1">
              <StaggerText text="Craft" baseDelay={0.55} />
            </span>
            <span className="block mt-1">
              <StaggerText
                text="Becomes"
                baseDelay={0.85}
                className="italic font-serif font-light text-charcoal-600"
              />
            </span>
            <span className="block mt-1">
              <StaggerText text="Couture" baseDelay={1.1} />
            </span>
          </h1>

          {/* Hairline rule */}
          <div
            className="mt-10 w-16 h-px bg-bronze-300 opacity-0 animate-fade-in"
            style={{ animationDelay: "1.5s" }}
          />

          {/* Subtext , refined Cormorant italic */}
          <p
            className="mt-6 text-charcoal-500 text-base md:text-lg leading-[1.85] max-w-sm font-serif font-light opacity-0 animate-drift-up"
            style={{ animationDelay: "1.6s" }}
          >
            A curated marketplace of independent Pakistani designers ,
            heritage craftsmanship reimagined through contemporary vision.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex items-center gap-8 opacity-0 animate-drift-up"
            style={{ animationDelay: "1.8s" }}
          >
            <Link to="/shop" className="btn-primary btn-shimmer">
              Explore the Edit
            </Link>
            <Link to="/designers" className="btn-text underline-slide">
              Our Designers
            </Link>
          </div>

          {/* Quick stats */}
          <div
            className="mt-16 flex items-center gap-10 opacity-0 animate-fade-in"
            style={{ animationDelay: "2.1s" }}
          >
            {[
              { n: "50+", l: "Designers" },
              { n: "12", l: "Craft Traditions" },
              { n: "6", l: "Cities" },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="font-display text-2xl md:text-3xl text-charcoal-900">{n}</p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mt-1 font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Full-bleed imagery ─────────────────────────── */}
        <div className="relative opacity-0 animate-fade-in-slow hidden lg:block" style={{ animationDelay: "0.1s" }}>
          <div className="absolute inset-0 overflow-hidden">
            <div ref={imgRef} className="absolute inset-[-40px]">
              <img
                src="/assets/images/home-hero-runway.webp"
                alt="Adorzia — Spring Summer 2026 Campaign"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Subtle gradient fade to white at left edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/8 to-transparent hidden lg:block" />

          {/* Subtle top gradient for legibility */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/10 to-transparent" />

          {/* Designer credit , bottom right */}
          <div
            className="absolute bottom-10 right-10 text-right hidden lg:block opacity-0 animate-fade-in"
            style={{ animationDelay: "2.4s" }}
          >
            <p className="text-[8px] uppercase tracking-[0.35em] text-white/50 mb-1.5 font-medium">Featured Designer</p>
            <p className="font-display text-xl text-white/95">Ayesha Siddiqui</p>
            <p className="font-serif text-sm text-white/60 italic mt-0.5">Spring '26 Collection</p>
            <Link
              to="/ayesha-siddiqui"
              className="text-[8px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors duration-500 mt-3 inline-block border-b border-white/30 hover:border-white/70 pb-0.5"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile hero image ──────────────────────────────────── */}
      <div className="lg:hidden relative h-[40vh] -mt-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <img
          src="/assets/images/home-hero-runway.webp"
          alt="Adorzia — Spring Summer 2026 Campaign"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/80" />
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 opacity-0 animate-fade-in hidden lg:flex animate-float"
        style={{ animationDelay: "2.8s" }}
      >
        <span className="text-[8px] uppercase tracking-[0.5em] text-charcoal-400 font-medium">Scroll</span>
        <div className="w-px h-8 bg-stone-300" />
      </div>
    </section>
  );
}
