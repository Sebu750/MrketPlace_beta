import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../store/editorialSlice";

/* ════════════════════════════════════════════════════════════════
   EDITORIAL — Long-form journalism, real API data
════════════════════════════════════════════════════════════════ */
const SECTIONS = ["All", "Interviews", "Designer Stories", "Collection Reviews", "Industry Reports", "Student Features", "Craft Documentation"];

export default function Editorial() {
  const dispatch = useDispatch();
  const { items: articles, pagination, loading } = useSelector((s) => s.editorial.list);
  const [activeSection, setActiveSection] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = {};
    if (activeSection !== "All") params.category = activeSection;
    if (search) params.search = search;
    dispatch(fetchArticles(params));
  }, [dispatch, activeSection, search]);

  const featured = useMemo(() => articles.filter((a) => a.featured), [articles]);
  const totalArticles = pagination?.total ?? articles.length;

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-10 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-2">Adorzia</p>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal-900 tracking-tight">Editorial</h1>
          <p className="mt-4 text-charcoal-400 max-w-2xl leading-relaxed">
            Long-form journalism on Pakistani fashion, craft, and the designers shaping both. No listicles, just stories worth reading.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:border-bronze-400 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. SECTION FILTER
      ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-bronze-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                  activeSection === s
                    ? "bg-charcoal-900 text-white border-charcoal-900"
                    : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-bronze-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-charcoal-300 mt-4 uppercase tracking-wider">Loading articles...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* ═══════════════════════════════════════════════════════════
              3. FEATURED ARTICLES (only on "All" view, no search)
          ═══════════════════════════════════════════════════════════ */}
          {activeSection === "All" && !search && featured.length > 0 && (
            <section className="py-16 md:py-24">
              <div className="max-w-7xl mx-auto px-6">
                <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-8">Editor's Picks</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {featured.map((article) => (
                    <Link key={article._id} to={`/editorial/${article.slug}`} className="group block">
                      <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
                        {article.coverImage ? (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-200 to-charcoal-100 flex items-center justify-center">
                            <span className="font-display text-4xl text-charcoal-300">{article.title?.[0]}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">Featured</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-bronze-400/70">{article.category}</span>
                          <h3 className="font-serif text-xl text-white mt-2 group-hover:text-bronze-400 transition-colors duration-300">{article.title}</h3>
                          <p className="text-xs text-ivory-300 mt-2">{formatDate(article.publishedAt)} · {article.readTime} min read</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              4. ALL / FILTERED ARTICLES
          ═══════════════════════════════════════════════════════════ */}
          <section className="py-16 md:py-24 bg-stone-50 border-t border-bronze-200/40">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">
                  {activeSection === "All" ? "All Articles" : activeSection}
                </h2>
                <span className="text-xs text-charcoal-300">{totalArticles} article{totalArticles !== 1 && "s"}</span>
              </div>

              {/* Empty state */}
              {articles.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-serif text-2xl text-charcoal-900 mb-3">No articles yet</p>
                  <p className="text-sm text-charcoal-400">
                    {search ? `No results for "${search}".` : `No articles in ${activeSection} yet. Check back soon.`}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {articles.map((article) => (
                  <Link key={article._id} to={`/editorial/${article.slug}`} className="group block">
                    <div className="flex flex-col md:flex-row gap-6 border border-stone-200 bg-white p-5 hover:border-bronze-300/50 transition-colors duration-300">
                      <div className="shrink-0 w-full md:w-56 aspect-[3/2] overflow-hidden bg-stone-100">
                        {article.coverImage ? (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                            <span className="font-display text-3xl text-stone-200">{article.title?.[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] uppercase tracking-[0.15em] text-bronze-500 border border-bronze-400/30 px-2 py-0.5">{article.category}</span>
                            <span className="text-xs text-charcoal-300">{formatDate(article.publishedAt)} · {article.readTime} min read</span>
                          </div>
                          <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{article.title}</h3>
                          {article.excerpt && (
                            <p className="text-sm text-charcoal-400 mt-2 leading-relaxed">{article.excerpt}</p>
                          )}
                          {article.author && (
                            <p className="text-xs text-charcoal-300 mt-3">By {article.author}</p>
                          )}
                        </div>
                        <span className="mt-4 text-[10px] uppercase tracking-wider text-bronze-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Read Article →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. SUBMISSION CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-6">For Writers</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium leading-tight">
            Contribute to
            <br />
            <span className="italic text-bronze-500">Adorzia Editorial</span>
          </h2>
          <p className="mt-6 text-charcoal-400 leading-relaxed max-w-xl mx-auto">
            We publish long-form journalism on Pakistani fashion, craft, and design. If you have a story worth telling,
            a designer profile, a craft documentation, an industry analysis, we want to read it.
          </p>
          <button className="mt-10 px-8 py-3 bg-charcoal-900 text-white text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
            Submit a Pitch
          </button>
        </div>
      </section>
    </div>
  );
}
