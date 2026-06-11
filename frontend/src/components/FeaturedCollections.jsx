const collections = [
  {
    id: 1,
    designer: "Zara Hameed",
    title: "Mughal Geometry , FW26",
    price: "PKR 48,000",
    tag: "New Arrival",
    span: "md:col-span-2 md:row-span-2",
    img: "/assets/images/ajrak-architect-coat-adorzia1.webp",
  },
  {
    id: 2,
    designer: "Aliya Sadiq",
    title: "Sindhi Indigo Cape",
    price: "PKR 32,500",
    tag: "Limited",
    span: "",
    img: "/assets/images/phulkari-reborn-blazer-adorzia.webp",
  },
  {
    id: 3,
    designer: "Noor & Sons",
    title: "Heritage Rilli Coat",
    price: "PKR 56,000",
    tag: "Exclusive",
    span: "",
    img: "/assets/images/khaddar-modern-suit-adorzia.webp",
  },
  {
    id: 4,
    designer: "Hira Khan",
    title: "Pashmina Edit , Ivory",
    price: "PKR 72,000",
    tag: "Bestseller",
    span: "md:col-span-2",
    img: "/assets/images/pashmina-wrap-dress-adorzia.webp",
  },
  {
    id: 5,
    designer: "Studio Kamal",
    title: "Block Print Kurta Set",
    price: "PKR 28,000",
    tag: "",
    span: "",
    img: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp",
  },
  {
    id: 6,
    designer: "Fatima Ahmad",
    title: "Zardozi Evening Gown",
    price: "PKR 125,000",
    tag: "Couture",
    span: "",
    img: "/assets/images/mirror-rebel-tee-adorzia.webp",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="section-label mb-4">Curated Selection</p>
            <h2 className="section-heading">Featured Collections</h2>
          </div>
          <a
            href="/collections"
            className="hidden md:inline-flex items-center gap-2 text-sm text-charcoal-400 tracking-wide hover:text-charcoal-900 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px] md:auto-rows-[300px]">
          {collections.map((item) => (
            <article
              key={item.id}
              className={`group relative overflow-hidden bg-stone-100 cursor-pointer ${item.span}`}
            >
              {/* Image */}
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Tag */}
              {item.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] uppercase tracking-[0.2em] bg-white text-charcoal-900 font-medium">
                  {item.tag}
                </span>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-white/80 mb-1">
                  {item.designer}
                </p>
                <h3 className="font-serif text-lg text-white leading-snug">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-white/80">{item.price}</span>
                  <span className="text-xs text-white/0 group-hover:text-white transition-all duration-300 tracking-wider uppercase">
                    View →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
