import { Link } from "react-router-dom";

/* ════════════════════════════════════════════════════════════════
   MOCK DATA — Pakistan's living craft heritage
════════════════════════════════════════════════════════════════ */
const crafts = [
  {
    slug: "chikankari",
    name: "Chikankari",
    region: "Lucknow · Practiced in Lahore",
    era: "Mughal Period, 16th Century",
    tagline: "Shadow-work embroidery — white thread on white cloth, visible only by the shadow it casts.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=600&fit=crop",
    designers: 4,
    products: 12,
  },
  {
    slug: "ajrak",
    name: "Ajrak",
    region: "Bhit Shah, Sindh",
    era: "Indus Valley, 3000+ Years",
    tagline: "Resist-dyed block printing — 14 stages of stamping, dyeing, and washing in indigo and madder root.",
    img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=600&fit=crop",
    designers: 3,
    products: 8,
  },
  {
    slug: "sindhi-mirror-work",
    name: "Sindhi Mirror Work",
    region: "Thar & Southern Sindh",
    era: "Centuries-old, Pre-colonial",
    tagline: "Small mirrors stitched into fabric with decorative thread patterns — originally protective talismans.",
    img: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop",
    designers: 2,
    products: 6,
  },
  {
    slug: "zardozi",
    name: "Zardozi",
    region: "Lahore & Multan",
    era: "Mughal Imperial Courts",
    tagline: "Gold and silver thread embroidery — the most labour-intensive textile technique in South Asia.",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
    designers: 3,
    products: 9,
  },
  {
    slug: "handloom",
    name: "Handloom",
    region: "Punjab & KPK",
    era: "Millennia-old, Indus Tradition",
    tagline: "Hand-operated loom weaving — producing Khaddar, Pashmina, and textured cotton with no electricity.",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop",
    designers: 5,
    products: 14,
  },
  {
    slug: "block-printing",
    name: "Block Printing",
    region: "Punjab & Sindh",
    era: "300+ Years, Mughal Influence",
    tagline: "Hand-carved wooden blocks stamped onto fabric — each impression slightly unique, like handwriting.",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=600&fit=crop",
    designers: 4,
    products: 11,
  },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CraftsArchive() {
  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-12 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal-900 tracking-tight">Crafts Archive</h1>
          <p className="mt-4 text-charcoal-400 max-w-2xl leading-relaxed">
            Pakistan's textile heritage stretches back millennia. This archive documents the living craft traditions
            that our designers work with — each one sustained by artisans who have practiced these techniques for generations.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. CRAFT GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crafts.map((craft) => (
              <Link key={craft.slug} to={`/crafts/${craft.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={craft.img} alt={craft.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-90 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">{craft.era}</p>
                    <h2 className="font-serif text-2xl text-white group-hover:text-bronze-400 transition-colors duration-300">
                      {craft.name}
                    </h2>
                    <p className="text-xs text-ivory-300 mt-1">{craft.region}</p>
                  </div>
                </div>
                <div className="mt-5 px-1">
                  <p className="text-sm text-charcoal-400 italic leading-relaxed">{craft.tagline}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-300">{craft.designers} designers</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-300">{craft.products} products</span>
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-bronze-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. MISSION STATEMENT
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-6">Why This Matters</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium leading-tight">
            Preserving What Mass Production
            <br />
            <span className="italic text-bronze-500">Cannot Replicate</span>
          </h2>
          <p className="mt-8 text-charcoal-400 leading-relaxed max-w-xl mx-auto">
            Every craft tradition in this archive is a living practice — sustained by specific artisans in specific communities.
            When a designer uses these techniques, they're not referencing heritage — they're funding its continuation.
            This is what makes Adorzia different: provenance, not appropriation.
          </p>
        </div>
      </section>
    </div>
  );
}
