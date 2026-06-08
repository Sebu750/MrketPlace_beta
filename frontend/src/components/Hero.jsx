import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-cream-100 flex items-center overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[100svh]">
        {/* ── Left: Marketplace content ─────────────────────────── */}
        <div className="flex flex-col justify-center py-28 lg:py-0 lg:pr-12 relative z-10">
          {/* Category tag with craft badge */}
          <div className="flex items-center gap-4 mb-6 opacity-0 animate-drift-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-[10px] uppercase tracking-[0.35em] text-crimson-600">
              Spring / Summer 2026
            </p>
            <span className="w-px h-4 bg-gold-300" />
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-noir-500">
              <Sparkles className="w-3 h-3 text-gold-500" />
              15+ Heritage Crafts
            </span>
          </div>

          {/* Headline — marketplace focused */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[1.05] text-noir-900 font-medium opacity-0 animate-drift-up" style={{ animationDelay: "0.4s" }}>
            Discover Pakistan's
            <br />
            <span className="italic text-crimson-600">Finest</span> Fashion
          </h1>

          {/* Subline — explains the marketplace */}
          <p className="mt-6 text-noir-500 text-base sm:text-lg leading-relaxed max-w-lg font-light opacity-0 animate-drift-up" style={{ animationDelay: "0.6s" }}>
            Shop exclusive collections from 120+ emerging designers. Heritage craftsmanship meets contemporary style—curated for the global wardrobe.
          </p>

          {/* Trust metrics */}
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 opacity-0 animate-drift-up" style={{ animationDelay: "0.7s" }}>
            {[
              { value: "120+", label: "Designers" },
              { value: "2,500+", label: "Products" },
              { value: "15+", label: "Heritage Crafts" },
            ].map((metric) => (
              <div key={metric.label} className="flex items-baseline gap-2">
                <span className="font-serif text-xl text-noir-900 font-medium">{metric.value}</span>
                <span className="text-xs text-noir-400 uppercase tracking-wider">{metric.label}</span>
              </div>
            ))}
          </div>

          {/* Search bar — primary marketplace action */}
          <div className="mt-8 max-w-md opacity-0 animate-drift-up" style={{ animationDelay: "0.8s" }}>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search designers, crafts, products..."
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-noir-200 rounded-none text-sm text-noir-900 placeholder:text-noir-400 focus:outline-none focus:border-crimson-400 focus:bg-white transition-all duration-300 font-light"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400 group-focus-within:text-crimson-500 transition-colors" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.2em] text-noir-500 hover:text-crimson-600 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* CTA + secondary link */}
          <div className="mt-6 flex flex-wrap items-center gap-4 opacity-0 animate-drift-up" style={{ animationDelay: "0.9s" }}>
            <Link to="/products" className="btn-primary">
              Shop All Collections
            </Link>
            <Link
              to="/designers"
              className="text-xs uppercase tracking-[0.2em] text-noir-600 hover:text-crimson-600 transition-colors duration-300 border-b border-noir-300 hover:border-crimson-600 pb-0.5"
            >
              Meet Our Designers
            </Link>
          </div>

          {/* Category quick links */}
          <div className="mt-8 flex flex-wrap gap-2 opacity-0 animate-drift-up" style={{ animationDelay: "1.0s" }}>
            {["Women", "Men", "Accessories", "Luxury", "Streetwear", "Heritage Crafts"].map(
              (category) => (
                <Link
                  key={category}
                  to={`/products?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-noir-500 bg-white/60 hover:bg-white hover:text-crimson-600 border border-noir-200/50 hover:border-crimson-300 transition-all duration-300"
                >
                  {category}
                </Link>
              )
            )}
          </div>
        </div>

        {/* ── Gold vertical hairline ────────────────────────────── */}
        <div className="hidden lg:block absolute left-1/2 top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-gold-400 to-transparent z-10" />

        {/* ── Right: Marketplace image collage ───────────────────── */}
        <div className="relative lg:pl-12 opacity-0 animate-fade-in-slow" style={{ animationDelay: "0.3s" }}>
          <div className="relative w-full h-full min-h-[50vh] lg:min-h-0 grid grid-cols-2 gap-2">
            {/* Featured product image */}
            <div className="col-span-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-parchment-200 via-parchment-100 to-cream-200">
                <img
                  src="/assets/images/home-hero-runway.webp"
                  alt="Featured designer collection — Adorzia Spring/Summer 2026"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 via-transparent to-transparent" />

              {/* Designer spotlight card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-5 border border-noir-100">
                <p className="text-[9px] uppercase tracking-[0.3em] text-crimson-600 mb-1">Designer Spotlight</p>
                <h3 className="font-serif text-lg text-noir-900 font-medium">Fatima Noor</h3>
                <p className="text-xs text-noir-500 mt-0.5">Lahore, Pakistan</p>
                <Link
                  to="/designers/fatima-noor"
                  className="inline-flex items-center gap-1.5 mt-3 text-[11px] uppercase tracking-[0.15em] text-noir-700 hover:text-crimson-600 transition-colors group"
                >
                  View Collection
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Secondary product thumbnails */}
            {["heritage-craft-detail", "accessories-look", "streetwear-edit"].map((img, i) => (
              <div key={img} className="relative overflow-hidden aspect-[3/4]">
                <div className="absolute inset-0 bg-parchment-100">
                  <img
                    src={`/assets/images/home-hero-${img}.webp`}
                    alt={`Adorzia marketplace — ${img.replace(/-/g, " ")}`}
                    className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
                {i === 0 && (
                  <div className="absolute top-3 left-3 bg-crimson-600 text-white text-[8px] uppercase tracking-[0.2em] px-2 py-1">
                    Heritage Craft
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured In strip ───────────────────────────────────── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "1.4s" }}>
        <span className="text-[9px] uppercase tracking-[0.3em] text-noir-400 whitespace-nowrap">Featured In</span>
        {["Vogue", "Fashion Network", "Business Recorder", "Dawn Images"].map((pub) => (
          <span key={pub} className="text-[10px] uppercase tracking-[0.2em] text-noir-300 font-light whitespace-nowrap">
            {pub}
          </span>
        ))}
      </div>

      {/* ── Scroll indicator — more actionable ──────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <span className="text-[9px] uppercase tracking-[0.3em] text-noir-400">Explore Collections</span>
        <div className="w-px h-6 bg-gold-300 animate-pulse" />
      </div>
    </section>
  );
}