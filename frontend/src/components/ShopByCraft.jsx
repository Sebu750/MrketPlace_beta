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
    <section className="bg-white py-24 md:py-32">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 max-w-lg">
          <p className="section-label mb-4">Heritage Traditions</p>
          <h2 className="font-display text-display-sm md:text-display text-charcoal-900">
            Craft as
            <br />
            <span className="italic font-serif font-light">Identity</span>
          </h2>
          <p className="mt-6 text-charcoal-500 text-sm leading-[1.85] font-light">
            Each craft tradition carries centuries of knowledge, community, and cultural identity.
            Explore by the art form that speaks to you.
          </p>
        </div>

        {/* 6-tile grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {crafts.map((c) => (
            <Link key={c.name} to={`/crafts/${c.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="reveal group relative aspect-[4/5] overflow-hidden bg-stone-100">
              {/* Image */}
              <img src={c.image} alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]" />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/10 to-transparent" />
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl text-white font-light">{c.name}</h3>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/60 mt-1.5 font-light">{c.region}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
