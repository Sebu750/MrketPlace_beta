const stories = [
  {
    title: "Ajrak — The Sacred Geometry of Sindh",
    era: "3,000+ years of tradition",
    text: "Born in the Indus Valley, Ajrak is one of the oldest known block-printing traditions in human history. Each piece passes through up to 14 stages of printing and dyeing using natural indigo and madder root, a process unchanged for centuries. The geometric patterns carry symbolic weight — representing the universe in miniature. Today, a small community of master printers in Bhit Shah continues this living heritage, now reaching collectors worldwide through Adorzia.",
    img: "/assets/images/home-heritage-craft.webp",
    reverse: false,
  },
  {
    title: "Rilli — Quilting as Resistance & Revival",
    era: "Centuries of Sindh & Balochistan craft",
    text: "Rilli quilts are among the most complex textile arts in South Asia — hand-pieced from dozens of fabric fragments using techniques passed between generations of rural women. Once dismissed as folk craft, Rilli is now recognized by textile scholars as one of the most sophisticated patchwork traditions in the world. Adorzia partners directly with women's cooperatives in Thar and interior Sindh, ensuring that the creators — not intermediaries — benefit from global demand.",
    img: "/assets/images/craft.webp",
    reverse: true,
  },
];

export default function HeritageStories() {
  return (
    <section className="py-24 md:py-32 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <p className="section-label mb-4">Behind the Thread</p>
          <h2 className="section-heading">Heritage Stories</h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {stories.map((story, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                story.reverse ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div className={`lg:col-span-6 relative overflow-hidden aspect-[4/3] ${story.reverse && "lg:order-2"}`}>
                <img
                  src={story.img}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Text */}
              <div className={`lg:col-span-6 ${story.reverse && "lg:order-1"}`}>
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold-500/70">
                  {story.era}
                </span>
                <h3 className="mt-3 font-serif text-3xl md:text-4xl text-noir-900 leading-snug">
                  {story.title}
                </h3>
                <div className="divider my-8" />
                <p className="text-noir-600 leading-relaxed">{story.text}</p>
                <a
                  href="/stories"
                  className="inline-flex items-center gap-2 mt-8 text-sm text-noir-900 tracking-wide hover:text-gold-500 transition-colors"
                >
                  Read Full Story
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
