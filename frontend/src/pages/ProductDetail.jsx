import { useParams, Link } from "react-router-dom";
import { useState } from "react";

/* ── Mock data ──────────────────────────────────────────────────── */
const product = {
  name: "Ajrak Architect Coat",
  collection: { name: "Geometry of Home", slug: "geometry-of-home" },
  designer: { name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", avatar: "/assets/images/home-designer-portrait-1.webp", city: "Lahore" },
  craftTradition: "Ajrak Block Printing",
  oneLiner: "A structured outerwear piece deconstructing traditional Ajrak geometry into a modern architectural silhouette.",
  price: "PKR 48,000",
  gallery: [
    "/assets/images/ajrak-architect-coat-adorzia1.webp",
    "/assets/images/ajrak-architect-coat-adorzia2.webp",
    "/assets/images/ajrak-architect-coat-adorzia1.webp",
    "/assets/images/ajrak-architect-coat-adorzia2.webp",
    "/assets/images/ajrak-architect-coat-adorzia1.webp",
  ],
  galleryLabels: ["Front", "Back", "Detail", "On Model", "Fabric Close-up"],
  sizes: ["XS", "S", "M", "L", "XL"],
  color: "Indigo / Bone White",
  story: {
    editorial: "The Ajrak Architect Coat was the first piece Ayesha sketched for Geometry of Home — and the last to be completed. Inspired by the structured geometry of Mughal jali screens and the organic imperfection of hand-block printing, the coat took four months to develop. The Ajrak blocks were carved by master artisan Ustaad Raheem in Bhit Shah, using techniques unchanged for 300 years. Each coat passes through 11 stages of printing and dyeing using natural indigo and madder root. The silhouette is deliberately architectural — boxy shoulders, a dropped waist, and an exaggerated collar that references both a traditional Sindhi shawl and a contemporary trench coat. The lining is raw silk, hand-dyed in Hyderabad. No two coats are identical — slight variations in block alignment and dye absorption make each piece one of one.",
    specs: {
      fabric: "Deadstock Linen (outer), Raw Silk (lining)",
      technique: "Ajrak Hand Block Printing — 11 stages",
      embellishment: "None — pattern is the embellishment",
      lining: "Hand-dyed Raw Silk, Hyderabad",
      occasion: "Formal · Editorial · Gallery Openings",
      fitType: "Relaxed Architectural — dropped shoulder, boxy",
      madeIn: "Lahore Studio & Bhit Shah Artisan Workshop",
      estimatedDispatch: "3–4 weeks (made to order)",
    },
  },
  designersNote: "This coat is the bridge between everything I am — the engineer who loves structure, and the granddaughter who grew up wrapped in Ajrak. Every time I see someone wear it, I feel like my grandmother is in the room.",
  making: [
    { img: "/assets/images/home-heritage-craft.webp", caption: "Raw linen selected from Lahore deadstock dealers" },
    { img: "/assets/images/craft.webp", caption: "Ajrak blocks hand-carved by Ustaad Raheem, Bhit Shah" },
    { img: "/assets/images/home-fabric-innovation.webp", caption: "Block printing in progress — natural indigo dye" },
    { img: "/assets/images/home-sustainable-fashion.webp", caption: "Hand finishing at Lahore studio" },
    { img: "/assets/images/home-hero-craft.webp", caption: "Final piece — quality check and packaging" },
  ],
  styling: {
    occasions: ["Formal", "Gallery Opening", "Everyday Luxury", "Resort"],
    copy: "Layer over a silk slip dress for gallery openings, or pair with wide-leg linen trousers for everyday luxury. The coat's architectural silhouette works best when the layers beneath are minimal — let the Ajrak geometry be the statement.",
    images: [
      "/assets/images/home-luxury-bridal.webp",
      "/assets/images/home-fabric-innovation.webp",
      "/assets/images/home-sustainable-fashion.webp",
    ],
  },
  sizing: {
    guide: [
      { size: "XS", bust: "32\"", waist: "26\"", hips: "36\"", length: "44\"" },
      { size: "S", bust: "34\"", waist: "28\"", hips: "38\"", length: "45\"" },
      { size: "M", bust: "36\"", waist: "30\"", hips: "40\"", length: "46\"" },
      { size: "L", bust: "38\"", waist: "32\"", hips: "42\"", length: "47\"" },
      { size: "XL", bust: "40\"", waist: "34\"", hips: "44\"", length: "48\"" },
    ],
    notes: [
      "Relaxed fit — if between sizes, we recommend sizing down",
      "Custom sizing available at no additional cost — select 'Request Custom Size' at checkout",
      "Dropped shoulder design accommodates a range of body types",
      "Linen has minimal stretch — fabric softens beautifully with wear",
    ],
  },
  care: [
    "Dry clean only — natural indigo dye is sensitive to water immersion",
    "Store on a wide wooden hanger to maintain the shoulder structure",
    "Keep away from direct sunlight when stored — natural dyes fade over time",
    "Block print may show slight variation after cleaning — this is inherent to the technique",
    "Iron on reverse with a pressing cloth at low heat",
  ],
  shipping: {
    dispatch: "3–4 weeks from order (each piece is made to order)",
    regions: [
      { region: "Pakistan", time: "3–5 business days" },
      { region: "Middle East & South Asia", time: "7–10 business days" },
      { region: "Europe & UK", time: "10–14 business days" },
      { region: "North America", time: "10–14 business days" },
      { region: "Rest of World", time: "14–21 business days" },
    ],
    packaging: "Wrapped in unbleached cotton, shipped in a reusable cardboard mailer with vegetable-based ink printing. Includes a care card and artisan provenance certificate.",
    customs: "International orders may incur customs duties or import taxes. Adorzia provides all required documentation for smooth clearance.",
  },
  sameCollection: [
    { name: "Indigo Quilt Fragment Cape", price: "PKR 36,500", img: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
    { name: "Courtyard Linen Dress", price: "PKR 29,000", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
    { name: "Monsoon Silk Trousers", price: "PKR 24,500", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
    { name: "Ladder Stitch Blazer", price: "PKR 56,000", img: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  ],
  sameDesigner: [
    { name: "Threads of the Indus", type: "Collection", img: "/assets/images/home-heritage-craft.webp" },
    { name: "Hyderabad Monochrome", type: "Collection", img: "/assets/images/craft.webp" },
    { name: "Heritage Rilli Coat", type: "Signature Piece", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
    { name: "Diamond Pattern Scarf", type: "Accessory", img: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
  ],
  alsoLike: [
    { name: "Mughal Geometry Coat", designer: "Zara Hameed", img: "/assets/images/ajrak-architect-coat-adorzia2.webp" },
    { name: "Sindhi Indigo Cape", designer: "Bilal Raza", img: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
    { name: "Pashmina Wrap Dress", designer: "Hira Khan", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
    { name: "Mirrorwork Bomber", designer: "Noor & Sons", img: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  ],
  reviews: {
    average: 0,
    total: 0,
    items: [],
  },
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function ProductDetail() {
  const { id } = useParams();
  const p = product;

  const [selectedSize, setSelectedSize] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. PRODUCT GALLERY + 2. PRODUCT INFORMATION (sticky layout)
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-noir-500 mb-8">
            <Link to={`/${p.designer.slug}`} className="hover:text-gold-500 transition-colors">{p.designer.name}</Link>
            <span className="text-noir-700">/</span>
            <Link to={`/collections/${p.collection.slug}`} className="hover:text-gold-500 transition-colors">{p.collection.name}</Link>
            <span className="text-noir-700">/</span>
            <span className="text-noir-500">{p.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            {/* ── Gallery (left) ── */}
            <div className="lg:col-span-7">
              {/* Primary image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-4">
                <img
                  src={p.gallery[activeImg]}
                  alt={`${p.name} — ${p.galleryLabels[activeImg]}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-noir-500 bg-white/60 backdrop-blur-sm px-3 py-1">
                  {p.galleryLabels[activeImg]}
                </span>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto">
                {p.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-24 overflow-hidden border transition-colors ${
                      activeImg === i ? "border-gold-400" : "border-noir-200 hover:border-noir-300"
                    }`}
                  >
                    <img src={img} alt={p.galleryLabels[i]} className="w-full h-full object-cover opacity-80" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Info Panel (right, sticky) ── */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold-500/70">{p.craftTradition}</span>

                <h1 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl text-noir-900 font-medium leading-tight">
                  {p.name}
                </h1>

                <p className="mt-3 text-noir-500 text-sm">{p.oneLiner}</p>

                {/* Price */}
                <p className="mt-6 font-serif text-2xl text-noir-900">{p.price}</p>
                <p className="text-xs text-noir-500 mt-1">Inclusive of all taxes · Made to order</p>

                <div className="divider my-8" />

                {/* Color */}
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-noir-500 mb-2">Colour</p>
                  <p className="text-sm text-noir-600">{p.color}</p>
                </div>

                {/* Size selector */}
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-noir-500 mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-12 h-12 text-sm border transition-all duration-200 ${
                          selectedSize === s
                            ? "bg-gold-400 text-noir-950 border-gold-400"
                            : "bg-transparent text-noir-600 border-noir-200 hover:border-gold-400/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-noir-500 mb-3">Quantity</p>
                  <div className="flex items-center border border-noir-200 w-fit">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-noir-500 hover:text-noir-900 transition-colors">−</button>
                    <span className="px-4 py-2 text-noir-900 text-sm min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-noir-500 hover:text-noir-900 transition-colors">+</button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <button className="btn-primary w-full justify-center">
                    Add to Bag
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </button>
                  <button
                    onClick={() => setWishlist(!wishlist)}
                    className={`btn-outline w-full justify-center ${wishlist ? "!border-gold-400 !text-gold-500" : ""}`}
                  >
                    <svg className="w-4 h-4" fill={wishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {wishlist ? "Added to Wishlist" : "Add to Wishlist"}
                  </button>
                  <button className="w-full text-center text-xs text-noir-500 hover:text-gold-500 transition-colors tracking-wider uppercase py-2">
                    Request Custom Size
                  </button>
                </div>

                {/* Designer credit */}
                <div className="mt-8 pt-6 border-t border-noir-100 flex items-center gap-3">
                  <img src={p.designer.avatar} alt={p.designer.name} className="w-8 h-8 rounded-full object-cover border border-gold-400/20" />
                  <div>
                    <Link to={`/${p.designer.slug}`} className="text-sm text-noir-900 hover:text-gold-500 transition-colors">{p.designer.name}</Link>
                    <p className="text-xs text-noir-500">{p.designer.city} · Adorzia Studio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. PRODUCT STORY
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-10">The Story Behind This Piece</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <p className="text-noir-600 leading-[1.85] text-base md:text-lg">{p.story.editorial}</p>
            </div>
            <div className="lg:col-span-5">
              <div className="border border-noir-100 bg-white divide-y divide-white/5">
                {Object.entries(p.story.specs).map(([key, val]) => (
                  <div key={key} className="px-6 py-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                    <p className="text-sm text-noir-600">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. DESIGNER'S HAND — pull quote
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-label mb-8">Designer's Hand</p>
          <blockquote className="font-serif text-2xl md:text-3xl text-noir-900 leading-snug italic">
            "{p.designersNote}"
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <img src={p.designer.avatar} alt={p.designer.name} className="w-9 h-9 rounded-full object-cover border border-gold-400/30" />
            <div className="text-left">
              <p className="text-sm text-noir-900">{p.designer.name}</p>
              <p className="text-xs text-noir-500">{p.designer.city}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. THE MAKING — horizontal strip
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Behind the Seams</p>
          <h2 className="section-heading mb-10">The Making</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {p.making.map((item, i) => (
              <div key={i} className="shrink-0 w-72 snap-start group">
                <div className="relative aspect-square overflow-hidden">
                  <img src={item.img} alt={item.caption} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                </div>
                <p className="mt-3 text-xs text-noir-500 leading-relaxed">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. WEAR IT — editorial styling
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Styling</p>
          <h2 className="section-heading mb-6">Wear It</h2>
          <p className="text-noir-500 max-w-2xl mb-10 leading-relaxed">{p.styling.copy}</p>

          {/* Occasion tags */}
          <div className="flex flex-wrap gap-3 mb-10">
            {p.styling.occasions.map((o, i) => (
              <span key={i} className="px-4 py-2 text-xs border border-noir-200 text-noir-500 tracking-wide">{o}</span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {p.styling.images.map((img, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden group">
                <img src={img} alt={`Styling ${i + 1}`} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. SIZING & FIT GUIDE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Fit</p>
          <h2 className="section-heading mb-10">Sizing & Fit Guide</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="border border-noir-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white text-noir-500">
                      {["Size", "Bust", "Waist", "Hips", "Length"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.2em] font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.sizing.guide.map((row, i) => (
                      <tr key={i} className="border-t border-noir-100 text-noir-600">
                        <td className="px-5 py-3 text-gold-500/80 font-medium">{row.size}</td>
                        <td className="px-5 py-3">{row.bust}</td>
                        <td className="px-5 py-3">{row.waist}</td>
                        <td className="px-5 py-3">{row.hips}</td>
                        <td className="px-5 py-3">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-gold-500/70">Custom sizing available at no additional cost.</p>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60">Fit Notes</p>
              <ul className="space-y-3">
                {p.sizing.notes.map((n, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-noir-600">
                    <span className="mt-1.5 w-1 h-1 shrink-0 bg-gold-400/50 rounded-full" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. CARE & LONGEVITY
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <p className="section-label mb-4">Longevity</p>
          <h2 className="section-heading mb-10">Care & Preservation</h2>
          <ul className="space-y-4">
            {p.care.map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-noir-600 leading-relaxed">
                <span className="mt-1.5 w-1 h-1 shrink-0 bg-gold-400/50 rounded-full" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. SHIPPING & DELIVERY
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Delivery</p>
          <h2 className="section-heading mb-10">Shipping & Delivery</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-3">Dispatch Timeline</p>
              <p className="text-sm text-noir-600 mb-8">{p.shipping.dispatch}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-3">Packaging</p>
              <p className="text-sm text-noir-600">{p.shipping.packaging}</p>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-5">Estimated Delivery</p>
              <div className="border border-noir-100 divide-y divide-white/5">
                {p.shipping.regions.map((r, i) => (
                  <div key={i} className="flex justify-between px-5 py-3">
                    <span className="text-sm text-noir-600">{r.region}</span>
                    <span className="text-sm text-gold-500/80">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-3">Customs & Duties</p>
              <p className="text-sm text-noir-600 leading-relaxed">{p.shipping.customs}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. FROM THE SAME COLLECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-3">{p.collection.name}</p>
              <h2 className="section-heading">From the Same Collection</h2>
            </div>
            <Link to={`/collections/${p.collection.slug}`} className="hidden md:inline-flex items-center gap-2 text-sm text-gold-500 tracking-wide hover:text-gold-300 transition-colors">
              View All <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {p.sameCollection.map((item, i) => (
              <article key={i} className="shrink-0 w-64 snap-start group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-sm text-noir-900">{item.name}</h3>
                  <p className="text-xs text-noir-500 mt-1">{item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          11. FROM THIS DESIGNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-3">By {p.designer.name}</p>
              <h2 className="section-heading">From This Designer</h2>
            </div>
            <Link to={`/${p.designer.slug}`} className="hidden md:inline-flex items-center gap-2 text-sm text-gold-500 tracking-wide hover:text-gold-300 transition-colors">
              View Profile <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {p.sameDesigner.map((item, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 to-transparent" />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-sm text-noir-900">{item.name}</h3>
                  <p className="text-xs text-noir-500 mt-0.5">{item.type}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          12. YOU MAY ALSO LIKE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-3">Discover More</p>
          <h2 className="section-heading mb-10">You May Also Like</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {p.alsoLike.map((item, i) => (
              <article key={i} className="shrink-0 w-64 snap-start group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 to-transparent" />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-sm text-noir-900">{item.name}</h3>
                  <p className="text-xs text-noir-500 mt-0.5">{item.designer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          13. REVIEWS & FIT FEEDBACK — empty state
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-label mb-4">Collectors</p>
          <h2 className="font-serif text-3xl md:text-4xl text-noir-900 font-medium leading-tight">
            Be the First to
            <br />
            <span className="italic text-gold-500">Own & Review This Piece</span>
          </h2>
          <p className="mt-6 text-noir-500 leading-relaxed max-w-xl mx-auto">
            This piece is newly released from {p.designer.name}'s current collection.
            Each piece is produced in limited quantities — own it before the world discovers it.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn-outline mt-10"
          >
            Add to Bag
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
        </div>
      </section>
    </div>
  );
}
