import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProduct } from "../store/productsSlice";
import { addToCart } from "../store/cartSlice";

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: p, loading } = useSelector((s) => s.products.public);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [qty, setQty] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [addedToBag, setAddedToBag] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  /* Fetch product on mount */
  useEffect(() => {
    if (id) dispatch(fetchPublicProduct(id));
  }, [dispatch, id]);

  /* Set default color when product loads */
  useEffect(() => {
    if (p?.colors?.length > 0) setSelectedColor(p.colors[0]);
  }, [p]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-charcoal-400 text-sm">Loading piece…</p>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-charcoal-900 mb-3">Piece not found</p>
          <Link to="/pieces" className="text-xs uppercase tracking-wider text-bronze-500 hover:text-bronze-400">Browse All Pieces →</Link>
        </div>
      </div>
    );
  }

  const fmtPrice = (price) => (price ? `PKR ${Number(price).toLocaleString("en-PK")}` : "");
  const gallery = p.images?.length > 0 ? p.images : ["/assets/images/placeholder.webp"];
  const galleryLabels = p.images?.map((_, i) => `View ${i + 1}`) || ["Main View"];

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    dispatch(
      addToCart({
        product: { ...p, id: p._id || p.id, slug: p.slug },
        size: selectedSize,
        color: selectedColor,
        quantity: qty,
      })
    );
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2200);
  };

  const handleZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. GALLERY + 2. PRODUCT INFORMATION (sticky layout)
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal-300 mb-8">
            {p.designer && (
              <>
                <Link to={`/${p.designer.slug || p.designer._id}`} className="hover:text-bronze-500 transition-colors">{p.designer.name || p.designer}</Link>
                <span className="text-stone-300">/</span>
              </>
            )}
            {p.collection && (
              <>
                <Link to={`/collections/${p.collection.slug || p.collection._id}`} className="hover:text-bronze-500 transition-colors">{p.collection.name || p.collection}</Link>
                <span className="text-stone-300">/</span>
              </>
            )}
            <span className="text-charcoal-400">{p.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            {/* ── Gallery ── */}
            <div className="lg:col-span-7">
              {/* Primary image / video */}
              <div
                className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-4 cursor-crosshair"
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                onMouseMove={handleZoom}
              >
                {!showVideo ? (
                  <img
                    src={gallery[activeImg]}
                    alt={`${p.name} , ${galleryLabels[activeImg]}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                    style={zoomed ? { transform: "scale(1.8)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal-950">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-bronze-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-ivory-300 text-sm">Product video , studio walkthrough</p>
                    </div>
                  </div>
                )}
                {/* Label */}
                <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-charcoal-400 bg-white/70 backdrop-blur-sm px-3 py-1">
                  {showVideo ? "Video" : galleryLabels[activeImg]}
                </span>
                {zoomed && !showVideo && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.2em] text-bronze-500 bg-charcoal-950/60 backdrop-blur-sm px-3 py-1">
                    1.8× Zoom
                  </span>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImg(i); setShowVideo(false); }}
                    className={`shrink-0 w-20 h-24 overflow-hidden border transition-colors ${
                      activeImg === i && !showVideo ? "border-bronze-400" : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <img src={img} alt={galleryLabels[i]} className="w-full h-full object-cover opacity-80" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Info Panel (sticky) ── */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <span className="text-[11px] uppercase tracking-[0.2em] text-bronze-500/70">{p.craft || p.craftTradition}</span>

                <h1 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl text-charcoal-900 leading-tight">
                  {p.name}
                </h1>

                <p className="mt-3 text-charcoal-400 text-sm">{p.description?.substring(0, 120) || p.oneLiner || ""}</p>

                {/* Price */}
                <p className="mt-6 font-serif text-2xl text-charcoal-900">{fmtPrice(p.price)}</p>
                <p className="text-xs text-charcoal-400 mt-1">Inclusive of all taxes · Made to order</p>

                <div className="h-px bg-bronze-200/40 my-8" />

                {/* Color */}
                {p.colors && p.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-3">Colour</p>
                  <div className="flex flex-wrap gap-2">
                    {p.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-4 py-2 text-xs border transition-all duration-200 ${
                          selectedColor === c
                            ? "bg-charcoal-900 text-white border-charcoal-900"
                            : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {/* Size */}
                {p.sizes && p.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400">Size</p>
                    {sizeError && (
                      <span className="text-[10px] text-red-600 tracking-wide animate-pulse">Select a size</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSelectedSize(s); setSizeError(false); }}
                        className={`w-12 h-12 text-sm border transition-all duration-200 ${
                          selectedSize === s
                            ? "bg-bronze-300 text-charcoal-950 border-bronze-400"
                            : sizeError
                            ? "bg-white text-charcoal-500 border-red-300 hover:border-red-400"
                            : "bg-white text-charcoal-500 border-stone-200 hover:border-bronze-400/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {/* Quantity */}
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-3">Quantity</p>
                  <div className="flex items-center border border-stone-200 w-fit bg-white">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-charcoal-400 hover:text-charcoal-900">−</button>
                    <span className="px-4 py-2 text-charcoal-900 text-sm min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-charcoal-400 hover:text-charcoal-900">+</button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToBag}
                    disabled={addedToBag}
                    className={`w-full py-3 text-xs uppercase tracking-[0.18em] transition-all inline-flex items-center justify-center gap-2 ${
                      addedToBag
                        ? "bg-bronze-400 text-white"
                        : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                    }`}
                  >
                    {addedToBag ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Bag
                      </>
                    ) : (
                      <>
                        Add to Bag
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setWishlist(!wishlist)}
                    className={`w-full py-3 text-xs uppercase tracking-[0.18em] border transition-all inline-flex items-center justify-center gap-2 ${
                      wishlist ? "border-bronze-400 text-bronze-500 bg-bronze-300/5" : "border-stone-200 text-charcoal-400 bg-white hover:border-bronze-400/40"
                    }`}
                  >
                    <svg className="w-4 h-4" fill={wishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {wishlist ? "Added to Wishlist" : "Add to Wishlist"}
                  </button>
                </div>

                {/* Quick specs */}
                {p.specs && Object.keys(p.specs).length > 0 && (
                <div className="mt-8 border border-stone-100 bg-white divide-y divide-bronze-200/30">
                  {Object.entries(p.specs).map(([key, val]) => (
                    <div key={key} className="px-5 py-3 flex justify-between items-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-300">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                      <p className="text-xs text-charcoal-500 text-right max-w-[60%]">{val}</p>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. PRODUCT INFORMATION , Description, Craftsmanship, Delivery, Returns
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Description */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Description</p>
              <p className="text-sm text-charcoal-500 leading-[1.8]">{p.description || ""}</p>
            </div>

            {/* Craftsmanship */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Craftsmanship</p>
              <p className="text-sm text-charcoal-500 leading-[1.8]">{p.craftsmanship || p.description || ""}</p>
            </div>

            {/* Delivery */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Delivery</p>
              <p className="text-sm text-charcoal-500 leading-relaxed">{p.delivery?.dispatch || "3–4 weeks from order (each piece is made to order)"}</p>
              <p className="text-sm text-charcoal-500 leading-relaxed mt-2">{p.delivery?.packaging || "Wrapped in unbleached cotton, shipped in a reusable cardboard mailer."}</p>
            </div>

            {/* Returns */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Returns</p>
              <ul className="space-y-2">
                {(p.returns || [
                  "14-day return window from delivery date",
                  "Item must be unworn with all tags attached",
                  "Custom/made-to-order pieces are final sale",
                  "Return shipping is complimentary within Pakistan",
                ]).map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-charcoal-500">
                    <span className="mt-1.5 w-1 h-1 shrink-0 bg-bronze-300/50 rounded-full" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. DESIGNER CARD , Small profile preview
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-8 text-center">The Designer</p>
          {p.designer && (
          <Link to={`/${p.designer.slug || p.designer._id}`} className="group block">
            <div className="border border-stone-100 bg-ivory-50 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:border-bronze-300/50 transition-colors duration-300">
              <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-bronze-400/20">
                <img src={p.designer.avatar || p.designer.image || "/assets/images/home-designer-portrait-1.webp"} alt={p.designer.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.designer.name}</h3>
                <p className="text-xs text-charcoal-400 mt-1">{p.designer.city || p.designer.location || ""}{p.designer.established ? ` · Est. ${p.designer.established}` : ""}{p.designer.studio ? ` · ${p.designer.studio}` : ""}</p>
                <p className="text-sm text-charcoal-400 mt-3 leading-relaxed">{p.designer.bio || p.designer.description || ""}</p>
                <span className="inline-flex items-center gap-2 mt-4 text-xs text-bronze-500 tracking-wider uppercase">
                  View Profile
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </div>
          </Link>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. COMPLETE THE LOOK
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Style With</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Complete The Look</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(p.completeTheLook || []).map((item, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.image || item.img || "/assets/images/placeholder.webp"} alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{item.name}</h3>
                  <p className="text-sm text-charcoal-400 mt-1">{item.price ? fmtPrice(item.price) : ""}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. RELATED PRODUCTS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Discover More</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Related Products</h2>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {(p.relatedProducts || []).map((item, i) => (
              <article key={i} className="shrink-0 w-64 snap-start group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.image || item.img || "/assets/images/placeholder.webp"} alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-serif text-sm text-white">{item.name}</h3>
                    <p className="text-xs text-ivory-300 mt-0.5">{item.designer}</p>
                    <p className="text-xs text-bronze-400 mt-1">{item.price ? fmtPrice(item.price) : ""}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. SHIPPING TABLE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4 text-center">Global Delivery</p>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium mb-10 text-center">Estimated Delivery Times</h2>
          <div className="border border-stone-100 bg-white divide-y divide-bronze-200/30">
            {(p.delivery?.regions || [
              { region: "Pakistan", time: "3–5 business days" },
              { region: "Middle East & South Asia", time: "7–10 business days" },
              { region: "Europe & UK", time: "10–14 business days" },
              { region: "North America", time: "10–14 business days" },
              { region: "Rest of World", time: "14–21 business days" },
            ]).map((r, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-charcoal-500">{r.region}</span>
                <span className="text-sm text-bronze-500">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
