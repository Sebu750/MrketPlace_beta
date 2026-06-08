import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

/* ── Mock data ──────────────────────────────────────────────────── */
const cities = ["All Cities", "Lahore", "Islamabad", "Karachi"];
const craftSpecialties = ["Ajrak", "Phulkari", "Pashmina", "Khaddar", "Block Print", "Mirror Work", "Rilli", "Chikankari"];
const careerStages = ["Final Year Student", "Recent Graduate", "Independent Designer"];
const collectionTypes = ["Ready to Wear", "Bridal", "Accessories", "Unstitched", "Menswear"];

const designers = [
  {
    name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", city: "Lahore",
    craft: ["Ajrak", "Block Print"], stage: "Final Year Student",
    collections: 1, bio: "Deconstructing Mughal geometry through Ajrak block printing — bridging 300 years of craft with modern architectural silhouettes.",
    banner: "/assets/images/home-hero-runway.webp",
    portrait: "/assets/images/home-designer-portrait-1.webp",
    featured: "/assets/images/ajrak-architect-coat-adorzia1.webp",
    spotlight: true,
  },
  {
    name: "Zara Hameed", slug: "zara-hameed", city: "Islamabad",
    craft: ["Phulkari", "Pashmina"], stage: "Recent Graduate",
    collections: 2, bio: "Punjabi Phulkari reimagined for the contemporary wardrobe — each stitch a quiet act of cultural preservation.",
    banner: "/assets/images/home-sustainable-fashion.webp",
    portrait: "/assets/images/Zara-ahmad.webp",
    featured: "/assets/images/phulkari-reborn-blazer-adorzia.webp",
    spotlight: true,
  },
  {
    name: "Hira Khan", slug: "hira-khan", city: "Karachi",
    craft: ["Khaddar", "Block Print"], stage: "Independent Designer",
    collections: 3, bio: "Slow fashion rooted in Khaddar weaving traditions — proving heritage fabric can be radical.",
    banner: "/assets/images/home-fabric-innovation.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/khaddar-modern-suit-adorzia.webp",
    spotlight: true,
  },
  {
    name: "Noor & Sons", slug: "noor-and-sons", city: "Lahore",
    craft: ["Mirror Work", "Embroidery"], stage: "Independent Designer",
    collections: 2, bio: "Three generations of Sindhi mirror-work mastery translated into contemporary outerwear.",
    banner: "/assets/images/home-heritage-craft.webp",
    portrait: "/assets/images/home-designer-portrait-1.webp",
    featured: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp",
    spotlight: false,
  },
  {
    name: "Bilal Raza", slug: "bilal-raza", city: "Karachi",
    craft: ["Rilli", "Block Print"], stage: "Recent Graduate",
    collections: 1, bio: "Sindhi Rilli quilting meets streetwear silhouettes — craft as resistance to fast fashion.",
    banner: "/assets/images/home-hero-craft.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/rilli-sculpt-tote-adorzia.webp",
    spotlight: false,
  },
  {
    name: "Fatima Qureshi", slug: "fatima-qureshi", city: "Islamabad",
    craft: ["Pashmina", "Chikankari"], stage: "Final Year Student",
    collections: 1, bio: "Northern Pashmina heritage meets Chikankari precision — textile engineering meets art.",
    banner: "/assets/images/home-luxury-bridal.webp",
    portrait: "/assets/images/Zara-ahmad.webp",
    featured: "/assets/images/pashmina-wrap-dress-adorzia.webp",
    spotlight: false,
  },
  {
    name: "Sana Javed", slug: "sana-javed", city: "Lahore",
    craft: ["Ajrak", "Mirror Work"], stage: "Recent Graduate",
    collections: 2, bio: "Ajrak's indigo palette reinterpreted through minimalist silhouettes for the global wardrobe.",
    banner: "/assets/images/craft.webp",
    portrait: "/assets/images/home-designer-portrait-1.webp",
    featured: "/assets/images/mirror-rebel-tee-adorzia.webp",
    spotlight: false,
  },
  {
    name: "Omair Ali", slug: "omair-ali", city: "Karachi",
    craft: ["Khaddar", "Block Print"], stage: "Independent Designer",
    collections: 4, bio: "Architectural menswear built on Multan's Khaddar weaving — structure, weight, permanence.",
    banner: "/assets/images/home-hero-runway.webp",
    portrait: "/assets/images/home-designer-portrait-2.webp",
    featured: "/assets/images/khaddar-modern-suit-adorzia.webp",
    spotlight: false,
  },
  {
    name: "Maryam Sheikh", slug: "maryam-sheikh", city: "Lahore",
    craft: ["Chikankari", "Pashmina"], stage: "Final Year Student",
    collections: 1, bio: "Thesis collection exploring the architecture of Chikankari — white-on-white as a design philosophy.",
    banner: "/assets/images/home-fabric-innovation.webp",
    portrait: "/assets/images/Zara-ahmad.webp",
    featured: "/assets/images/phulkari-reborn-blazer-adorzia.webp",
    spotlight: false,
  },
];

const cityIntros = {
  "All Cities": null,
  "Lahore": "Pakistan's creative capital — where Mughal architecture meets contemporary design studios.",
  "Islamabad": "The nation's design incubator — home to emerging talent from NCA and Indus Valley programs.",
  "Karachi": "Where craft meets commerce — Sindhi heritage reimagined for the global market.",
};

const crafts = [
  { name: "Ajrak", region: "Bhit Shah, Sindh", desc: "300-year-old block printing using natural indigo and madder root dyes.", count: 2 },
  { name: "Phulkari", region: "Punjab", desc: "Silk thread embroidery — each stitch a generational story passed from mother to daughter.", count: 2 },
  { name: "Pashmina", region: "Northern Areas & Kashmir", desc: "Ultra-fine cashmere wool, hand-woven and hand-embroidered over months.", count: 3 },
  { name: "Khaddar", region: "Multan & Punjab", desc: "Hand-spun, hand-woven cotton — the original slow fabric of the Indus region.", count: 3 },
  { name: "Block Print", region: "Sindh & Punjab", desc: "Hand-carved wooden blocks pressed onto fabric — no two impressions are identical.", count: 3 },
  { name: "Mirror Work", region: "Sindh", desc: "Small mirrors stitched into fabric — light-catching geometry from desert traditions.", count: 2 },
  { name: "Rilli", region: "Sindh & Southern Punjab", desc: "Patchwork quilting — each pattern tells a story of the artisan's community.", count: 2 },
  { name: "Chikankari", region: "Lucknow tradition, practiced in Lahore", desc: "Delicate white-on-white embroidery — architectural precision in thread.", count: 2 },
];

const risingDesigners = [
  { ...designers[5], badge: "Just Launched" },
  { ...designers[8], badge: "Just Launched" },
  { ...designers[4], badge: "Recently Debuted" },
];

const studio = {
  city: "Lahore",
  img: "/assets/images/home-newsletter-studio.webp",
  designers: 3,
  description: "A light-filled workspace in Lahore's creative quarter — where emerging designers develop collections, collaborate with artisans, and prepare pieces for global launch. Part studio, part atelier, entirely devoted to Pakistani design excellence.",
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function DesignerDirectory() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [sortBy, setSortBy] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...designers];
    if (search) list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedCity !== "All Cities") list = list.filter((d) => d.city === selectedCity);
    if (selectedCraft) list = list.filter((d) => d.craft.includes(selectedCraft));
    if (selectedStage) list = list.filter((d) => d.stage === selectedStage);
    if (sortBy === "A–Z") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Spotlight Alumni") list.sort((a, b) => (b.spotlight ? 1 : 0) - (a.spotlight ? 1 : 0));
    if (sortBy === "Most Collected") list.sort((a, b) => b.collections - a.collections);
    return list;
  }, [search, selectedCity, selectedCraft, selectedStage, sortBy]);

  const spotlight = designers.filter((d) => d.spotlight);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Designer Directory</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-noir-900 font-medium leading-tight max-w-3xl">
            Meet the
            <br />
            <span className="italic text-gold-500">Visionaries</span>
          </h1>
          <p className="mt-6 text-noir-500 max-w-xl leading-relaxed">
            Emerging Pakistani fashion talent — launching the next generation of designers
            to the global stage. Every piece tells a story of craft, culture, and ambition.
          </p>
          <div className="mt-8 inline-flex items-baseline gap-2 border border-noir-100 bg-stone-50 px-5 py-3">
            <span className="font-serif text-2xl text-gold-500">{designers.length}</span>
            <span className="text-xs text-noir-500 uppercase tracking-wider">Designers on Adorzia</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. SEARCH & FILTER BAR — sticky
      ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 py-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search designers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-50 border border-noir-100 text-noir-900 text-sm pl-10 pr-4 py-2.5 placeholder:text-noir-500 focus:outline-none focus:border-gold-400/30 transition-colors"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-noir-100 text-noir-600 text-sm px-4 py-2.5 focus:outline-none focus:border-gold-400/30 cursor-pointer"
            >
              {["Newest", "Most Collected", "Spotlight Alumni", "A–Z"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border transition-colors ${
                showFilters ? "border-gold-400/50 text-gold-500" : "border-noir-100 text-noir-500 hover:text-noir-900 hover:border-noir-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Filter panels */}
          {showFilters && (
            <div className="pb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
              <FilterGroup label="City" options={cities.slice(1)} selected={selectedCity === "All Cities" ? null : selectedCity} onSelect={setSelectedCity} />
              <FilterGroup label="Craft Specialty" options={craftSpecialties} selected={selectedCraft} onSelect={setSelectedCraft} />
              <FilterGroup label="Career Stage" options={careerStages} selected={selectedStage} onSelect={setSelectedStage} />
              <FilterGroup label="Collection Type" options={collectionTypes} selected={selectedType} onSelect={setSelectedType} />
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. SPOTLIGHT ALUMNI STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white border-b border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold-500/80">Spotlight Alumni</p>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {spotlight.map((d, i) => (
              <Link key={i} to={`/${d.slug}`} className="shrink-0 w-56 snap-start group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={d.featured} alt={d.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] uppercase tracking-[0.2em] bg-gold-400 text-noir-950 px-2 py-0.5 font-medium">Spotlight</span>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-sm text-noir-900">{d.name}</h3>
                  <p className="text-xs text-noir-500 mt-0.5">{d.city} · {d.craft[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. CITY FILTER TABS (rendered before grid)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-5 py-2 text-xs tracking-wider uppercase border transition-all duration-200 ${
                  selectedCity === c
                    ? "bg-gold-400 text-noir-950 border-gold-400"
                    : "bg-transparent text-noir-500 border-noir-200 hover:border-gold-400/30 hover:text-noir-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {selectedCity !== "All Cities" && cityIntros[selectedCity] && (
            <p className="text-sm text-noir-500 italic">{cityIntros[selectedCity]}</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. DESIGNER GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="pb-20 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-noir-500 mb-8">{filtered.length} designer{filtered.length !== 1 ? "s" : ""}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => (
              <DesignerCard key={i} d={d} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-serif text-xl text-noir-500">No designers found</p>
              <p className="text-sm text-noir-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. RISING THIS SEASON
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold-500/80">Rising This Season</p>
          </div>
          <h2 className="section-heading mb-12">Just Launched</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {risingDesigners.map((d, i) => (
              <Link key={i} to={`/${d.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={d.featured} alt={d.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] bg-gold-400 text-noir-950 px-2.5 py-1 font-medium">{d.badge}</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-serif text-xl text-noir-900">{d.name}</h3>
                    <p className="text-sm text-noir-600 mt-1">{d.city} · {d.craft[0]}</p>
                    <p className="text-xs text-noir-500 mt-2 leading-relaxed line-clamp-2">{d.bio}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. BROWSE BY CRAFT
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Heritage</p>
          <h2 className="section-heading mb-12">Browse by Craft</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {crafts.map((c, i) => (
              <button
                key={i}
                onClick={() => { setSelectedCraft(c.name); setShowFilters(false); window.scrollTo({ top: 600, behavior: "smooth" }); }}
                className="text-left border border-noir-100 bg-stone-50 p-6 hover:border-gold-400/30 transition-colors duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-base text-noir-900 group-hover:text-gold-500 transition-colors">{c.name}</h3>
                  <span className="text-[10px] text-noir-500 bg-white px-2 py-0.5 border border-noir-100">{c.count}</span>
                </div>
                <p className="text-xs text-noir-500 mb-2">{c.region}</p>
                <p className="text-sm text-noir-500 leading-relaxed">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. FEATURED STUDIO
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Adorzia Studios</p>
          <h2 className="section-heading mb-12">Featured Studio</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={studio.img} alt={`Adorzia Studio — ${studio.city}`} className="absolute inset-0 w-full h-full object-cover opacity-85" />
                <div className="absolute bottom-5 left-5">
                  <span className="text-xs uppercase tracking-[0.2em] bg-white/80 backdrop-blur-sm text-noir-900 px-3 py-1.5">{studio.city}</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h3 className="font-serif text-2xl md:text-3xl text-noir-900 font-medium mb-4">
                Adorzia Studio <span className="text-gold-500">· {studio.city}</span>
              </h3>
              <p className="text-noir-500 leading-relaxed mb-6">{studio.description}</p>
              <div className="flex items-center gap-3 mb-8">
                <span className="font-serif text-3xl text-gold-500">{studio.designers}</span>
                <span className="text-sm text-noir-500">designers currently based</span>
              </div>
              <Link to="/designers" className="text-sm text-gold-500 hover:text-gold-300 tracking-wide transition-colors inline-flex items-center gap-2">
                Explore all studios
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. FOR EDUCATORS & PRESS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-noir-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-noir-500 mb-6">For Educators & Press</p>
          <h2 className="font-serif text-2xl md:text-3xl text-noir-900 font-medium leading-snug mb-6">
            Supporting the Future of Pakistani Fashion
          </h2>
          <p className="text-noir-500 leading-relaxed max-w-xl mx-auto mb-10">
            Adorzia collaborates with fashion schools, journalists, and international buyers to elevate
            emerging Pakistani designers. We welcome press inquiries, academic partnerships,
            and wholesale collaborations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="btn-outline text-sm">Press Kit</a>
            <a href="#" className="text-sm text-noir-500 hover:text-gold-500 tracking-wide transition-colors underline underline-offset-4">Collaboration Inquiry</a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. FOOTER CTA — Designer application
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-label mb-4">Open Call</p>
          <h2 className="font-serif text-3xl md:text-5xl text-noir-900 font-medium leading-tight mb-6">
            Are You a
            <br />
            <span className="italic text-gold-500">Designer?</span>
          </h2>
          <p className="text-noir-500 leading-relaxed max-w-lg mx-auto mb-10">
            Adorzia is actively seeking emerging Pakistani fashion talent — from final-year students
            to independent creatives ready for their first international showcase.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/spotlight-apply" className="btn-primary">
              Apply to Join
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link to="/spotlight" className="btn-outline">View Spotlight Open Call</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Helper Components ──────────────────────────────────────────── */

function FilterGroup({ label, options, selected, onSelect }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-noir-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onSelect(selected === o ? null : o)}
            className={`px-3 py-1.5 text-xs border transition-colors ${
              selected === o
                ? "bg-gold-400/10 border-gold-400/50 text-gold-500"
                : "border-noir-100 text-noir-500 hover:border-noir-300 hover:text-noir-900"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function DesignerCard({ d }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/${d.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Banner */}
        <img
          src={d.banner}
          alt={`${d.name} banner`}
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:opacity-40"
        />
        {/* Featured piece on hover */}
        {hovered && (
          <img
            src={d.featured}
            alt={`Featured by ${d.name}`}
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/40 to-transparent" />

        {/* Career stage badge */}
        <div className="absolute top-4 right-4">
          <span className="text-[9px] uppercase tracking-[0.15em] bg-white/70 backdrop-blur-sm text-noir-600 px-2 py-1 border border-noir-200">
            {d.stage}
          </span>
        </div>
      </div>

      {/* Portrait overlapping bottom edge */}
      <div className="relative -mt-8 px-5">
        <img
          src={d.portrait}
          alt={d.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-noir-950 shadow-lg"
        />
      </div>

      <div className="px-5 pt-3 pb-2">
        <h3 className="font-serif text-lg text-noir-900 group-hover:text-gold-500 transition-colors duration-300">
          {d.name}
        </h3>
        <p className="text-xs text-noir-500 mt-0.5">{d.city} · {d.collections} collection{d.collections !== 1 ? "s" : ""}</p>

        {/* Craft tags */}
        <div className="flex gap-2 mt-3">
          {d.craft.slice(0, 2).map((c, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider text-gold-500/60 border border-noir-100 px-2 py-0.5">
              {c}
            </span>
          ))}
        </div>

        <p className="text-sm text-noir-500 mt-3 leading-relaxed line-clamp-2">{d.bio}</p>

        <span className="inline-flex items-center gap-1.5 text-xs text-gold-500 mt-4 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Profile
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </span>
      </div>
    </Link>
  );
}
