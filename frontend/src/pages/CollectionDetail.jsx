import { useParams, Link } from "react-router-dom";
import { useState } from "react";

/* ── Mock data ──────────────────────────────────────────────────── */
const collection = {
  name: "Geometry of Home",
  season: "Spring / Summer 2026",
  designer: { name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop" },
  craftTradition: "Ralli Quilting",
  statement: "A meditation on displacement and belonging — deconstructing the quilts my grandmother made, and rebuilding them in the silhouette of the life I chose.",
  banner: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=700&fit=crop",

  story: {
    editorial: "Geometry of Home began not with a sketch, but with a memory. Ayesha's grandmother, Zainab, made over 200 Ralli quilts in her lifetime — none for sale, all for family. Each quilt marked a life event: a birth, a marriage, a departure. When Ayesha left Hyderabad for Lahore to study at the National College of Arts, Zainab gave her a quilt made from fabric remnants of Ayesha's childhood clothes. That quilt became the emotional and formal starting point for this collection. Each garment deconstructs a traditional Ralli pattern — chessboard, diamond, ladder — and reassembles it in deadstock linen, washed organic cotton, and raw silk. The palette moves from deep indigo (a nod to the dye vats of Bhit Shah) through bone white to a final golden amber, tracing the journey from origin to arrival. The collection is limited to 16 pieces, each numbered and accompanied by a note identifying the Ralli pattern it references and the artisan who contributed to its making.",
    details: {
      craftTechnique: "Ralli Quilting — hand-pieced geometric patterns",
      materialsUsed: "Deadstock Linen, Organic Cotton, Raw Silk, Natural Indigo Dye",
      regionOfOrigin: "Sindh — Bhit Shah, Hyderabad, Thar",
      numberOfPieces: "16",
      priceRange: "PKR 24,500 – PKR 56,000",
      madeIn: "Lahore Studio & Sindh Artisan Network",
    },
  },

  designersNote: "This collection is a letter to my grandmother. Every pattern I used, she taught me. Every fabric choice is a conversation between her world and mine. I hope when someone wears these pieces, they feel the weight of that inheritance — and the lightness of making it their own.",

  pieces: [
    { id: 1, name: "Ralli Deconstruction Coat", tag: "Deadstock Linen · Hand-stitched", price: "PKR 48,000", sizes: ["XS", "S", "M", "L"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=650&fit=crop" },
    { id: 2, name: "Indigo Quilt Fragment Cape", tag: "Organic Cotton · Natural Indigo", price: "PKR 36,500", sizes: ["S", "M", "L"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop" },
    { id: 3, name: "Courtyard Linen Dress", tag: "Washed Linen · Block Print", price: "PKR 29,000", sizes: ["XS", "S", "M", "L", "XL"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop" },
    { id: 4, name: "Monsoon Silk Trousers", tag: "Raw Silk · Handwoven", price: "PKR 24,500", sizes: ["S", "M", "L"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=650&fit=crop" },
    { id: 5, name: "Diamond Pattern Scarf", tag: "Organic Cotton · Ralli Motif", price: "PKR 8,500", sizes: ["One Size"], category: "Accessories", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=650&fit=crop" },
    { id: 6, name: "Heritage Fabric Panel", tag: "Mixed Textile · Unstitched", price: "PKR 14,000", sizes: ["One Size"], category: "Unstitched", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=650&fit=crop" },
    { id: 7, name: "Ladder Stitch Blazer", tag: "Deadstock Linen · Hand-finished", price: "PKR 56,000", sizes: ["XS", "S", "M"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop" },
    { id: 8, name: "Chessboard Wrap Skirt", tag: "Cotton · Block Print", price: "PKR 22,000", sizes: ["S", "M", "L", "XL"], category: "Ready to Wear", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop" },
  ],

  process: [
    { img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop", caption: "Sketchbook — Ralli geometry studies" },
    { img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop", caption: "Fabric selection — deadstock linen swatches" },
    { img: "https://images.unsplash.com/photo-1596395463382-6b5f47775532?w=500&h=500&fit=crop", caption: "Hand stitching — Bhit Shah artisan cooperative" },
    { img: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&h=500&fit=crop", caption: "Finishing — Lahore studio quality check" },
    { img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&h=500&fit=crop", caption: "Natural indigo dyeing — Hyderabad" },
    { img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop", caption: "Final lookbook — editorial shoot" },
  ],

  craftDeepDive: {
    title: "Ralli Quilting — The Architecture of Cloth",
    img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=900&h=600&fit=crop",
    text: "Ralli is not embroidery — it is architecture in cloth. Born in the rural communities of Sindh, Balochistan, and southern Punjab, this quilting tradition has been practiced for centuries by women who have never attended a design school yet produce work of extraordinary geometric sophistication. The technique involves layering old fabric scraps, cutting precise geometric shapes, and hand-stitching them together in patterns that carry names passed between generations: 'chessboard' for strategy, 'diamond' for resilience, 'ladder' for aspiration.\n\nWhat makes Ralli rare globally is that it is a purely additive, zero-waste textile practice — nothing is discarded, every fragment has structural purpose. In an era of mass production, a Ralli garment carries the accumulated knowledge of generations, the hand of specific women, and the story of specific communities. Ayesha's interpretation preserves the geometric vocabulary while translating it into contemporary silhouettes — producing garments that are simultaneously ancient and entirely new.",
  },

  sizing: {
    guide: [
      { size: "XS", bust: "32\"", waist: "26\"", hips: "36\"" },
      { size: "S", bust: "34\"", waist: "28\"", hips: "38\"" },
      { size: "M", bust: "36\"", waist: "30\"", hips: "40\"" },
      { size: "L", bust: "38\"", waist: "32\"", hips: "42\"" },
      { size: "XL", bust: "40\"", waist: "34\"", hips: "44\"" },
    ],
    care: [
      "Dry clean recommended for structured pieces (coats, blazers)",
      "Hand wash cold for cotton and linen dresses",
      "Do not bleach — natural dyes are sensitive to harsh chemicals",
      "Lay flat to dry — avoid tumble drying",
      "Iron on low heat with a pressing cloth",
    ],
    notes: [
      "Each piece is handmade — slight variations in pattern and colour are intentional and unique to your garment",
      "Made-to-order pieces require 3–4 weeks for production",
      "A care card with specific instructions is included with every piece",
    ],
  },

  shipping: {
    regions: [
      { region: "Pakistan", time: "3–5 business days" },
      { region: "Middle East & South Asia", time: "7–10 business days" },
      { region: "Europe & UK", time: "10–14 business days" },
      { region: "North America", time: "10–14 business days" },
      { region: "Rest of World", time: "14–21 business days" },
    ],
    packaging: "Every piece is wrapped in unbleached cotton and shipped in a reusable cardboard mailer printed with vegetable-based inks. No single-use plastic.",
    customs: "International buyers are responsible for any customs duties or import taxes applicable in their country. Adorzia provides all documentation required for smooth clearance.",
  },

  alsoLike: [
    { name: "Threads of the Indus", designer: "Ayesha Siddiqui", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=650&fit=crop" },
    { name: "Mughal Geometry — FW26", designer: "Zara Hameed", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=650&fit=crop" },
    { name: "Sindhi Indigo Edit", designer: "Bilal Raza", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop" },
    { name: "Heritage Rilli Coat Collection", designer: "Noor & Sons", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop" },
  ],
};

const filters = ["All", "Ready to Wear", "Accessories", "Unstitched", "Custom Order"];

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CollectionDetail() {
  const { slug } = useParams();
  const c = collection;
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredPieces = activeFilter === "All" ? c.pieces : c.pieces.filter((p) => p.category === activeFilter);

  const toggleWishlist = (id) => setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. COLLECTION HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={c.banner} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-noir-950/30 via-noir-950/50 to-noir-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          <p className="section-label mb-6">{c.season}</p>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-noir-900 leading-[0.92] tracking-tight max-w-4xl">
            {c.name}
          </h1>

          {/* Linked designer credit */}
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to={`/${c.designer.slug}`} className="text-sm text-gold-500 hover:text-gold-300 transition-colors tracking-wide">
              by {c.designer.name}
            </Link>
            <span className="text-noir-700">|</span>
            <span className="text-xs uppercase tracking-[0.2em] text-noir-500">{c.craftTradition}</span>
          </div>

          <p className="mt-6 text-noir-600 max-w-2xl leading-relaxed text-base md:text-lg italic">
            "{c.statement}"
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. COLLECTION STORY
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-10">The Story</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <p className="text-noir-600 leading-[1.85] text-base md:text-lg">{c.story.editorial}</p>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-noir-100 bg-stone-50 divide-y divide-white/5">
                {Object.entries(c.story.details).map(([key, val]) => (
                  <div key={key} className="px-6 py-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-1.5">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm text-noir-600 leading-relaxed">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. DESIGNER'S NOTE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="section-label mb-10">Designer's Note</p>

          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-noir-900 leading-snug italic">
            "{c.designersNote}"
          </blockquote>

          <div className="mt-10 flex items-center justify-center gap-4">
            <img src={c.designer.avatar} alt={c.designer.name} className="w-10 h-10 rounded-full object-cover border border-gold-400/30" />
            <div className="text-left">
              <p className="text-sm text-noir-900">{c.designer.name}</p>
              <p className="text-xs text-noir-500">Designer — {c.craftTradition}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. THE PIECES — Product Grid with Filters
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">The Collection</p>
          <h2 className="section-heading mb-10">The Pieces</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.2em] border transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-gold-400 text-noir-950 border-gold-400"
                    : "bg-transparent text-noir-500 border-noir-200 hover:border-gold-400/30 hover:text-gold-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPieces.map((p) => (
              <article key={p.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
                  <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <svg className={`w-4 h-4 ${wishlist.includes(p.id) ? "text-gold-500" : "text-noir-900/50"}`} fill={wishlist.includes(p.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Sizes */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-noir-950/80 to-transparent">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.sizes.map((s) => (
                        <span key={s} className="text-[10px] text-noir-600 border border-white/15 px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gold-500/60 mb-1">{p.tag}</p>
                  <h3 className="font-serif text-base text-noir-900 leading-snug">{p.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-noir-500">{p.price}</span>
                    <Link to={`/pieces/${p.id}`} className="text-[10px] uppercase tracking-[0.2em] text-gold-500 hover:text-gold-300 transition-colors">
                      View Piece →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. PROCESS & MAKING
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Behind the Seams</p>
          <h2 className="section-heading mb-10">Process & Making</h2>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {c.process.map((item, i) => (
              <div key={i} className="shrink-0 w-72 snap-start group">
                <div className="relative aspect-square overflow-hidden">
                  <img src={item.img} alt={item.caption} className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                </div>
                <p className="mt-3 text-xs text-noir-500 leading-relaxed">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. CRAFT TECHNIQUE DEEP DIVE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-10">Craft Technique</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative overflow-hidden aspect-[3/2]">
              <img src={c.craftDeepDive.img} alt={c.craftDeepDive.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl md:text-4xl text-noir-900 font-medium leading-tight mb-8">
                {c.craftDeepDive.title}
              </h2>
              {c.craftDeepDive.text.split("\n\n").map((para, i) => (
                <p key={i} className={`${i > 0 ? "mt-6" : ""} text-noir-600 leading-[1.85] text-base md:text-lg`}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. SIZING & CARE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Fit & Maintenance</p>
          <h2 className="section-heading mb-14">Sizing & Care</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Size guide */}
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-5">Size Guide (inches)</p>
              <div className="border border-noir-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white text-noir-500">
                      <th className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.2em] font-normal">Size</th>
                      <th className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.2em] font-normal">Bust</th>
                      <th className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.2em] font-normal">Waist</th>
                      <th className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.2em] font-normal">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.sizing.guide.map((row, i) => (
                      <tr key={i} className="border-t border-noir-100 text-noir-600">
                        <td className="px-5 py-3 text-gold-500/80 font-medium">{row.size}</td>
                        <td className="px-5 py-3">{row.bust}</td>
                        <td className="px-5 py-3">{row.waist}</td>
                        <td className="px-5 py-3">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Care + notes */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-4">Fabric Care</p>
                <ul className="space-y-2.5">
                  {c.sizing.care.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-noir-600">
                      <span className="mt-1.5 w-1 h-1 shrink-0 bg-gold-400/50 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-4">Handmade Notes</p>
                <ul className="space-y-2.5">
                  {c.sizing.notes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-noir-600">
                      <span className="mt-1.5 w-1 h-1 shrink-0 bg-gold-400/50 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. SHIPPING & GLOBAL DELIVERY
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Delivery</p>
          <h2 className="section-heading mb-14">Shipping & Global Delivery</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Regions */}
            <div className="lg:col-span-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-5">Estimated Delivery Times</p>
              <div className="border border-noir-100 divide-y divide-white/5">
                {c.shipping.regions.map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <span className="text-sm text-noir-600">{r.region}</span>
                    <span className="text-sm text-gold-500/80">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Packaging + Customs */}
            <div className="lg:col-span-6 space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-4">Packaging</p>
                <p className="text-sm text-noir-600 leading-relaxed">{c.shipping.packaging}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-4">Customs & Duties</p>
                <p className="text-sm text-noir-600 leading-relaxed">{c.shipping.customs}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. YOU MAY ALSO LIKE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Continue Exploring</p>
          <h2 className="section-heading mb-12">You May Also Like</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.alsoLike.map((item, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif text-base text-noir-900 leading-snug">{item.name}</h3>
                    <p className="text-xs text-noir-500 mt-1">{item.designer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. OWN A PIECE OF THIS STORY — Editorial CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-label mb-6">Own a Piece of This Story</p>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-noir-900 font-medium leading-tight">
            When You Wear This,
            <br />
            <span className="italic text-gold-500">You Carry It Forward</span>
          </h2>

          <p className="mt-6 text-noir-600 leading-relaxed max-w-xl mx-auto">
            Every piece from {c.name} supports an emerging Pakistani designer, funds fair wages for a network of rural artisans, and helps preserve a craft tradition that stretches back centuries. This is fashion with provenance — and you become part of its story.
          </p>

          <div className="mt-12 max-w-lg mx-auto">
            <p className="text-[10px] uppercase tracking-[0.25em] text-noir-500 mb-4">Be notified when new pieces drop</p>

            {!subscribed ? (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3.5 bg-stone-50 border border-noir-200 text-noir-900 text-sm placeholder:text-noir-500 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
                <button type="submit" className="btn-primary shrink-0">Notify Me</button>
              </form>
            ) : (
              <div className="border border-gold-400/20 bg-gold-400/5 px-8 py-5">
                <p className="text-gold-500 text-sm tracking-wide">Application Received — You're on the list.</p>
                <p className="text-noir-500 text-xs mt-1.5">We'll reach out when new pieces from this collection become available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
