import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicDesigner, fetchPublicDesigners } from "../store/designerSlice";
import { fetchPublicCollections } from "../store/collectionsSlice";
import { fetchPublicProducts } from "../store/productsSlice";
import { Spinner } from "../components/Skeleton";
import { MasonryGallery, UniformGridGallery, HeroThumbnailsGallery } from "../components/CollectionGallery";
import { assets } from "../assets";

/* ════════════════════════════════════════════════════════════════
   COMPONENT — Designer Profile (full page, API-driven)
════════════════════════════════════════════════════════════════ */
export default function DesignerProfile() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [supporting, setSupporting] = useState(false);
  const [galleryLayout, setGalleryLayout] = useState('masonry'); // 'masonry' | 'uniform' | 'hero'

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
  const education = d.education || [];
  const awards = d.awards || [];
  const exhibitions = d.exhibitions || [];
  const publications = d.publications || [];

  /* Stats from actual data */
  const productCount = products.length;
  const collectionCount = collections.length;
  const craftCount = crafts.length;

  /* Separate latest vs previous collections */
  const latestCollection = collections.length > 0 ? collections[0] : null;
  const previousCollections = collections.length > 1 ? collections.slice(1) : [];

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
          1. DESIGNER OVERVIEW — Hero with Profile & Social
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Banner */}
        <div className="h-80 md:h-[500px] overflow-hidden">
          {banner ? (
            <img src={banner} alt="" className="w-full h-full object-cover" />
          ) : (
            <img src={assets.banners.banner3} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/40 via-charcoal-950/20 to-white" />
          
          {/* Social Links on Banner - Bottom Right */}
          <div className="absolute bottom-10 right-10 z-20">
            <div className="flex gap-3">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-11 h-11 flex items-center justify-center bg-charcoal-900/80 backdrop-blur-sm border border-charcoal-700 text-white text-sm font-medium hover:bg-charcoal-900 transition-colors">
                  I
                </a>
              )}
              {socials.website && (
                <a href={socials.website} target="_blank" rel="noopener noreferrer" aria-label="Website"
                  className="w-11 h-11 flex items-center justify-center bg-charcoal-900/80 backdrop-blur-sm border border-charcoal-700 text-white text-sm font-medium hover:bg-charcoal-900 transition-colors">
                  W
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-11 h-11 flex items-center justify-center bg-charcoal-900/80 backdrop-blur-sm border border-charcoal-700 text-white text-sm font-medium hover:bg-charcoal-900 transition-colors">
                  F
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative max-w-7xl mx-auto px-6 -mt-28 md:-mt-32 z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 border-white shadow-xl rounded-full bg-stone-100">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <img src={assets.designers.designer1} alt={name} className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            {/* Identity & Bio */}
            <div className="flex-1 pb-1">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight">{name}</h1>
              <p className="mt-2 text-sm text-charcoal-400">
                {city && <>{city}, </>}Pakistan {year && <><span className="text-stone-300 mx-2">·</span> Est. {year}</>}
              </p>
              {bio && <p className="mt-3 text-sm text-charcoal-500 italic max-w-2xl leading-relaxed">{bio}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. LATEST COLLECTION — Featured Drop
      ═══════════════════════════════════════════════════════════ */}
      {latestCollection && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Latest Collection</p>
                <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold">{latestCollection.name}</h2>
              </div>
              <div className="flex items-center gap-6">
                {/* Layout Selector - Hidden from UI */}
                <div className="hidden">
                  <button onClick={() => setGalleryLayout('masonry')}>Masonry</button>
                  <button onClick={() => setGalleryLayout('uniform')}>Grid</button>
                  <button onClick={() => setGalleryLayout('hero')}>Hero</button>
                </div>
                <Link to={`/collections/${latestCollection.slug || latestCollection._id}`} className="hidden md:inline-flex items-center gap-2 text-sm text-bronze-500 tracking-wide hover:text-bronze-400 transition-colors">
                  View Collection
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>

            {/* Featured Hero Image */}
            {latestCollection.coverImage && (
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-6 group">
                <img src={latestCollection.coverImage} alt={latestCollection.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent" />
              </div>
            )}

            {/* Moodboard Gallery - Lookbook Style */}
            {latestCollection.lookbookImages && latestCollection.lookbookImages.length > 0 ? (
              <MasonryGallery images={latestCollection.lookbookImages} collectionName={latestCollection.name} />
            ) : (
              /* Fallback to products if no lookbook images */
              products.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {products.filter(p => !latestCollection.products || latestCollection.products.includes(p._id)).slice(0, 4).map((p) => (
                    <Link key={p._id} to={`/pieces/${p._id}`} className="group cursor-pointer">
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} loading="lazy" decoding="async"
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 flex items-center justify-center">
                            <span className="font-display text-3xl text-charcoal-200">{name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif text-sm text-charcoal-900 group-hover:text-bronze-500 transition-colors">{p.name}</h3>
                      <p className="text-xs text-bronze-500 mt-1">PKR {p.price?.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              )
            )}

            {/* Collection Info - Below Gallery */}
            <div className="mt-12 max-w-3xl">
              {latestCollection.season && (
                <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-3">{latestCollection.season}</p>
              )}
              {latestCollection.description && (
                <p className="text-base md:text-lg text-charcoal-600 leading-[1.85] mb-6">{latestCollection.description}</p>
              )}
              {latestCollection.craftTraditions && latestCollection.craftTraditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {latestCollection.craftTraditions.map((craft) => (
                    <span key={craft} className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 border border-stone-200 px-3 py-1">{craft}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          3. PREVIOUS COLLECTIONS — The Archive
      ═══════════════════════════════════════════════════════════ */}
      {previousCollections.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Body of Work</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold mb-14">Previous Collections</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {previousCollections.map((col) => (
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
          4. ABOUT THE DESIGNER — Biography, Education & Awards
      ═══════════════════════════════════════════════════════════ */}
      {bio && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">About</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold mb-16">The Designer</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              {/* Biography */}
              <div className="lg:col-span-7">
                <p className="text-charcoal-500 leading-[1.85] text-base md:text-lg whitespace-pre-line">{bio}</p>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-5 space-y-8">
                {/* Education */}
                {education.length > 0 && (
                  <div className="border-l-2 border-bronze-400 pl-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Education</p>
                    <div className="space-y-4">
                      {education.map((edu, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-charcoal-900 font-medium">{edu.degree || edu}</p>
                          {edu.institution && <p className="text-xs text-charcoal-400 mt-0.5">{edu.institution}</p>}
                          {edu.year && <p className="text-xs text-charcoal-400 mt-0.5">{edu.year}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards */}
                {awards.length > 0 && (
                  <div className="border-l-2 border-bronze-400 pl-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Awards & Recognition</p>
                    <div className="space-y-3">
                      {awards.map((award, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-charcoal-900">{award.title || award}</p>
                          {award.year && <p className="text-xs text-charcoal-400 mt-0.5">{award.year}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exhibitions */}
                {exhibitions.length > 0 && (
                  <div className="border-l-2 border-bronze-400 pl-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Exhibitions</p>
                    <div className="space-y-3">
                      {exhibitions.map((exh, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-charcoal-900">{exh.title || exh}</p>
                          {exh.venue && <p className="text-xs text-charcoal-400 mt-0.5">{exh.venue}</p>}
                          {exh.year && <p className="text-xs text-charcoal-400 mt-0.5">{exh.year}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications */}
                {publications.length > 0 && (
                  <div className="border-l-2 border-bronze-400 pl-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-4">Publications</p>
                    <div className="space-y-3">
                      {publications.map((pub, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-charcoal-900">{pub.title || pub}</p>
                          {pub.publisher && <p className="text-xs text-charcoal-400 mt-0.5">{pub.publisher}</p>}
                          {pub.year && <p className="text-xs text-charcoal-400 mt-0.5">{pub.year}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
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

                {/* Studio Location */}
                {city && (
                  <div className="bg-stone-50 border border-stone-200 p-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Studio Location</p>
                    <p className="text-sm text-charcoal-500">Adorzia Studio, {city}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. SELECTED WORKS — Iconic Pieces
      ═══════════════════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Iconic Work</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold mb-14">Selected Works</h2>

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
          6. HERITAGE CRAFT — Living Traditions
      ═══════════════════════════════════════════════════════════ */}
      {crafts.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold mb-4">Craft Traditions</h2>
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
          7. DESIGN PHILOSOPHY — Creative Manifesto
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Philosophy</p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold">Design Manifesto</h2>
            </div>
            <div className="space-y-6">
              <p className="text-charcoal-500 leading-relaxed text-base md:text-lg">
                At Adorzia, design is a dialogue between tradition and innovation. Every piece carries the weight of centuries-old craftsmanship, reimagined for the contemporary wearer.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border-l-2 border-bronze-400 pl-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-500">Approach</p>
                  <p className="text-sm text-charcoal-600 mt-1">Slow, intentional, and deeply rooted in material wisdom</p>
                </div>
                <div className="border-l-2 border-bronze-400 pl-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-500">Ethos</p>
                  <p className="text-sm text-charcoal-600 mt-1">Sustainability as a practice, not a trend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. COLLABORATIONS — Artist Partnerships
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Collaborations</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold mb-4">Artist Partnerships</h2>
          <p className="text-sm text-charcoal-400 max-w-xl mb-14">
            Adorzia collaborates with artists and artisans who share a commitment to preserving heritage crafts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Akram Textiles", craft: "Handloom Weaving", year: "2022" },
              { name: "Anokhi Collective", craft: "Block Printing", year: "2023" },
              { name: "Kutch Embroidery Guild", craft: "Mirror Work", year: "2024" }
            ].map((colab, i) => (
              <div key={i} className="bg-white p-6 border border-stone-100 hover:border-bronze-300/50 transition-colors duration-300">
                <h3 className="font-serif text-lg text-charcoal-900">{colab.name}</h3>
                <p className="text-sm text-charcoal-500 mt-1">{colab.craft}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400 mt-3">Since {colab.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. PRESS & FEATURES — Media Mentions
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Press</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold mb-14">Featured In</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { publication: "Vogue Pakistan", title: "The New Wave of Heritage Craft" },
              { publication: "Elle Decoration", title: "Traditional Craft, Modern Form" },
              { publication: "Architectural Digest", title: "Where Art Meets Wearable Design" }
            ].map((feature, i) => (
              <div key={i} className="border-l-2 border-bronze-400 pl-6 py-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-500">{feature.publication}</p>
                <p className="text-sm text-charcoal-700 mt-1 italic">“{feature.title}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. MORE DESIGNERS — Discover
      ═══════════════════════════════════════════════════════════ */}
      {moreDesigners.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Discover</p>
                <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-bold">More Designers</h2>
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

      {/* ═══════════════════════════════════════════════════════════
          11. SHOP THE COLLECTION — CTA to Explore All Products
      ═══════════════════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-16 md:py-24 bg-charcoal-950">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold tracking-wide">
              Explore the Adorzia Collection
            </h2>
            <p className="text-charcoal-300 max-w-md mx-auto mt-4 text-sm leading-relaxed">
              Discover handcrafted pieces that bridge tradition and contemporary design.
            </p>
            <Link to={`/${slug}/products`} className="inline-block mt-8 px-10 py-3 border border-bronze-400 text-bronze-400 text-xs uppercase tracking-[0.25em] hover:bg-bronze-400 hover:text-charcoal-950 transition-colors duration-300">
              Shop All Products
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}