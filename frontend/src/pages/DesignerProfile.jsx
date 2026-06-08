import { useParams } from "react-router-dom";
import { useState } from "react";

/* ── Mock data — will come from API later ──────────────────────── */
const designer = {
  name: "Ayesha Siddiqui",
  specialty: "Ralli Quilting & Contemporary Outerwear",
  city: "Lahore",
  country: "Pakistan",
  oneLiner: "Translating centuries of Sindhi quilting tradition into sculptural modern garments.",
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
  banner: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=500&fit=crop",
  socials: { instagram: "#", pinterest: "#", linkedin: "#" },

  stats: {
    collectionsPublished: 4,
    piecesSold: 87,
    countriesShippedTo: 9,
    yearsActive: 3,
    memberSince: "2023",
  },

  about: {
    bio: "Ayesha Siddiqui's design practice began not in a studio, but in her grandmother's courtyard in Hyderabad — watching generations-old Ralli quilts being pieced together from fabric remnants. After graduating from the National College of Arts, Lahore, she spent two years apprenticing with master dyers in Bhit Shah before launching her eponymous label in 2023. Her work occupies the space between heritage craft and contemporary minimalism: deconstructed quilt patterns rendered in deadstock linen, organic cotton, and handwoven Khaddar. Each collection is produced in limited runs of 12–20 pieces, with every garment passing through the hands of at least three artisans. Ayesha's work has been featured in Dawn Images, Libas International, and the NCA Emerging Designers Showcase 2025. She operates from the Adorzia Studio in Lahore, where she mentors two junior designers and collaborates with a network of 14 rural women artisans across Sindh.",
    info: {
      education: "National College of Arts, Lahore — BFA Textile Design",
      location: "Lahore, Pakistan",
      craftSpecialties: "Ralli Quilting, Block Printing, Natural Dyeing",
      languages: "Urdu, English, Sindhi",
      awards: "NCA Emerging Designers Showcase 2025, Dawn Images 'Ones to Watch' 2024",
    },
  },

  latestCollection: {
    name: "Geometry of Home",
    season: "Spring/Summer 2026",
    description: "An exploration of displacement and belonging through the lens of Ralli geometry. Each piece deconstructs a traditional quilt pattern and rebuilds it in washed linen and raw silk — a meditation on what we carry when we leave, and what stays.",
    products: [
      { id: 1, name: "Ralli Deconstruction Coat", price: "PKR 48,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=650&fit=crop" },
      { id: 2, name: "Indigo Quilt Fragment Cape", price: "PKR 36,500", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop" },
      { id: 3, name: "Courtyard Linen Dress", price: "PKR 29,000", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop" },
      { id: 4, name: "Monsoon Silk Trousers", price: "PKR 24,500", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=650&fit=crop" },
    ],
  },

  allCollections: [
    { name: "Geometry of Home", season: "SS26", pieces: 12, img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop" },
    { name: "Threads of the Indus", season: "FW25", pieces: 18, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop" },
    { name: "Hyderabad Monochrome", season: "SS25", pieces: 10, img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop" },
    { name: "Debut Capsule", season: "FW23", pieces: 8, img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop" },
  ],

  signaturePieces: [
    { name: "The Grandmother Coat", collection: "Threads of the Indus", price: "PKR 56,000", favorites: 214, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop" },
    { name: "Indigo Fragment No. 7", collection: "Geometry of Home", price: "PKR 42,000", favorites: 189, img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop" },
    { name: "Courtyard Wrap Dress", collection: "Hyderabad Monochrome", price: "PKR 34,500", favorites: 156, img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop" },
  ],

  craftStory: {
    tradition: "Ralli Quilting",
    origin: "Sindh & Southern Punjab",
    img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=900&h=600&fit=crop",
    text: "Ralli is one of South Asia's oldest textile traditions — a quilting practice born in the rural communities of Sindh and Balochistan, where women have pieced together fabric remnants into intricate geometric patterns for centuries. Unlike decorative embroidery, Ralli is structural: the quilt itself is the design, built layer by layer using techniques that predate written instruction.\n\nAyesha's interpretation strips the Ralli back to its geometric essence. She works with her network of 14 artisans — women in Hyderabad and Bhit Shah who have practiced this craft for decades — to produce quilt fragments that are then deconstructed and reassembled into contemporary garments. The patterns remain traditional: chessboard, diamond, ladder. But the fabrics are deadstock linen, organic cotton, and raw silk — materials that give the ancient geometry a new, modern weight and drape.",
  },

  reviews: {
    average: 4.8,
    total: 34,
    items: [
      { name: "Sarah K.", country: "United Kingdom", purchase: "Ralli Deconstruction Coat", rating: 5, text: "Extraordinary craftsmanship. The coat arrived beautifully packaged and the attention to detail is unlike anything I've seen. Worth every penny." },
      { name: "Aisha M.", country: "UAE", purchase: "Courtyard Linen Dress", rating: 5, text: "I've been following Ayesha's work since her debut and each collection gets stronger. This dress is architectural yet comfortable — perfect for Dubai's winter season." },
      { name: "Maria L.", country: "Canada", purchase: "Indigo Quilt Fragment Cape", rating: 4, text: "Gorgeous piece — the indigo dye is rich and the construction is impeccable. Took slightly longer to arrive than expected but absolutely worth the wait." },
    ],
  },

  contact: {
    preferred: "Email",
    responseTime: "Within 48 hours",
    categories: ["Wholesale & Stockist Inquiries", "Press & Editorial", "Custom & Bespoke Orders"],
  },

  moreDesigners: [
    { name: "Zara Hameed", specialty: "Mughal Geometry", city: "Lahore", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop" },
    { name: "Bilal Raza", specialty: "Ajrak Block Print", city: "Karachi", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" },
    { name: "Mehreen Aslam", specialty: "Pashmina Weaving", city: "Islamabad", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop" },
    { name: "Noor & Sons", specialty: "Zardozi Embroidery", city: "Lahore", img: "https://images.unsplash.com/photo-1506794789787-5b53e5d1e464?w=400&h=500&fit=crop" },
    { name: "Hira Khan", specialty: "Chikankari", city: "Lahore", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop" },
  ],
};

/* ── Helpers ───────────────────────────────────────────────────── */
function Stars({ rating, size = "w-4 h-4" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${size} ${s <= rating ? "text-gold-500" : "text-noir-700"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function DesignerProfile() {
  const { slug } = useParams();
  const d = designer;
  const [following, setFollowing] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. PROFILE HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Banner */}
        <div className="h-64 md:h-80 overflow-hidden">
          <img src={d.banner} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-noir-950/40 via-noir-950/60 to-noir-950" />
        </div>

        {/* Profile card — overlaps banner */}
        <div className="relative max-w-7xl mx-auto px-6 -mt-24 md:-mt-28 z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            {/* Avatar */}
            <div className="shrink-0 w-36 h-36 md:w-44 md:h-44 overflow-hidden border-4 border-noir-950 rounded-full">
              <img src={d.avatar} alt={d.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 pb-2">
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-noir-900 tracking-tight">{d.name}</h1>
              <p className="mt-2 text-sm text-gold-500 tracking-wide">{d.specialty}</p>
              <p className="mt-1 text-sm text-noir-500">{d.city}, {d.country} — {d.oneLiner}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <button
                onClick={() => setFollowing(!following)}
                className={`btn-primary ${following ? "!bg-noir-800 !text-gold-500 border border-gold-400/30" : ""}`}
              >
                {following ? "Following" : "Follow"}
              </button>
              <a href="#contact" className="btn-outline">Contact</a>
              {/* Socials */}
              <div className="flex gap-2 ml-2">
                {[
                  { key: "instagram", label: "Instagram", icon: "I" },
                  { key: "pinterest", label: "Pinterest", icon: "P" },
                  { key: "linkedin", label: "LinkedIn", icon: "L" },
                ].map((s) => (
                  <a key={s.key} href={d.socials[s.key]} aria-label={s.label} className="w-9 h-9 flex items-center justify-center border border-noir-200 text-noir-500 text-xs hover:border-gold-400/40 hover:text-gold-500 transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10">
          <div className="h-px bg-white/5" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. DESIGNER STATS BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-noir-100 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/5">
            {[
              { value: d.stats.collectionsPublished, label: "Collections" },
              { value: d.stats.piecesSold, label: "Pieces Sold" },
              { value: d.stats.countriesShippedTo, label: "Countries Shipped" },
              { value: `${d.stats.yearsActive} yrs`, label: "Years Active" },
              { value: d.stats.memberSince, label: "Member Since" },
            ].map((stat, i) => (
              <div key={i} className="py-8 px-4 md:px-6 text-center">
                <p className="font-serif text-2xl md:text-3xl text-noir-900 font-medium">{stat.value}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-noir-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. ABOUT THE DESIGNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-10">About the Designer</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Bio */}
            <div className="lg:col-span-7">
              <p className="text-noir-600 leading-[1.85] text-base md:text-lg">{d.about.bio}</p>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5">
              <div className="border border-noir-100 bg-stone-50 divide-y divide-white/5">
                {Object.entries(d.about.info).map(([key, val]) => (
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
          4. LATEST COLLECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">{d.latestCollection.season}</p>
          <h2 className="section-heading mb-4">{d.latestCollection.name}</h2>
          <p className="text-noir-500 max-w-2xl leading-relaxed mb-14">{d.latestCollection.description}</p>

          {/* Horizontal scroll product grid */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
            {d.latestCollection.products.map((p) => (
              <article key={p.id} className="shrink-0 w-72 snap-start group">
                <div className="relative aspect-[3/4] overflow-hidden bg-white">
                  <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-base text-noir-900">{p.name}</h3>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm text-noir-500">{p.price}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="text-[10px] uppercase tracking-[0.2em] text-gold-500 hover:text-gold-300 transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. ALL COLLECTIONS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Body of Work</p>
          <h2 className="section-heading mb-14">All Collections</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {d.allCollections.map((col, i) => (
              <article key={i} className="group relative overflow-hidden aspect-[4/5] cursor-pointer">
                <img src={col.img} alt={col.name} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70 mb-1">{col.season} — {col.pieces} pieces</p>
                  <h3 className="font-serif text-xl text-noir-900 mb-3">{col.name}</h3>
                  <span className="text-xs text-noir-900/0 group-hover:text-gold-500 transition-all duration-300 tracking-wider uppercase">
                    View Collection →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. SIGNATURE PIECES
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Iconic Work</p>
          <h2 className="section-heading mb-14">Signature Pieces</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {d.signaturePieces.map((piece, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={piece.img} alt={piece.name} className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 to-transparent" />
                  {/* Favorite count */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3 py-1.5">
                    <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    <span className="text-xs text-noir-900">{piece.favorites}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-lg text-noir-900">{piece.name}</h3>
                  <p className="text-xs text-noir-500 mt-1">From: {piece.collection}</p>
                  <p className="text-sm text-gold-500/80 mt-1.5">{piece.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. CRAFT STORY
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">{d.craftStory.origin}</p>
          <h2 className="section-heading mb-16">Craft Story — {d.craftStory.tradition}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative overflow-hidden aspect-[3/2]">
              <img src={d.craftStory.img} alt={d.craftStory.tradition} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-6">
              {d.craftStory.text.split("\n\n").map((para, i) => (
                <p key={i} className={`${i > 0 ? "mt-6" : ""} text-noir-600 leading-[1.85] text-base md:text-lg`}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. CUSTOMER REVIEWS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
            <div>
              <p className="section-label mb-4">Collectors Say</p>
              <h2 className="section-heading">Customer Reviews</h2>
            </div>
            {/* Average rating */}
            <div className="flex items-center gap-4">
              <span className="font-serif text-5xl text-noir-900 font-medium">{d.reviews.average}</span>
              <div>
                <Stars rating={Math.round(d.reviews.average)} />
                <p className="text-xs text-noir-500 mt-1">{d.reviews.total} reviews</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {d.reviews.items.map((r, i) => (
              <div key={i} className="border border-noir-100 bg-white p-7">
                <Stars rating={r.rating} />
                <p className="mt-5 text-noir-600 text-sm leading-relaxed">"{r.text}"</p>
                <div className="mt-6 pt-5 border-t border-noir-100">
                  <p className="text-sm text-noir-900">{r.name}</p>
                  <p className="text-xs text-noir-500 mt-0.5">{r.country} — {r.purchase}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. CONTACT & COLLABORATE
      ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 md:py-32 bg-white border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">Get in Touch</p>
          <h2 className="section-heading mb-14">Contact & Collaborate</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Your Name" required className="w-full px-5 py-3.5 bg-stone-50 border border-noir-200 text-noir-900 text-sm placeholder:text-noir-500 focus:outline-none focus:border-gold-400/50 transition-colors" />
                  <input type="email" placeholder="Email Address" required className="w-full px-5 py-3.5 bg-stone-50 border border-noir-200 text-noir-900 text-sm placeholder:text-noir-500 focus:outline-none focus:border-gold-400/50 transition-colors" />
                </div>
                <select className="w-full px-5 py-3.5 bg-stone-50 border border-noir-200 text-noir-500 text-sm focus:outline-none focus:border-gold-400/50 transition-colors">
                  <option>Inquiry Type</option>
                  {d.contact.categories.map((c, i) => (
                    <option key={i}>{c}</option>
                  ))}
                </select>
                <textarea rows={5} placeholder="Your message…" required className="w-full px-5 py-3.5 bg-stone-50 border border-noir-200 text-noir-900 text-sm placeholder:text-noir-500 focus:outline-none focus:border-gold-400/50 transition-colors resize-none" />
                <button type="submit" className="btn-primary">
                  Send Inquiry
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </form>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5">
              <div className="border border-noir-100 bg-stone-50 p-8 space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-2">Preferred Contact</p>
                  <p className="text-sm text-noir-900">{d.contact.preferred}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-2">Response Time</p>
                  <p className="text-sm text-noir-900">{d.contact.responseTime}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500/60 mb-3">Inquiry Categories</p>
                  <ul className="space-y-2">
                    {d.contact.categories.map((c, i) => (
                      <li key={i} className="text-sm text-noir-600">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. MORE DESIGNERS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-noir-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-4">Discover</p>
              <h2 className="section-heading">More Designers</h2>
            </div>
            <a href="/designers" className="hidden md:inline-flex items-center gap-2 text-sm text-gold-500 tracking-wide hover:text-gold-300 transition-colors">
              Browse All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>

          {/* Horizontal scroll */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {d.moreDesigners.map((other, i) => (
              <a
                key={i}
                href={`/${other.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="shrink-0 w-64 snap-start group"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={other.img} alt={other.name} className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/20 to-transparent" />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-base text-noir-900">{other.name}</h3>
                  <p className="text-xs text-noir-500 mt-0.5">{other.specialty} — {other.city}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
