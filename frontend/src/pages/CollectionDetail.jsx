import { useParams, Link } from "react-router-dom";
import { useState } from "react";

/* ════════════════════════════════════════════════════════════════
   MOCK DATA — will come from API later
════════════════════════════════════════════════════════════════ */
const collection = {
  name: "Geometry of Home",
  season: "Spring / Summer 2026",
  designer: { name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop", city: "Lahore" },
  craftTradition: "Ralli Quilting",
  statement: "A meditation on displacement and belonging — deconstructing the quilts my grandmother made, and rebuilding them in the silhouette of the life I chose.",
  banner: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=700&fit=crop",

  story: {
    narrative:
      "Geometry of Home began not with a sketch, but with a memory. Ayesha's grandmother, Zainab, made over 200 Ralli quilts in her lifetime — none for sale, all for family. Each quilt marked a life event: a birth, a marriage, a departure.\n\nWhen Ayesha left Hyderabad for Lahore to study at the National College of Arts, Zainab gave her a quilt made from fabric remnants of Ayesha's childhood clothes. That quilt became the emotional and formal starting point for this collection.\n\nEach garment deconstructs a traditional Ralli pattern — chessboard, diamond, ladder — and reassembles it in deadstock linen, washed organic cotton, and raw silk. The palette moves from deep indigo (a nod to the dye vats of Bhit Shah) through bone white to a final golden amber, tracing the journey from origin to arrival.\n\nThe collection is limited to 16 pieces, each numbered and accompanied by a note identifying the Ralli pattern it references and the artisan who contributed to its making.",
  },

  lookbook: [
    { img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1100&fit=crop", caption: "Look 1 — Ralli Deconstruction Coat" },
    { img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1100&fit=crop", caption: "Look 2 — Indigo Quilt Fragment Cape" },
    { img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1100&fit=crop", caption: "Look 3 — Courtyard Linen Dress" },
    { img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1100&fit=crop", caption: "Look 4 — Monsoon Silk Trousers" },
    { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1100&fit=crop", caption: "Look 5 — Diamond Pattern Scarf" },
    { img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1100&fit=crop", caption: "Look 6 — Heritage Fabric Panel" },
    { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1100&fit=crop", caption: "Look 7 — Ladder Stitch Blazer" },
    { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1100&fit=crop", caption: "Look 8 — Chessboard Wrap Skirt" },
  ],

  runway: [
    { img: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&h=600&fit=crop", caption: "Opening walk — Indigo sequence" },
    { img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=900&h=600&fit=crop", caption: "Mid-show — Bone white transition" },
    { img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=600&fit=crop", caption: "Finale — Golden amber ensemble" },
  ],

  products: [
    { id: 1, name: "Ralli Deconstruction Coat", tag: "Deadstock Linen · Hand-stitched", price: "PKR 48,000", sizes: ["XS", "S", "M", "L"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=650&fit=crop" },
    { id: 2, name: "Indigo Quilt Fragment Cape", tag: "Organic Cotton · Natural Indigo", price: "PKR 36,500", sizes: ["S", "M", "L"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop" },
    { id: 3, name: "Courtyard Linen Dress", tag: "Washed Linen · Block Print", price: "PKR 29,000", sizes: ["XS", "S", "M", "L", "XL"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop" },
    { id: 4, name: "Monsoon Silk Trousers", tag: "Raw Silk · Handwoven", price: "PKR 24,500", sizes: ["S", "M", "L"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=650&fit=crop" },
    { id: 5, name: "Diamond Pattern Scarf", tag: "Organic Cotton · Ralli Motif", price: "PKR 8,500", sizes: ["One Size"], category: "Accessories", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=650&fit=crop" },
    { id: 6, name: "Heritage Fabric Panel", tag: "Mixed Textile · Unstitched", price: "PKR 14,000", sizes: ["One Size"], category: "Unstitched", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=650&fit=crop" },
    { id: 7, name: "Ladder Stitch Blazer", tag: "Deadstock Linen · Hand-finished", price: "PKR 56,000", sizes: ["XS", "S", "M"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop" },
    { id: 8, name: "Chessboard Wrap Skirt", tag: "Cotton · Block Print", price: "PKR 22,000", sizes: ["S", "M", "L", "XL"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop" },
  ],

  materials: {
    textiles: [
      { name: "Deadstock Linen", origin: "Sourced from Karachi textile mills", detail: "Unused fabric diverted from landfill — gives each piece a pre-existing history." },
      { name: "Organic Cotton", origin: "Punjab, certified organic farms", detail: "Grown without synthetic pesticides. Softer hand-feel, lower environmental impact." },
      { name: "Raw Silk", origin: "Orangi Town, Karachi weavers", detail: "Unprocessed silk with natural slubs — adds texture and weight to structured pieces." },
      { name: "Natural Indigo Dye", origin: "Bhit Shah, Sindh", detail: "Plant-based dye extracted from Indigofera tinctoria. Deepens with age, unique to each garment." },
    ],
    craftsmanship: [
      "Hand-pieced Ralli geometric patterns — no two pieces identical",
      "Block-printed motifs using 300-year-old carved wooden blocks",
      "Hand-finished seams and hems — no machine stitching on visible surfaces",
      "Natural dyeing process takes 3–5 days per batch",
      "Each garment passes through at least 3 artisan hands before completion",
    ],
  },

  designerInfo: {
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
    name: "Ayesha Siddiqui",
    city: "Lahore",
    established: 2023,
    bio: "Ayesha's design practice began in her grandmother's courtyard in Hyderabad. After graduating from the National College of Arts, she spent two years apprenticing with master dyers in Bhit Shah before launching her eponymous label. Her work occupies the space between heritage craft and contemporary minimalism.",
    quote: "I don't design clothes — I design continuity.",
  },

  relatedCollections: [
    { name: "Threads of the Indus", designer: "Ayesha Siddiqui", season: "FW25", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=650&fit=crop" },
    { name: "Mughal Geometry", designer: "Zara Hameed", season: "FW26", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=650&fit=crop" },
    { name: "Sindhi Indigo Edit", designer: "Bilal Raza", season: "SS26", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop" },
    { name: "Heritage Rilli Coat", designer: "Noor & Sons", season: "FW25", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop" },
  ],
};

const productFilters = ["All", "Ready to Wear", "Accessories", "Unstitched"];

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CollectionDetail() {
  const { slug } = useParams();
  const c = collection;
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  const filteredPieces = activeFilter === "All" ? c.products : c.products.filter((p) => p.category === activeFilter);
  const toggleWishlist = (id) => setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO — Campaign Imagery
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={c.banner} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-40 w-full">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-6">{c.season}</p>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-charcoal-900 leading-[0.92] tracking-tight max-w-4xl">
            {c.name}
          </h1>

          {/* Designer credit */}
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to={`/${c.designer.slug}`} className="text-sm text-bronze-500 hover:text-bronze-400 transition-colors tracking-wide">
              by {c.designer.name}
            </Link>
            <span className="text-stone-300">|</span>
            <span className="text-xs uppercase tracking-[0.2em] text-charcoal-400">{c.craftTradition}</span>
            <span className="text-stone-300">|</span>
            <span className="text-xs text-charcoal-400">{c.designer.city}</span>
          </div>

          <p className="mt-6 text-charcoal-500 max-w-2xl leading-relaxed text-base md:text-lg italic">
            "{c.statement}"
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. COLLECTION STORY — Narrative
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Story</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Collection Narrative</h2>

            {c.story.narrative.split("\n\n").map((para, i) => (
              <p key={i} className={`${i > 0 ? "mt-6" : ""} text-charcoal-500 leading-[1.9] text-base md:text-lg`}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. LOOKBOOK — Full Campaign Gallery
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Campaign</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">Lookbook</h2>
          <p className="text-sm text-charcoal-400 mb-14 max-w-xl">Full campaign imagery — each look styled and photographed as a standalone editorial.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {c.lookbook.map((look, i) => (
              <div key={i} className="group relative overflow-hidden cursor-pointer">
                <div className={`${i === 0 ? "aspect-[3/4] md:col-span-2 md:row-span-2" : "aspect-[3/4]"}`}>
                  <img
                    src={look.img}
                    alt={look.caption}
                    className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.02]"
                  />
                </div>
                {/* Caption overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-charcoal-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs text-white tracking-wide">{look.caption}</p>
                </div>
                {/* Look number */}
                <div className="absolute top-3 left-3">
                  <span className="font-serif text-sm text-white/60 bg-charcoal-950/30 backdrop-blur-sm px-2 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. RUNWAY PRESENTATION (Optional)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500/70 mb-4">Presentation</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white font-medium mb-14">Runway</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {c.runway.map((shot, i) => (
              <div key={i} className="group relative overflow-hidden">
                <div className="aspect-[3/2]">
                  <img
                    src={shot.img}
                    alt={shot.caption}
                    className="w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-90 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-charcoal-950/90 to-transparent">
                  <p className="text-xs text-ivory-300 tracking-wide">{shot.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. PRODUCTS — All pieces from collection
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Collection</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">Products</h2>
          <p className="text-sm text-charcoal-400 mb-10">
            {c.products.length} pieces · {c.season} · Limited edition
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {productFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 text-[11px] uppercase tracking-[0.18em] border transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-charcoal-900 text-white border-charcoal-900"
                    : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPieces.map((p) => (
              <article key={p.id} className="group">
                <Link to={`/pieces/${p.id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                    />
                    {/* Wishlist */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-colors"
                    >
                      <svg className={`w-4 h-4 ${wishlist.includes(p.id) ? "text-bronze-500" : "text-charcoal-900/40"}`} fill={wishlist.includes(p.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    {/* Sizes */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal-950/80 to-transparent">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.sizes.map((s) => (
                          <span key={s} className="text-[10px] text-ivory-200 border border-ivory-50/15 px-2 py-0.5">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-bronze-500/60 mb-1">{p.tag}</p>
                    <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-charcoal-400">{p.price}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-bronze-500">View →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. MATERIALS & CRAFTSMANSHIP
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Provenance</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Materials & Craftsmanship</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Textiles */}
            <div className="lg:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-6">Textiles Used</p>
              <div className="space-y-5">
                {c.materials.textiles.map((t, i) => (
                  <div key={i} className="border border-stone-200 bg-white p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-base text-charcoal-900">{t.name}</h3>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-bronze-500/60">{t.origin}</span>
                    </div>
                    <p className="text-sm text-charcoal-400 leading-relaxed">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Craftsmanship */}
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-6">Craftsmanship Details</p>
              <div className="border-l-2 border-bronze-400 pl-6 space-y-4">
                {c.materials.craftsmanship.map((item, i) => (
                  <p key={i} className="text-sm text-charcoal-500 leading-relaxed flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-bronze-300 rounded-full" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. DESIGNER INFORMATION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Designer</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">About {c.designerInfo.name}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <Link to={`/${c.designerInfo.name.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={c.designerInfo.avatar} alt={c.designerInfo.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-serif text-xl text-white">{c.designerInfo.name}</h3>
                    <p className="text-xs text-ivory-300 mt-1">{c.designerInfo.city} · Est. {c.designerInfo.established}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-bronze-500 text-sm">
                  <span>View Profile</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </div>

            <div className="lg:col-span-8">
              <p className="text-charcoal-500 leading-[1.85] text-base md:text-lg">{c.designerInfo.bio}</p>
              <div className="mt-8 border-l-2 border-bronze-400 pl-6">
                <p className="font-serif text-xl md:text-2xl text-charcoal-800 italic">"{c.designerInfo.quote}"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. RELATED COLLECTIONS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Continue Exploring</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Related Collections</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.relatedCollections.map((rc, i) => (
              <Link
                key={i}
                to={`/collections/${rc.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={rc.img}
                    alt={rc.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">{rc.season}</p>
                    <h3 className="font-serif text-base text-white group-hover:text-bronze-400 transition-colors duration-300">{rc.name}</h3>
                    <p className="text-xs text-ivory-300 mt-1">{rc.designer}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
