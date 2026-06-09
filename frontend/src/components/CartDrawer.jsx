import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  closeCart,
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartIsOpen,
  selectCartCount,
  selectCartSubtotal,
} from "../store/cartSlice";

/* ── Tabler-style icons ─────────────────────────────────────────────── */
const IconX = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconMinus = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}>
    <path d="M5 12h14" />
  </svg>
);
const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
);
const IconArrowRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ── Format price ──────────────────────────────────────────────────── */
const formatPKR = (amount) =>
  `PKR ${amount.toLocaleString("en-PK")}`;

/* ───────────────────────────────────────────────────────────────────── */
export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCartIsOpen);
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") dispatch(closeCart()); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[998] bg-charcoal-950/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch(closeCart())}
      />

      {/* ── Drawer ─────────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[999] w-full max-w-[460px] bg-white flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-stone-200">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-xl text-charcoal-900 font-light tracking-wide">Shopping Bag</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-1 text-charcoal-400 hover:text-charcoal-900 transition-colors duration-300"
            aria-label="Close cart"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────── */}
        {items.length === 0 ? (
          /* ── Empty state ──────────────────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            {/* Empty bag icon */}
            <div className="w-20 h-20 flex items-center justify-center border border-stone-200 mb-6">
              <svg className="w-9 h-9 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1.5 12H7.5L6 8z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </div>
            <p className="font-serif text-2xl text-charcoal-900 font-light mb-2">Your bag is empty</p>
            <p className="text-sm text-charcoal-400 leading-relaxed max-w-xs mb-8">
              Discover independent designers and add extraordinary pieces to your collection.
            </p>
            <Link
              to="/shop"
              onClick={() => dispatch(closeCart())}
              className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-7 py-3 text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors duration-500"
            >
              Explore the Shop
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-10 pt-8 border-t border-stone-100 w-full max-w-xs">
              <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-300 mb-3">Begin with</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "New Arrivals", to: "/shop" },
                  { label: "Collections", to: "/collections" },
                  { label: "Designers", to: "/designers" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => dispatch(closeCart())}
                    className="flex items-center justify-between py-2 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors group"
                  >
                    <span>{l.label}</span>
                    <IconArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-charcoal-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Items list ──────────────────────────────────────────── */
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-stone-100">
              {items.map((item) => (
                <li key={item.id} className="px-7 py-6 flex gap-5 group">
                  {/* Image */}
                  <div className="shrink-0 w-[90px] h-[120px] bg-stone-50 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-stone-300">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Designer */}
                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-0.5 truncate">
                      {item.designer}
                    </p>
                    {/* Name */}
                    <h3 className="font-serif text-base text-charcoal-900 leading-snug truncate">
                      {item.name}
                    </h3>
                    {/* Collection */}
                    {item.collection && (
                      <p className="text-xs text-charcoal-400 mt-0.5 truncate italic">{item.collection}</p>
                    )}
                    {/* Size + Color */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">
                        Size: <span className="text-charcoal-600">{item.size || "—"}</span>
                      </span>
                      <span className="text-stone-300">|</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">
                        Colour: <span className="text-charcoal-600">{item.color || "—"}</span>
                      </span>
                    </div>

                    {/* Quantity + price row */}
                    <div className="mt-4 flex items-end justify-between gap-3">
                      {/* Quantity control */}
                      <div className="flex items-center border border-stone-200 bg-white">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity - 1 }))
                          }
                          className="p-1.5 text-charcoal-400 hover:text-charcoal-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <IconMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm text-charcoal-900 min-w-[2rem] text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))
                          }
                          className="p-1.5 text-charcoal-400 hover:text-charcoal-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <IconPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-serif text-base text-charcoal-900 tabular-nums">
                        {formatPKR(item.priceRaw * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="self-start opacity-0 group-hover:opacity-100 p-1 text-stone-300 hover:text-charcoal-500 transition-all duration-300"
                    aria-label={`Remove ${item.name} from bag`}
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Footer (only when items exist) ────────────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 bg-white">
            {/* Subtotal */}
            <div className="px-7 py-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400">Subtotal</span>
                <span className="font-serif text-xl text-charcoal-900 tabular-nums">
                  {formatPKR(subtotal)}
                </span>
              </div>
              <p className="text-xs text-charcoal-400">
                Shipping & taxes calculated at checkout
              </p>
            </div>

            {/* CTAs */}
            <div className="px-7 pb-7 space-y-2.5">
              <Link
                to="/checkout"
                onClick={() => dispatch(closeCart())}
                className="w-full flex items-center justify-center gap-2 bg-charcoal-900 text-white py-3.5 text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors duration-500"
              >
                Proceed to Checkout
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cart"
                onClick={() => dispatch(closeCart())}
                className="w-full flex items-center justify-center border border-stone-200 text-charcoal-500 py-3.5 text-xs uppercase tracking-[0.18em] hover:border-charcoal-400 hover:text-charcoal-900 transition-colors duration-500"
              >
                View Full Bag
              </Link>
            </div>

            {/* Trust strip */}
            <div className="px-7 pb-5 flex items-center justify-center gap-5">
              {["Secure Checkout", "Free Returns", "Worldwide Delivery"].map((t) => (
                <span key={t} className="text-[9px] uppercase tracking-[0.2em] text-charcoal-300">{t}</span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
