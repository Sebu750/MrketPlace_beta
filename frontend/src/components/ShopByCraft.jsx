import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const crafts = [
  { name: "Ajrak", region: "Sindh", image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { name: "Phulkari", region: "Punjab", image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { name: "Khaddar", region: "Punjab & KPK", image: "/assets/images/khaddar-modern-suit-adorzia.webp" },
  { name: "Pashmina", region: "Kashmir", image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { name: "Block Print", region: "Sindh & Punjab", image: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  { name: "Mirror Work", region: "Balochistan & Sindh", image: "/assets/images/mirror-rebel-tee-adorzia.webp" },
];

export default function ShopByCraft() {
  const ref = useReveal();

  return (
    <section className="bg-cream-50 py-20 md:py-28">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="mb-12 max-w-lg">
          <p className="section-label mb-3">Explore by Tradition</p>
          <h2 className="font-serif text-3xl md:text-4xl text-noir-900 font-medium">
            Dressed in Heritage.
          </h2>
          <p className="mt-4 text-noir-500 text-sm leading-relaxed">
            Each craft tradition carries centuries of knowledge, community, and identity.
            Shop by the art form that speaks to you.
          </p>
          <div className="mt-4 w-16 h-px bg-gold-300" />
        </div>

        {/* 6-tile grid: 3 cols on desktop, 2 on tablet */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 stagger-children">
          {crafts.map((c) => (
            <Link key={c.name} to={`/products?craft=${c.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="reveal group relative aspect-[3/4] overflow-hidden bg-parchment-100 border border-transparent transition-all duration-500 hover:border-gold-400">
              {/* Image */}
              <img src={c.image} alt={c.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-95 group-hover:scale-[1.04]" />
              {/* Warm overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-noir-900/60 via-noir-900/10 to-transparent" />
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="font-serif text-xl md:text-2xl text-white font-medium">{c.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mt-1">{c.region}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
