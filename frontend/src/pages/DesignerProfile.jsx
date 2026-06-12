import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicDesigner, fetchPublicDesigners } from "../store/designerSlice";
import { fetchPublicCollections } from "../store/collectionsSlice";
import { fetchPublicProducts } from "../store/productsSlice";
import { Spinner } from "../components/Skeleton";

/* ════════════════════════════════════════════════════════════════
   COMPONENT — Designer Profile (full page, API-driven)
════════════════════════════════════════════════════════════════ */
export default function DesignerProfile() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [supporting, setSupporting] = useState(false);

  /* ── Redux state ──────────────────────────────────────────── */
  const designer = useSelector((s) => s.designer.public.current);
  const designerLoading = useSelector((s) => s.designer.public.loading);
  const collections = useSelector((s) => s.collections.public.items);
  const products = useSelector((s) => s.products.public.items);
  const otherDesigners = useSelector((s) => s.designer.public.items);

  /* ── Fetch designer by slug ───────────────────────────────── */
  useEffect(() => {
    if (slug) dispatch(fetchPublicDesigner(slug));
  }, [dispatch, slug]);

  /* ── Once designer loads, fetch their collections + products ── */
  const designerId = designer?._id;
  useEffect(() => {
    if (designerId) {
      dispatch(fetchPublicCollections({ designer: designerId, limit: 20 }));
      dispatch(fetchPublicProducts({ designer: designerId, limit: 20 }));
    }
  }, [dispatch, designerId]);

  /* ── Fetch other designers for "More Designers" section ──── */
  useEffect(() => {
    dispatch(fetchPublicDesigners({ limit: 8 }));
  }, [dispatch]);

  /* ── Derived data ─────────────────────────────────────────── */
  const d = designer || {};
  const name = d.brandName || d.name || "";
  const city = d.studioCity || "";
  const avatar = d.logo || "";
  const banner = d.banner || "";
  const bio = d.bio || "";
  const cats = d.category ? (Array.isArray(d.category) ? d.category : [d.category]) : [];
  const crafts = d.craftTraditions || [];
  const socials = d.socialLinks || {};
  const year = d.joinedDate ? new Date(d.joinedDate).getFullYear() : "";
  const careerStage = d.verified ? "Spotlight Alumni" : "Rising Talent";
  const stageDetail = d.plan === "enterprise" ? "Established Label" : d.plan === "pro" ? "Independent Creative" : "Emerging Designer";

  /* Stats from actual data */
  const productCount = products.length;
  const collectionCount = collections.length;
  const craftCount = crafts.length;

  /* Filter out current designer from "more designers" */
  const moreDesigners = useMemo(() => {
    if (!otherDesigners.length) return [];
    return otherDesigners.filter((o) => o._id !== designerId).slice(0, 6);
  }, [otherDesigners, designerId]);

  /* ── Loading state ────────────────────────────────────────── */
  if (designerLoading || !designer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  /* ── Not found ────────────────────────────────────────────── */
  if (!designer && !designerLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <p className="font-serif text-2xl text-charcoal-400 mb-2">Designer not found</p>
        <Link to="/designers" className="text-sm text-bronze-500 hover:text-bronze-400 mt-4">Browse all designers</Link>
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO — Cover + Portrait + Identity
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="h-72 md:h-96 overflow-hidden">
          {banner ? (
            <img src={banner} alt="" className="w-full h-full object-cover opacity-30" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 opacity-30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/50 to-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 -mt-28 md:-mt-32 z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
            {/* Portrait */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 border-white shadow-xl rounded-full bg-stone-100">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-5xl text-charcoal-200">{name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">
                  {careerStage}
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-charcoal-400 border border-stone-200 px-2 py-0.5">
                  {stageDetail}
                </span>
                {d.verified && (
                  <span className="text-[9px] uppercase tracking-[0.15em] bg-white/70 backdrop-blur-sm text-bronze-500 px-2 py-0.5 border border-stone-200/50">
                    Verified
                  </span>
                )}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal-900 tracking-tight">{name}</h1>
              <p className="mt-2 text-sm text-charcoal-400">
                {city && <>{city}, </>}Pakistan {year && <><span className="text-stone-300 mx-2">·</span> Est. {year}</>}
              </p>
              {bio && <p className="mt-2 text-sm text-charcoal-500 italic max-w-lg line-clamp-2">{bio}</p>}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <button
                onClick={() => setSupporting(!supporting)}
                className={`px-6 py-2.5 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                  supporting
                    ? "bg-bronze-300/10 border border-bronze-400 text-bronze-600"
                    : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                }`}
              >
                {supporting ? "Supporting" : "Support This Designer"}
              </button>
              {/* Socials */}
              <div className="flex gap-2">
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">
                    I
                  </a>
                )}
                {socials.website && (
                  <a href={socials.website} target="_blank" rel="noopener noreferrer" aria-label="Website"
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">
                    W
                  </a>
                )}
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">
                    F
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. STATS BAR — mission-aligned metrics
      ═══════════════════════════════════════════════════════════ */}
      <section className="mt-12 border-y border-bronze-200/40 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-bronze-200/30">
            {[
              { value: productCount, label: "Pieces Launched" },
              { value: craftCount, label: "Craft Traditions Worked With" },
              { value: collectionCount, label: "Collections on Adorzia" },
              { value: year || "—", label: "Debut Year" },
            ].map((stat, i) => (
              <div key={i} className="py-8 px-4 md:px-6 text-center">
                <p className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">{stat.value}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-charcoal-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. ABOUT — Biography
      ═══════════════════════════════════════════════════════════ */}
      {bio && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">About</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-16">The Designer</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-7">
                <p className="text-charcoal-500 leading-[1.85] text-base md:text-lg whitespace-pre-line">{bio}</p>
              </div>
              <div className="lg:col-span-5 space-y-8">
                {cats.length > 0 && (
                  <div className="border-l-2 border-bronze-400 pl-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-3">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {cats.map((cat) => (
                        <span key={cat} className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 border border-stone-200 px-3 py-1">{cat}</span>
                      ))}
                    </div>
                  </div>
                )}
                {city && (
                  <div className="bg-stone-50 border border-stone-200 p-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Studio Location</p>
                    <p className="text-sm text-charcoal-500">Adorzia Studio, {city}</p>
                  </div>
                )}
                {d.defaultShippingPolicy && (
                  <div className="bg-stone-50 border border-stone-200 p-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Shipping</p>
                    <p className="text-sm text-charcoal-500">{d.defaultShippingPolicy}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          4. COLLECTIONS — "The Archive"
      ═══════════════════════════════════════════════════════════ */}
      {collections.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Body of Work</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">The Archive</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {collections.map((col) => (
                <Link key={col._id} to={`/collections/${col.slug || col._id}`} className="group block hover-lift">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {col.coverImage ? (
                      <img src={col.coverImage} alt={col.name} loading="lazy" decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.05]" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">
                        {col.season || ""} {col.productCount ? `· ${col.productCount} pieces` : ""}
                      </p>
                      <h3 className="font-serif text-lg text-white">{col.name}</h3>
                      <span className="text-xs text-bronze-400/0 group-hover:text-bronze-400 transition-all duration-300 tracking-wider uppercase mt-2 inline-block">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. SELECTED WORKS — Products
      ═══════════════════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Iconic Work</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Selected Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <Link key={p._id} to={`/pieces/${p._id}`} className="group cursor-pointer hover-lift">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} loading="lazy" decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.05]" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 flex items-center justify-center">
                        <span className="font-display text-3xl text-charcoal-200">{name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.name}</h3>
                    {p.collection && <p className="text-xs text-charcoal-400 mt-1">{typeof p.collection === "string" ? p.collection : p.collection.name}</p>}
                    <p className="text-sm text-bronze-500 mt-1.5">PKR {p.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          6. HERITAGE CRAFT USAGE
      ═══════════════════════════════════════════════════════════ */}
      {crafts.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">Craft Traditions</h2>
            <p className="text-sm text-charcoal-400 max-w-xl mb-14">
              The traditional crafts this designer works with — each one a living heritage practice sustained through contemporary design.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {crafts.map((craft, i) => (
                <div key={i} className="border border-stone-100 bg-ivory-50 p-8 hover:border-bronze-300/50 transition-colors duration-300">
                  <h3 className="font-serif text-lg text-charcoal-900 mb-1">{craft}</h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed">A heritage craft practiced by artisans across Pakistan, preserved through contemporary design.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          7. CONTACT & COLLABORATE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Get in Touch</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Contact & Collaborate</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Your Name" required
                    className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors" />
                  <input type="email" placeholder="Email Address" required
                    className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors" />
                </div>
                <select className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-400 text-sm focus:outline-none focus:border-bronze-400 transition-colors">
                  <option>Inquiry Type</option>
                  <option>Press & Stockist Inquiries</option>
                  <option>Custom & Bespoke Orders</option>
                </select>
                <textarea rows={5} placeholder="Your message…" required
                  className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors resize-none" />
                <button type="submit" className="bg-charcoal-900 text-white px-8 py-3 text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors inline-flex items-center gap-2">
                  Send Inquiry
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </form>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5">
              <div className="border border-stone-100 bg-ivory-50 p-8 space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Response Time</p>
                  <p className="text-sm text-charcoal-900">Within 48 hours</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-3">Inquiry Categories</p>
                  <ul className="space-y-2">
                    <li className="text-sm text-charcoal-500">Press & Stockist Inquiries</li>
                    <li className="text-sm text-charcoal-500">Custom & Bespoke Orders</li>
                  </ul>
                </div>
                {Object.keys(socials).length > 0 && (
                  <div className="border-t border-bronze-200/30 pt-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-3">Social</p>
                    <div className="flex gap-3">
                      {socials.instagram && (
                        <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">I</a>
                      )}
                      {socials.website && (
                        <a href={socials.website} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">W</a>
                      )}
                      {socials.facebook && (
                        <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">F</a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. MORE DESIGNERS
      ═══════════════════════════════════════════════════════════ */}
      {moreDesigners.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Discover</p>
                <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium">More Designers</h2>
              </div>
              <Link to="/designers" className="hidden md:inline-flex items-center gap-2 text-sm text-bronze-500 tracking-wide hover:text-bronze-400 transition-colors">
                Browse All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
              {moreDesigners.map((other) => {
                const oSlug = other.slug || other._id;
                const oAvatar = other.logo || "";
                const oCity = other.studioCity || "";
                return (
                  <Link key={other._id} to={`/${oSlug}`} className="shrink-0 w-60 snap-start group">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {oAvatar ? (
                        <img src={oAvatar} alt={other.name} loading="lazy" decoding="async"
                          className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.05]" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 flex items-center justify-center">
                          <span className="font-display text-4xl text-charcoal-200">{(other.name || "?").charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-serif text-sm text-white">{other.brandName || other.name}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">{oCity}</p>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal-400 mt-2">{other.category || "Designer"}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
