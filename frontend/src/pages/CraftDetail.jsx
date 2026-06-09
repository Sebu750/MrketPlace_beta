import { useParams, Link } from "react-router-dom";

/* ════════════════════════════════════════════════════════════════
   MOCK DATA — 6 craft traditions
════════════════════════════════════════════════════════════════ */
const craftData = {
  chikankari: {
    name: "Chikankari",
    region: "Lahore (originating from Lucknow tradition)",
    era: "Mughal Period, 16th Century",
    heroImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1600&h=700&fit=crop",
    story: "Chikankari is shadow-work embroidery — white thread stitched on white cloth, visible only by the shadow it casts. Originally practiced in the royal courts of Lucknow, the tradition migrated to Lahore after Partition, where a community of artisans kept it alive. Today, Pakistani Chikankari has developed its own character: bolder than its Lucknow counterpart, with larger motifs and a preference for structured garments over flowing drapes. The technique involves over 30 distinct stitch types — from the delicate 'tepchi' running stitch to the raised 'murri' knot — each requiring years of practice to master.",
    history: "Chikankari's roots trace to the Mughal imperial workshops of the 16th century, where it was developed as a summer-weight textile for royal garments. The technique spread across northern India through court patronage, surviving the decline of Mughal power through the dedication of artisan families. In Pakistan, Chikankari found new life in Lahore's textile districts, where it evolved from a purely decorative technique into a structural design element — used not just as embellishment but as the primary language of a garment.",
    designers: [
      { name: "Mehreen Aslam", slug: "mehreen-aslam", city: "Islamabad", specialty: "Chikankari cotton shirting" },
      { name: "Fatima Asad", slug: "fatima-asad", city: "Lahore", specialty: "Chikankari evening wear" },
      { name: "Aleeza Noor", slug: "aleeza-noor", city: "Lahore", specialty: "Contemporary Chikankari" },
      { name: "Hira Khan", slug: "hira-khan", city: "Lahore", specialty: "Chikankari accessories" },
    ],
    products: [
      { name: "Chikankari Cotton Shirt", designer: "Mehreen Aslam", price: "PKR 16,500", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
      { name: "Shadow-work Kurta", designer: "Aleeza Noor", price: "PKR 22,000", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
      { name: "White-on-White Cape", designer: "Fatima Asad", price: "PKR 34,000", img: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
    ],
    collections: [
      { name: "Thar Bloom", designer: "Aleeza Noor", season: "SS26", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
      { name: "Lahore Noir", designer: "Fatima Asad", season: "FW25", img: "/assets/images/ajrak-architect-coat-adorzia2.webp" },
    ],
  },
  ajrak: {
    name: "Ajrak",
    region: "Bhit Shah, Sindh",
    era: "Indus Valley Civilisation, 3000+ Years",
    heroImg: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1600&h=700&fit=crop",
    story: "Ajrak is a resist-dyed block printing tradition that predates written history. Found on fabric fragments in Mohenjo-daro, the technique has survived virtually unchanged for over three millennia. The process involves 14 stages of stamping, dyeing, and washing — using natural indigo for blue and madder root for red. Each piece passes through the hands of master printers in Bhit Shah, Sindh, who have practiced this craft for generations. The geometric and floral patterns of Ajrak carry specific meanings: the 'star' motif represents aspiration, the 'trefoil' symbolises the union of sun, water, and earth.",
    history: "Ajrak's history is the history of textile itself. Archaeological evidence from the Indus Valley Civilisation shows fabric fragments with block-printed patterns identical to those produced today in Bhit Shah. The craft survived the rise and fall of empires, colonial suppression of indigenous textile industries, and the pressures of mechanised production. In Pakistan, Ajrak has become a symbol of Sindhi cultural identity — worn at weddings, given as gifts of honour, and increasingly used by contemporary designers to bridge heritage and modernity.",
    designers: [
      { name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", city: "Lahore", specialty: "Ajrak outerwear" },
      { name: "Bilal Raza", slug: "bilal-raza", city: "Karachi", specialty: "Ajrak menswear" },
      { name: "Hamza Tariq", slug: "hamza-tariq", city: "Lahore", specialty: "Ajrak accessories" },
    ],
    products: [
      { name: "Ajrak Architect Coat", designer: "Ayesha Siddiqui", price: "PKR 48,000", img: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
      { name: "Indigo Linen Kurta", designer: "Bilal Raza", price: "PKR 22,000", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
      { name: "Ajrak Print Scarf", designer: "Hamza Tariq", price: "PKR 8,500", img: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
    ],
    collections: [
      { name: "Geometry of Home", designer: "Ayesha Siddiqui", season: "SS26", img: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
      { name: "Sindhi Indigo Edit", designer: "Bilal Raza", season: "SS26", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
    ],
  },
  "sindhi-mirror-work": {
    name: "Sindhi Mirror Work",
    region: "Thar & Southern Sindh",
    era: "Centuries-old, Pre-colonial",
    heroImg: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=700&fit=crop",
    story: "Sindhi Mirror Work involves stitching small mirrors into fabric using decorative thread patterns that radiate outward like sunbursts. Originally, these mirrors served as protective talismans — reflecting the evil eye away from the wearer. Today, the technique has evolved into a purely decorative art form, with contemporary designers using mirrors as structural elements in outerwear and accessories. The stitching around each mirror follows specific geometric patterns — each carrying a name passed down through generations of Thari women artisans.",
    history: "Mirror work in Sindh predates colonial influence and has roots in the region's ancient trade connections with Central Asia and the Middle East. The mirrors themselves were historically imported from Venice and Persia; today they are produced locally. The craft was traditionally practiced by women in rural Sindh, who would spend months creating a single piece — often as part of a dowry. Contemporary Pakistani designers have brought this craft into global fashion while maintaining the hand-stitched techniques that define it.",
    designers: [
      { name: "Noor & Sons", slug: "noor-and-sons", city: "Lahore", specialty: "Mirror work outerwear" },
      { name: "Zara Hameed", slug: "zara-hameed", city: "Islamabad", specialty: "Mirror work bridal" },
    ],
    products: [
      { name: "Mirrorwork Bomber Jacket", designer: "Noor & Sons", price: "PKR 44,000", img: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
      { name: "Mirror-embroidered Clutch", designer: "Zara Hameed", price: "PKR 18,000", img: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
    ],
    collections: [
      { name: "Desert Light", designer: "Noor & Sons", season: "FW25", img: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
    ],
  },
  zardozi: {
    name: "Zardozi",
    region: "Lahore & Multan",
    era: "Mughal Imperial Courts",
    heroImg: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600&h=700&fit=crop",
    story: "Zardozi is gold and silver thread embroidery — the most labour-intensive textile technique in South Asia. A single square inch of fine Zardozi can take a master artisan up to three days to complete. The technique involves couching metallic threads onto fabric using a specialised hook called an 'ari', creating raised, three-dimensional patterns that catch light from every angle. Historically reserved for royal garments and temple textiles, Zardozi in Pakistan has evolved into a contemporary luxury technique used in both bridal couture and understated ready-to-wear.",
    history: "Zardozi entered South Asia through the Mughal imperial courts, where it was used exclusively for the emperor's garments and court furnishings. The technique was so valued that artisans were granted land and patronage in exchange for their work. After the decline of Mughal patronage, Zardozi survived through the wedding industry — where it remains the most prestigious embellishment technique. In contemporary Pakistani fashion, designers are reinterpreting Zardozi for everyday luxury: using it sparingly as a structural accent rather than full-surface coverage.",
    designers: [
      { name: "Fatima Asad", slug: "fatima-asad", city: "Lahore", specialty: "Zardozi evening wear" },
      { name: "Zara Hameed", slug: "zara-hameed", city: "Islamabad", specialty: "Zardozi bridal" },
      { name: "Noor & Sons", slug: "noor-and-sons", city: "Lahore", specialty: "Heritage Zardozi" },
    ],
    products: [
      { name: "Zardozi Evening Cape", designer: "Fatima Asad", price: "PKR 62,000", img: "/assets/images/ajrak-architect-coat-adorzia2.webp" },
      { name: "Gold-thread Dupatta", designer: "Zara Hameed", price: "PKR 38,000", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
    ],
    collections: [
      { name: "Lahore Noir", designer: "Fatima Asad", season: "FW25", img: "/assets/images/ajrak-architect-coat-adorzia2.webp" },
    ],
  },
  handloom: {
    name: "Handloom",
    region: "Punjab & KPK",
    era: "Millennia-old, Indus Tradition",
    heroImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&h=700&fit=crop",
    story: "Handloom weaving in Pakistan is a practice that stretches back to the Indus Valley Civilisation. Using hand-operated looms with no electricity, weavers produce Khaddar (hand-spun cotton), Pashmina, and textured fabrics with a depth and irregularity that machine weaving cannot replicate. Each metre of handloom fabric carries the rhythm of the weaver — slight variations in tension and density that make every piece unique. In Pakistan, handloom weaving supports entire communities in rural Punjab and KPK, where weavers have practiced the craft for generations.",
    history: "The Indus Valley was one of the world's earliest centres of textile production — cotton fabric fragments from Mohenjo-daro show evidence of sophisticated weaving techniques. Handloom weaving survived colonial-era suppression of indigenous industries and the post-independence push towards mechanised production. Today, Pakistan's handloom sector is experiencing a renaissance as designers recognise the irreplaceable quality of hand-woven textiles: the drape, the weight, and the tactile warmth that machine fabric simply cannot produce.",
    designers: [
      { name: "Hira Khan", slug: "hira-khan", city: "Lahore", specialty: "Khaddar garments" },
      { name: "Mehreen Aslam", slug: "mehreen-aslam", city: "Islamabad", specialty: "Pashmina weaving" },
      { name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", city: "Lahore", specialty: "Handwoven outerwear" },
      { name: "Bilal Raza", slug: "bilal-raza", city: "Karachi", specialty: "Handloom cotton" },
      { name: "Aleeza Noor", slug: "aleeza-noor", city: "Lahore", specialty: "Textured handloom" },
    ],
    products: [
      { name: "Pashmina Wrap Dress", designer: "Hira Khan", price: "PKR 29,500", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
      { name: "Handloom Silk Dupatta", designer: "Aleeza Noor", price: "PKR 12,000", img: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
      { name: "Khaddar Modern Suit", designer: "Bilal Raza", price: "PKR 36,000", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
    ],
    collections: [
      { name: "Chitral Weave Edit", designer: "Mehreen Aslam", season: "SS25", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
      { name: "Thar Bloom", designer: "Aleeza Noor", season: "SS26", img: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
    ],
  },
  "block-printing": {
    name: "Block Printing",
    region: "Punjab & Sindh",
    era: "300+ Years, Mughal Influence",
    heroImg: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&h=700&fit=crop",
    story: "Block Printing is the art of stamping hand-carved wooden blocks onto fabric — each impression slightly unique, like handwriting. The blocks are carved from seasoned sheesham wood using specialised chisels, with the most intricate patterns requiring blocks as small as a thumbnail. The printer dips the block in natural dye — indigo, madder root, turmeric, or pomegranate — and stamps it onto fabric with precise, rhythmic force. A single metre of fine block-printed fabric can require thousands of individual impressions, each one aligned by eye and experience.",
    history: "Block printing arrived in South Asia through Mughal trade routes, where it merged with existing textile traditions to create something uniquely subcontinental. The craft flourished under Mughal patronage, with royal workshops producing fabrics for the court. In Pakistan, block printing has survived in Punjab and Sindh, where artisan families continue to carve blocks and mix dyes using recipes passed down for generations. Contemporary designers are now using block printing not as a decorative technique but as a primary design language — building entire collections around the rhythm and repetition of hand-stamped patterns.",
    designers: [
      { name: "Bilal Raza", slug: "bilal-raza", city: "Karachi", specialty: "Ajrak & block print" },
      { name: "Ayesha Siddiqui", slug: "ayesha-siddiqui", city: "Lahore", specialty: "Block print outerwear" },
      { name: "Hamza Tariq", slug: "hamza-tariq", city: "Lahore", specialty: "Block print accessories" },
      { name: "Aleeza Noor", slug: "aleeza-noor", city: "Lahore", specialty: "Block print pret" },
    ],
    products: [
      { name: "Block Print Scarf", designer: "Hamza Tariq", price: "PKR 8,500", img: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
      { name: "Courtyard Linen Dress", designer: "Ayesha Siddiqui", price: "PKR 29,000", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
      { name: "Indigo Linen Kurta", designer: "Bilal Raza", price: "PKR 22,000", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
    ],
    collections: [
      { name: "Geometry of Home", designer: "Ayesha Siddiqui", season: "SS26", img: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
      { name: "Sindhi Indigo Edit", designer: "Bilal Raza", season: "SS26", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
    ],
  },
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CraftDetail() {
  const { slug } = useParams();
  const craft = craftData[slug];

  if (!craft) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="font-serif text-2xl text-charcoal-900 mb-4">Craft not found</p>
          <Link to="/crafts" className="text-sm text-bronze-500 hover:text-bronze-400">← Back to Crafts Archive</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={craft.heroImg} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/crafts" className="text-xs text-bronze-500 hover:text-bronze-400 tracking-wider uppercase">← Crafts Archive</Link>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">{craft.era}</p>
          <h1 className="font-serif text-5xl md:text-7xl font-medium text-charcoal-900 leading-[0.92] tracking-tight">{craft.name}</h1>
          <p className="mt-4 text-sm text-charcoal-400">{craft.region}</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. CRAFT STORY — magazine feature style
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Craft</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Craft Story</h2>
          <div className="max-w-3xl">
            <p className="text-charcoal-500 leading-[1.9] text-base md:text-lg">{craft.story}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. HISTORICAL BACKGROUND
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Historical Background</h2>
          <div className="max-w-3xl">
            <p className="text-charcoal-500 leading-[1.9] text-base md:text-lg">{craft.history}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. DESIGNERS USING THIS CRAFT
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Practitioners</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Designers Using {craft.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {craft.designers.map((d, i) => (
              <Link key={i} to={`/${d.slug}`} className="group block border border-stone-100 bg-white p-6 hover:border-bronze-300/50 transition-colors duration-300">
                <h3 className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{d.name}</h3>
                <p className="text-xs text-charcoal-400 mt-1">{d.city}</p>
                <p className="text-xs text-bronze-500/70 mt-3 uppercase tracking-wider">{d.specialty}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. PRODUCTS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Shop</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {craft.products.map((p, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-white">
                  <img src={p.img} alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-bronze-500/60 mb-1">{p.designer}</p>
                  <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.name}</h3>
                  <p className="text-sm text-charcoal-400 mt-1">{p.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. COLLECTIONS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Explore</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {craft.collections.map((c, i) => (
              <Link key={i} to={`/collections/${c.name.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={c.img} alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">{c.season}</p>
                    <h3 className="font-serif text-lg text-white group-hover:text-bronze-400 transition-colors duration-300">{c.name}</h3>
                    <p className="text-xs text-ivory-300 mt-1">{c.designer}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. BACK TO ARCHIVE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/crafts" className="inline-flex items-center gap-2 text-sm text-bronze-500 tracking-wider hover:text-bronze-400 transition-colors uppercase">
            ← Back to Crafts Archive
          </Link>
        </div>
      </section>
    </div>
  );
}
