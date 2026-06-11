import useReveal from "../hooks/useReveal";

export default function CraftStory() {
  const ref = useReveal();

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Parallax background image with Ken Burns */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/home-hero-runway.webp"
          alt="Heritage craft — Pakistan"
          className="w-full h-full object-cover ken-burns"
          loading="lazy"
          decoding="async"
        />
        {/* Light cream overlay — keeps it airy, not dark */}
        <div className="absolute inset-0 bg-ivory-50/75" />
      </div>

      {/* Centered quote */}
      <div ref={ref} className="reveal relative z-10 h-full flex items-center justify-center px-6">
        <blockquote className="max-w-3xl text-center">
          <p className="font-display italic text-3xl md:text-4xl lg:text-5xl text-charcoal-800 leading-snug">
            "Every thread carries the memory of a hand that spun it, a loom that held it,
            and a tradition that refused to be forgotten."
          </p>
          <cite className="block mt-8 text-[11px] uppercase tracking-[0.3em] text-charcoal-300 not-italic">
            Adorzia · Heritage Manifesto
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
