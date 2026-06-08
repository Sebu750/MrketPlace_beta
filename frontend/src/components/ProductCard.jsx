import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [wishlist, setWishlist] = useState(false);

  return (
    <div className="group relative">
      {/* Image */}
      <Link to={`/pieces/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
          />

          {/* Tag */}
          {product.tag && (
            <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-white/90 backdrop-blur-sm text-noir-900 px-2 py-1">
              {product.tag}
            </span>
          )}

          {/* Wishlist heart */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlist(!wishlist); }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-noir-200 hover:border-noir-400 transition-colors"
          >
            <svg className={`w-4 h-4 ${wishlist ? "text-gold-500" : "text-noir-400"}`} fill={wishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick add on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full bg-gold-400 text-noir-950 text-xs uppercase tracking-wider py-2.5 hover:bg-gold-300 transition-colors">
              Quick Add
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-3 pb-1">
        <Link to={`/pieces/${product.id}`}>
          <h3 className="font-serif text-sm text-noir-900 group-hover:text-gold-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-noir-500 mt-0.5">{product.designer}</p>
        <p className="text-sm text-noir-900 mt-2">{product.price}</p>
      </div>
    </div>
  );
}
