import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

/* ── Filter categories ──────────────────────────────────────────── */
const categories = [
  "All", "Womenswear", "Menswear", "Luxury", "Contemporary", "Bridal", "Pret", "Streetwear", "Accessories",
];

/* ── Mock data ──────────────────────────────────────────────────── */
const designers = [
  {
    name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", city: "Lahore",
    categories: ["Womenswear", "Luxury", "Contemporary"],
    craft: ["Ajrak", "Block Print"], stage: "Final Year Student",
    collections: 1, bio: "Deconstructing Mughal geometry through Ajrak block printing — bridging 300 years of craft with modern architectural silhouettes.",
    banner: "/assets/images/home-hero-runway.webp",
    portrait: "/assets/images/home-designer-portrait-1.webp",
    featured: "/assets/images/ajrak-architect-coat-adorzia1.webp",
    isFeatured: true, isEmerging: false,
  },
  {
    name: "Zara Hameed", slug: "zara-hameed", city: "Islamabad",
    categories: ["Womenswear", "Pret", "Contemporary"],
    craft: ["Phulkari", "Pashmina"], stage: "Recent Graduate",
    collections: 2, bio: "Punjabi Phulkari reimagined for the contemporary wardrobe — each stitch a quiet act of cultural preservation.",
    banner: "/assets/images/home-sustainable-fashion.webp",
    portrait: "/assets/images/Zara-ahmad.webp",
    featured: "/assets/images/phulkari-reborn-blazer-adorzia.webp",
    isFeatured: true, isEmerging: false,
  },
  {
    name: "Hira Khan", slug: "hira-khan", city: "Karachi",
    categories: ["Womenswear", "Luxury", "Bridal"],
    craft: ["Khaddar", "Block Print"], stage: "Independent Designer",
    collections: 3, bio: "Slow fashion rooted in Khaddar weaving traditions — proving heritage fabric can be radical.",
    banner: "/assets/images/home-fabric-innovation.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/khaddar-modern-suit-adorzia.webp",
    isFeatured: true, isEmerging: false,
  },
  {
    name: "Noor & Sons", slug: "noor-and-sons", city: "Lahore",
    categories: ["Womenswear", "Luxury", "Contemporary"],
    craft: ["Mirror Work", "Embroidery"], stage: "Independent Designer",
    collections: 2, bio: "Three generations of Sindhi mirror-work mastery translated into contemporary outerwear.",
    banner: "/assets/images/home-heritage-craft.webp",
    portrait: "/assets/images/home-designer-portrait-1.webp",
    featured: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp",
    isFeatured: true, isEmerging: false,
  },
  {
    name: "Bilal Raza", slug: "bilal-raza", city: "Karachi",
    categories: ["Menswear", "Streetwear", "Contemporary"],
    craft: ["Rilli", "Block Print"], stage: "Recent Graduate",
    collections: 1, bio: "Sindhi Rilli quilting meets streetwear silhouettes — craft as resistance to fast fashion.",
    banner: "/assets/images/home-hero-craft.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/rilli-sculpt-tote-adorzia.webp",
    isFeatured: false, isEmerging: true,
  },
  {
    name: "Fatima Qureshi", slug: "fatima-qureshi", city: "Islamabad",
    categories: ["Womenswear", "Luxury", "Bridal"],
    craft: ["Pashmina", "Chikankari"], stage: "Final Year Student",
    collections: 1, bio: "Northern Pashmina heritage meets Chikankari precision — textile engineering meets art.",
    banner: "/assets/images/home-luxury-bridal.webp",
    portrait: "/assets/images/Zara-ahmad.webp",
    featured: "/assets/images/pashmina-wrap-dress-adorzia.webp",
    isFeatured: false, isEmerging: true,
  },
  {
    name: "Sana Javed", slug: "sana-javed", city: "Lahore",
    categories: ["Womenswear", "Pret", "Streetwear"],
    craft: ["Ajrak", "Mirror Work"], stage: "Recent Graduate",
    collections: 2, bio: "Ajrak's indigo palette reinterpreted through minimalist silhouettes for the global wardrobe.",
    banner: "/assets/images/craft.webp",
    portrait: "/assets/images/home-designer-portrait-1.webp",
    featured: "/assets/images/mirror-rebel-tee-adorzia.webp",
    isFeatured: false, isEmerging: true,
  },
  {
    name: "Omair Ali", slug: "omair-ali", city: "Karachi",
    categories: ["Menswear", "Luxury", "Contemporary"],
    craft: ["Khaddar", "Block Print"], stage: "Independent Designer",
    collections: 4, bio: "Architectural menswear built on Multan's Khaddar weaving — structure, weight, permanence.",
    banner: "/assets/images/home-hero-runway.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/khaddar-modern-suit-adorzia.webp",
    isFeatured: true, isEmerging: false,
  },
  {
    name: "Maryam Sheikh", slug: "maryam-sheikh", city: "Lahore",
    categories: ["Womenswear", "Pret", "Accessories"],
    craft: ["Chikankari", "Pashmina"], stage: "Final Year Student",
    collections: 1, bio: "Thesis collection exploring the architecture of Chikankari — white-on-white as a design philosophy.",
    banner: "/assets/images/home-fabric-innovation.webp",
    portrait: "/assets/images/Zara-ahmad.webp",
    featured: "/assets/images/phulkari-reborn-blazer-adorzia.webp",
    isFeatured: false, isEmerging: true,
  },
  {
    name: "Hamza Tariq", slug: "hamza-tariq", city: "Karachi",
    categories: ["Menswear", "Streetwear", "Accessories"],
    craft: ["Block Print", "Rilli"], stage: "Recent Graduate",
    collections: 1, bio: "Utility-driven menswear with Sindhi textile roots — pockets, panels, and purpose.",
    banner: "/assets/images/home-hero-craft.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/rilli-sculpt-tote-adorzia.webp",
    isFeatured: false, isEmerging: true,
  },
  {
    name: "Aleeza Noor", slug: "aleeza-noor", city: "Islamabad",
    categories: ["Womenswear", "Bridal", "Luxury"],
    craft: ["Chikankari", "Mirror Work"], stage: "Independent Designer",
    collections: 3, bio: "Bridal couture that honours the zardozi tradition — every thread dipped in gold, every motif a heirloom.",
    banner: "/assets/images/home-luxury-bridal.webp",
    portrait: "/assets/images/home-designer-portrait-1.webp",
    featured: "/assets/images/ajrak-architect-coat-adorzia1.webp",
    isFeatured: true, isEmerging: false,
  },
  {
    name: "Danyaal Malik", slug: "danyaal-malik", city: "Lahore",
    categories: ["Menswear", "Contemporary", "Pret"],
    craft: ["Khaddar"], stage: "Final Year Student",
    collections: 1, bio: "Thesis on post-colonial menswear — Khaddar as a fabric of self-determination.",
    banner: "/assets/images/home-fabric-innovation.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/khaddar-modern-suit-adorzia.webp",
    isFeatured: false, isEmerging: true,
  },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function DesignerDirectory() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    let list = [...designers];
    if (search) list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== "All") list = list.filter((d) => d.categories.includes(activeCategory));
    return list;
  }, [search, activeCategory]);

  const featuredDesigners = filtered.filter((d) => d.isFeatured);
  const emergingDesigners = filtered.filter((d) => d.isEmerging);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Discover</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-charcoal-900 font-medium leading-tight">
            Designers
          </h1>
          <p className="mt-5 text-charcoal-400 max-w-xl leading-relaxed">
            Emerging Pakistani fashion talent — every designer on Adorzia has been curated for craft quality, design vision, and creative ambition.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <div className="inline-flex items-baseline gap-2 border border-bronze-300/50 bg-ivory-50 px-5 py-3">
              <span className="font-serif text-2xl text-bronze-500">{designers.length}</span>
              <span className="text-xs text-charcoal-400 uppercase tracking-wider">Designers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. SEARCH + CATEGORY FILTERS — sticky
      ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-bronze-200/50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top row: search */}
          <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
              <input
                type="text"
                placeholder="Search designers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-stone-200/70 text-charcoal-900 text-sm pl-10 pr-4 py-2.5 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-700">
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-charcoal-300 hidden sm:block">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 pb-4 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-charcoal-900 text-white border-charcoal-900"
                    : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50 hover:text-charcoal-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. FEATURED DESIGNERS
      ═══════════════════════════════════════════════════════════ */}
      {featuredDesigners.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-bronze-300 rounded-full" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-bronze-500">Featured Designers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDesigners.map((d, i) => (
                <FeaturedCard key={i} d={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          4. EMERGING DESIGNERS
      ═══════════════════════════════════════════════════════════ */}
      {emergingDesigners.length > 0 && (
        <section className="py-16 md:py-20 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 bg-bronze-300 rounded-full animate-pulse" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-bronze-500">Emerging Designers</p>
            </div>
            <p className="text-sm text-charcoal-400 mb-10 max-w-lg">
              New talent just launching on Adorzia — be the first to discover their work.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergingDesigners.map((d, i) => (
                <EmergingCard key={i} d={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. EMPTY STATE
      ═══════════════════════════════════════════════════════════ */}
      {filtered.length === 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-serif text-2xl text-charcoal-400 mb-2">No designers found</p>
            <p className="text-sm text-charcoal-300">Try adjusting your search or category filter</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-6 text-xs uppercase tracking-wider text-bronze-500 hover:text-bronze-400 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          6. DESIGNER APPLICATION CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-bronze-200/40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Open Call</p>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal-900 font-medium leading-tight mb-6">
            Are you the next<br /><span className="italic text-bronze-500">name on this list?</span>
          </h2>
          <p className="text-charcoal-400 leading-relaxed max-w-lg mx-auto mb-10">
            Adorzia is actively seeking emerging Pakistani fashion talent — from final-year students
            to independent creatives ready for their first international showcase.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/designer/register" className="bg-charcoal-900 text-white px-8 py-3 text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
              Apply to Join
            </Link>
            <Link to="/designer/plans" className="border border-bronze-400 text-charcoal-700 px-8 py-3 text-xs uppercase tracking-[0.18em] hover:bg-ivory-50 transition-colors">
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Inline SVG icons ───────────────────────────────────────────── */
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
const IconX = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════
   FEATURED CARD — editorial, large, bronze-accented
════════════════════════════════════════════════════════════════ */
function FeaturedCard({ d }) {
  return (
    <Link to={`/${d.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={d.featured}
          alt={d.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">Featured</span>
        </div>

        {/* Category tags */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5">
          {d.categories.slice(0, 2).map((cat) => (
            <span key={cat} className="text-[9px] uppercase tracking-[0.15em] bg-white/60 backdrop-blur-sm text-charcoal-700 px-2 py-0.5 text-right">
              {cat}
            </span>
          ))}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end gap-3">
            <img
              src={d.portrait}
              alt={d.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-charcoal-950/50 shrink-0"
            />
            <div>
              <h3 className="font-serif text-lg text-white group-hover:text-bronze-400 transition-colors duration-300">
                {d.name}
              </h3>
              <p className="text-xs text-ivory-300 mt-0.5">{d.city} · {d.collections} collection{d.collections !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-3 leading-relaxed line-clamp-2">{d.bio}</p>
        </div>
      </div>
    </Link>
  );
}

/* ════════════════════════════════════════════════════════════════
   EMERGING CARD — lighter, editorial, rising talent feel
════════════════════════════════════════════════════════════════ */
function EmergingCard({ d }) {
  return (
    <Link to={`/${d.slug}`} className="group block bg-white border border-stone-100 hover:border-bronze-300/50 transition-all duration-300">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={d.featured}
          alt={d.name}
          className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />

        {/* Rising badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[9px] uppercase tracking-[0.2em] bg-charcoal-900 text-white px-2.5 py-1 font-medium">New</span>
        </div>

        {/* Stage badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[9px] uppercase tracking-[0.15em] bg-white/70 backdrop-blur-sm text-charcoal-500 px-2 py-0.5 border border-stone-200/50">
            {d.stage}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">
          {d.name}
        </h3>
        <p className="text-xs text-charcoal-300 mt-0.5">{d.city} · {d.collections} collection{d.collections !== 1 ? "s" : ""}</p>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {d.categories.map((cat) => (
            <span key={cat} className="text-[10px] uppercase tracking-wider text-bronze-500/70 border border-stone-100 px-2 py-0.5">
              {cat}
            </span>
          ))}
        </div>

        <p className="text-sm text-charcoal-400 mt-3 leading-relaxed line-clamp-2">{d.bio}</p>

        <span className="inline-flex items-center gap-1.5 text-xs text-bronze-500 mt-4 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Profile
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
