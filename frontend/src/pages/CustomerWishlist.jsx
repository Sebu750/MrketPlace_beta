import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../store/customerSlice";
import { addToCart } from "../store/cartSlice";

export default function CustomerWishlist() {
  const wishlist = useSelector((s) => s.customer.wishlist);
  const dispatch = useDispatch();

  if (wishlist.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-charcoal-900 mb-2">Your Wishlist is Empty</p>
        <p className="text-sm text-charcoal-400 mb-6">Save pieces you love to revisit them later.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-400">{wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"} saved</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {wishlist.map((item) => (
          <div key={item.productId} className="border border-stone-200 group">
            {/* Image */}
            <Link to={`/pieces/${item.productId}`} className="block relative overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full aspect-[3/4] object-cover bg-stone-100 group-hover:scale-[1.02] transition-transform duration-500" />
              ) : (
                <div className="w-full aspect-[3/4] bg-stone-100 flex items-center justify-center">
                  <span className="text-charcoal-300 text-sm">No image</span>
                </div>
              )}
            </Link>

            {/* Details */}
            <div className="p-4">
              <Link to={`/pieces/${item.productId}`}>
                <p className="text-sm text-charcoal-900 group-hover:text-bronze-600 transition-colors truncate">{item.name}</p>
              </Link>
              {item.designer && (
                <p className="text-[11px] text-charcoal-400 mt-0.5">{item.designer}</p>
              )}
              <p className="text-sm text-charcoal-900 mt-2">
                {typeof item.price === "string" ? item.price : `PKR ${item.price?.toLocaleString?.("en-PK") || item.price}`}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => dispatch(addToCart({
                    product: { id: item.productId, name: item.name, price: item.price, priceRaw: item.priceRaw, image: item.image, designer: item.designer },
                    size: item.size || "M",
                    color: item.color || "Default",
                  }))}
                  className="flex-1 px-3 py-2 text-[10px] uppercase tracking-[0.15em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors text-center"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(item.productId))}
                  className="px-3 py-2 text-[10px] uppercase tracking-[0.15em] border border-stone-300 text-charcoal-500 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
