import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

/* ════════════════════════════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════════════════════════════ */
const collections = [
  {
    name: "Geometry of Home",
    designer: "Ayesha Siddiqui",
    designerSlug: "ayesha-siddiqui",
    season: "SS26",
    year: 2026,
    category: "Contemporary",
    gender: "Womenswear",
    occasion: "Pret",
    type: "latest",
    pieces: 12,
    craft: "Ralli Quilting",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop",
  },
  {
    name: "Mughal Geometry — FW26",
    designer: "Zara Hameed",
    designerSlug: "zara-hameed",
    season: "FW26",
    year: 2026,
    category: "Luxury",
    gender: "Womenswear",
    occasion: "Bridal",
    type: "featured",
    pieces: 18,
    craft: "Phulkari",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
  },
  {
    name: "Sindhi Indigo Edit",
    designer: "Bilal Raza",
    designerSlug: "bilal-raza",
    season: "SS26",
    year: 2026,
    category: "Contemporary",
    gender: "Menswear",
    occasion: "Pret",
    type: "latest",
    pieces: 14,
    craft: "Ajrak",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
  },
  {
    name: "Heritage Rilli Coat",
    designer: "Noor & Sons",
    designerSlug: "noor-and-sons",
    season: "FW25",
    year: 2025,
    category: "Luxury",
    gender: "Womenswear",
    occasion: "Bridal",
    type: "featured",
    pieces: 8,
    craft: "Mirror Work",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  },
  {
    name: "Hyderabad Monochrome",
    designer: "Ayesha Siddiqui",
    designerSlug: "ayesha-siddiqui",
    season: "SS25",
    year: 2025,
    category: "Contemporary",
    gender: "Womenswear",
    occasion: "Pret",
    type: "seasonal",
    pieces: 10,
    craft: "Block Printing",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
  },
  {
    name: "Debut Capsule",
    designer: "Ayesha Siddiqui",
    designerSlug: "ayesha-siddiqui",
    season: "FW23",
    year: 2023,
    category: "Pret",
    gender: "Womenswear",
    occasion: "Pret",
    type: "seasonal",
    pieces: 8,
    craft: "Ralli Quilting",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop",
  },
  {
    name: "Peshawari Revival",
    designer: "Hamza Tariq",
    designerSlug: "hamza-tariq",
    season: "SS26",
    year: 2026,
    category: "Streetwear",
    gender: "Menswear",
    occasion: "Pret",
    type: "student",
    pieces: 6,
    craft: "Leather Work",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
  },
  {
    name: "Thar Bloom",
    designer: "Aleeza Noor",
    designerSlug: "aleeza-noor",
    season: "SS26",
    year: 2026,
    category: "Contemporary",
    gender: "Womenswear",
    occasion: "Pret",
    type: "student",
    pieces: 9,
    craft: "Embroidery",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
  },
  {
    name: "Karachi Concrete",
    designer: "Danyaal Malik",
    designerSlug: "danyaal-malik",
    season: "FW25",
    year: 2025,
    category: "Streetwear",
    gender: "Menswear",
    occasion: "Pret",
    type: "spotlight",
    pieces: 11,
    craft: "Screen Print",
    img: "https://images.unsplash.com/photo-1506794789787-5b53e5d1e464?w=600&h=800&fit=crop",
  },
  {
    name: "Lahore Noir",
    designer: "Fatima Asad",
    designerSlug: "fatima-asad",
    season: "FW25",
    year: 2025,
    category: "Luxury",
    gender: "Womenswear",
    occasion: "Bridal",
    type: "spotlight",
    pieces: 15,
    craft: "Zardozi",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop",
  },
  {
    name: "Indus Crossing",
    designer: "Bilal Raza",
    designerSlug: "bilal-raza",
    season: "FW25",
    year: 2025,
    category: "Pret",
    gender: "Menswear",
    occasion: "Pret",
    type: "seasonal",
    pieces: 12,
    craft: "Ajrak",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop",
  },
  {
    name: "Chitral Weave Edit",
    designer: "Mehreen Aslam",
    designerSlug: "mehreen-aslam",
    season: "SS25",
    year: 2025,
    category: "Luxury",
    gender: "Womenswear",
    occasion: "Bridal",
    type: "featured",
    pieces: 7,
    craft: "Pashmina",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
  },
];

/* ── Filter definitions ─────────────────────────────────────── */
const filterConfig = {
  year: ["All", 2026, 2025, 2024, 2023],
  category: ["All", "Luxury", "Contemporary", "Pret", "Streetwear", "Bridal"],
  designer: ["All", "Ayesha Siddiqui", "Zara Hameed", "Bilal Raza", "Noor & Sons", "Hamza Tariq", "Aleeza Noor", "Danyaal Malik"],
  gender: ["All", "Womenswear", "Menswear"],
  occasion: ["All", "Bridal", "Pret", "Formal", "Casual"],
};

const sectionOrder = [
  { type: "latest",    label: "Latest Collections",    desc: "Just dropped — the newest work from our designers." },
  { type: "featured",  label: "Featured Collections",  desc: "Curated selections — collections we believe deserve your attention." },
  { type: "seasonal",  label: "Seasonal Collections",  desc: "Collections tied to specific seasons and moments." },
  { type: "student",   label: "Student Collections",   desc: "Emerging voices — work from design students and recent graduates." },
  { type: "spotlight", label: "Spotlight Collections", desc: "Collections that challenge convention and push boundaries." },
];

/* ── Collection card ────────────────────────────────────────── */
function CollectionCard({ c, badge }) {
  return (
    <Link
      to={`/collections/${c.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={c.img}
          alt={c.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/15 to-transparent" />
        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4">
            <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">
              {badge}
            </span>
          </div>
        )}
        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">
            {c.season} — {c.pieces} pieces
          </p>
          <h3 className="font-serif text-lg text-white group-hover:text-bronze-400 transition-colors duration-300">
            {c.name}
          </h3>
          <p className="text-xs text-ivory-300 mt-1">{c.designer}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-[9px] uppercase tracking-wider text-bronze-500/50 border border-ivory-50/10 px-2 py-0.5">{c.craft}</span>
            <span className="text-[9px] uppercase tracking-wider text-bronze-500/50 border border-ivory-50/10 px-2 py-0.5">{c.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CollectionsDirectory() {
  const [filters, setFilters] = useState({ year: "All", category: "All", designer: "All", gender: "All", occasion: "All" });
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return collections.filter((c) => {
      if (filters.year !== "All" && c.year !== filters.year) return false;
      if (filters.category !== "All" && c.category !== filters.category) return false;
      if (filters.designer !== "All" && c.designer !== filters.designer) return false;
      if (filters.gender !== "All" && c.gender !== filters.gender) return false;
      if (filters.occasion !== "All" && c.occasion !== filters.occasion) return false;
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.designer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [filters, searchQuery]);

  const updateFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));
  const hasActiveFilters = Object.values(filters).some((v) => v !== "All") || searchQuery;

  const resetFilters = () => {
    setFilters({ year: "All", category: "All", designer: "All", gender: "All", occasion: "All" });
    setSearchQuery("");
  };

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-12 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Explore</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal-900 tracking-tight">Collections</h1>
          <p className="mt-3 text-charcoal-400 max-w-xl">
            Every collection tells a story — of craft, of place, of a designer's vision. Browse the complete archive.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. SEARCH + FILTERS
      ═══════════════════════════════════════════════════════════ */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-bronze-200/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          {/* Search */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search collections…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors"
              />
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-bronze-500 hover:text-bronze-400 tracking-wider uppercase">
                Clear all
              </button>
            )}
          </div>

          {/* Filter rows */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {Object.entries(filterConfig).map(([key, options]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal-300 shrink-0">{key}:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateFilter(key, opt)}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border transition-all duration-200 ${
                        filters[key] === opt
                          ? "bg-charcoal-900 text-white border-charcoal-900"
                          : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3-7. SECTIONS — Latest, Featured, Seasonal, Student, Spotlight
      ═══════════════════════════════════════════════════════════ */}
      {sectionOrder.map(({ type, label, desc }) => {
        const sectionItems = filtered.filter((c) => c.type === type);
        if (sectionItems.length === 0 && hasActiveFilters) return null;

        const badges = { latest: "New", featured: "Featured", student: "Student", spotlight: "Spotlight", seasonal: null };

        return (
          <section key={type} className="py-20 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-2">{label.split(" ")[0]}</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">{label}</h2>
                  <p className="text-sm text-charcoal-400 mt-1.5">{desc}</p>
                </div>
                <span className="text-xs text-charcoal-300 tracking-wider">{sectionItems.length} collection{sectionItems.length !== 1 && "s"}</span>
              </div>

              {sectionItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sectionItems.map((c, i) => (
                    <CollectionCard key={`${type}-${i}`} c={c} badge={badges[type]} />
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-stone-200 py-12 text-center">
                  <p className="text-sm text-charcoal-300">No collections in this section yet.</p>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════
          8. EMPTY STATE (no results from filters)
      ═══════════════════════════════════════════════════════════ */}
      {hasActiveFilters && filtered.length === 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-serif text-2xl text-charcoal-900 mb-3">No collections found</p>
            <p className="text-sm text-charcoal-400 mb-8">Try adjusting your filters or search terms.</p>
            <button onClick={resetFilters} className="px-6 py-2.5 bg-charcoal-900 text-white text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
              Clear Filters
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
