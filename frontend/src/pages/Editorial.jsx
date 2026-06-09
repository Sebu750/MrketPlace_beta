import { Link } from "react-router-dom";
import { useState } from "react";

/* ════════════════════════════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════════════════════════════ */
const sections = ["All", "Interviews", "Designer Stories", "Collection Reviews", "Industry Reports", "Student Features", "Craft Documentation"];

const articles = [
  {
    id: 1, category: "Interviews", title: "Ayesha Siddiqui on Heritage as Structure", excerpt: "We sat down with the Lahore-based designer to discuss how her grandmother's Ralli quilts became the foundation of a contemporary fashion label — and why she refuses to call herself a 'sustainable designer'.", date: "June 2026", readTime: "12 min", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop", featured: true,
  },
  {
    id: 2, category: "Designer Stories", title: "The Women Behind the Thread: Artisan Networks in Sindh", excerpt: "Fourteen women in Hyderabad and Bhit Shah produce the Ralli quilt fragments that appear in Ayesha Siddiqui's collections. This is their story — told in their own words.", date: "May 2026", readTime: "18 min", img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=400&fit=crop", featured: true,
  },
  {
    id: 3, category: "Collection Reviews", title: "Geometry of Home: A Quiet Masterclass", excerpt: "Ayesha Siddiqui's SS26 collection proves that the most powerful fashion doesn't shout — it resonates. Our detailed review of 16 pieces that deconstruct and rebuild tradition.", date: "April 2026", readTime: "8 min", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 4, category: "Industry Reports", title: "The State of Pakistani Fashion Tech: 2026 Report", excerpt: "From marketplace platforms to AI-driven sizing tools — how Pakistan's fashion industry is quietly undergoing a digital transformation. Adorzia's place in this ecosystem.", date: "March 2026", readTime: "15 min", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 5, category: "Student Features", title: "NCA Graduates 2026: The Ones to Watch", excerpt: "Five graduates from the National College of Arts, Lahore, who are redefining what Pakistani design can look like. From textile architecture to bio-fabricated leather.", date: "February 2026", readTime: "10 min", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 6, category: "Craft Documentation", title: "Ralli Quilting: The Architecture of Cloth", excerpt: "A comprehensive documentation of the Ralli quilting tradition — from its origins in rural Sindh to its contemporary interpretation by emerging Pakistani designers.", date: "January 2026", readTime: "22 min", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=400&fit=crop", featured: true,
  },
  {
    id: 7, category: "Interviews", title: "Bilal Raza: 'Ajrak is not a print — it's a prayer'", excerpt: "The Karachi-based designer on why he apprenticed for two years in Bhit Shah before launching his label, and why he'll never use synthetic dyes.", date: "January 2026", readTime: "14 min", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 8, category: "Designer Stories", title: "Noor & Sons: A Multi-generational Design House", excerpt: "How a family-run Zardozi workshop in Lahore's old city evolved into one of Pakistan's most respected contemporary design labels — without losing a single artisan.", date: "December 2025", readTime: "16 min", img: "https://images.unsplash.com/photo-1506794789787-5b53e5d1e464?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 9, category: "Collection Reviews", title: "Mughal Geometry FW26: Zara Hameed's Strongest Work Yet", excerpt: "Phulkari meets brutalism in a collection that proves heritage craft can carry architectural weight. Our piece-by-piece analysis.", date: "November 2025", readTime: "9 min", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 10, category: "Craft Documentation", title: "Ajrak: 3000 Years of Resist Dyeing", excerpt: "The most comprehensive English-language documentation of Ajrak block printing — from Mohenjo-daro to modern Bhit Shah. Photographed on location.", date: "October 2025", readTime: "25 min", img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 11, category: "Student Features", title: "Hamza Tariq: From Peshawari Chappal to Global Streetwear", excerpt: "The 24-year-old designer is turning traditional Pashtun leather craft into contemporary footwear — and the international press is paying attention.", date: "September 2025", readTime: "7 min", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop", featured: false,
  },
  {
    id: 12, category: "Industry Reports", title: "Why Pakistan's Craft Economy is Ready for a Marketplace", excerpt: "An analysis of the economic case for a dedicated platform connecting Pakistani designers with global buyers. The numbers, the infrastructure, the opportunity.", date: "August 2025", readTime: "11 min", img: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop", featured: false,
  },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function Editorial() {
  const [activeSection, setActiveSection] = useState("All");

  const filtered = activeSection === "All" ? articles : articles.filter((a) => a.category === activeSection);
  const featured = articles.filter((a) => a.featured);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HEADER — Magazine masthead
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-10 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-2">Adorzia</p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-charcoal-900 tracking-tight">Editorial</h1>
          <p className="mt-4 text-charcoal-400 max-w-2xl leading-relaxed">
            Long-form journalism on Pakistani fashion, craft, and the designers shaping both. No listicles — just stories worth reading.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. SECTION FILTER
      ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-bronze-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                  activeSection === s
                    ? "bg-charcoal-900 text-white border-charcoal-900"
                    : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. FEATURED ARTICLES (only on "All" view)
      ═══════════════════════════════════════════════════════════ */}
      {activeSection === "All" && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-8">Editor's Picks</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featured.map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img src={article.img} alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">Featured</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-bronze-400/70">{article.category}</span>
                      <h3 className="font-serif text-xl text-white mt-2 group-hover:text-bronze-400 transition-colors duration-300">{article.title}</h3>
                      <p className="text-xs text-ivory-300 mt-2">{article.date} · {article.readTime} read</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          4. ALL / FILTERED ARTICLES
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">
              {activeSection === "All" ? "All Articles" : activeSection}
            </h2>
            <span className="text-xs text-charcoal-300">{filtered.length} article{filtered.length !== 1 && "s"}</span>
          </div>

          <div className="space-y-6">
            {filtered.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="flex flex-col md:flex-row gap-6 border border-stone-200 bg-white p-5 hover:border-bronze-300/50 transition-colors duration-300">
                  <div className="shrink-0 w-full md:w-56 aspect-[3/2] overflow-hidden">
                    <img src={article.img} alt={article.title}
                      className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-bronze-500 border border-bronze-400/30 px-2 py-0.5">{article.category}</span>
                        <span className="text-xs text-charcoal-300">{article.date} · {article.readTime} read</span>
                      </div>
                      <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{article.title}</h3>
                      <p className="text-sm text-charcoal-400 mt-2 leading-relaxed">{article.excerpt}</p>
                    </div>
                    <span className="mt-4 text-[10px] uppercase tracking-wider text-bronze-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Read Article →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. SUBMISSION CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-6">For Writers</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium leading-tight">
            Contribute to
            <br />
            <span className="italic text-bronze-500">Adorzia Editorial</span>
          </h2>
          <p className="mt-6 text-charcoal-400 leading-relaxed max-w-xl mx-auto">
            We publish long-form journalism on Pakistani fashion, craft, and design. If you have a story worth telling —
            a designer profile, a craft documentation, an industry analysis — we want to read it.
          </p>
          <button className="mt-10 px-8 py-3 bg-charcoal-900 text-white text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
            Submit a Pitch
          </button>
        </div>
      </section>
    </div>
  );
}
