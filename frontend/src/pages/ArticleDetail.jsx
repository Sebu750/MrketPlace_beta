import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticleDetail, clearArticleDetail } from "../store/editorialSlice";
import { Spinner } from "../components/Skeleton";

/* ════════════════════════════════════════════════════════════════
   ARTICLE DETAIL — full article reading page
════════════════════════════════════════════════════════════════ */
export default function ArticleDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { item: article, loading, error } = useSelector((s) => s.editorial.detail);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    dispatch(fetchArticleDetail(slug));
    return () => dispatch(clearArticleDetail());
  }, [dispatch, slug]);

  /* Reading progress bar */
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) setReadProgress(Math.min(100, (scrollTop / docHeight) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  /* ── Loading ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <Spinner />
      </div>
    );
  }

  /* ── Error / Not found ─────────────────────────────────────────── */
  if (!article || error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="font-serif text-2xl text-charcoal-900 mb-4">{error || "Article not found"}</p>
          <Link to="/editorial" className="text-sm text-bronze-500 hover:text-bronze-400">← Back to Editorial</Link>
        </div>
      </div>
    );
  }

  const { related = [] } = article;

  return (
    <div className="bg-white">

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
        <div className="h-full bg-bronze-400 transition-[width] duration-150 ease-out" style={{ width: `${readProgress}%` }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {article.coverImage ? (
            <img src={article.coverImage} alt="" className="w-full h-full object-cover opacity-20" />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-stone-100 to-white" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/50 to-white" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16 pt-40 w-full">
          <Link to="/editorial" className="text-xs text-bronze-500 hover:text-bronze-400 tracking-wider uppercase mb-8 inline-block">
            ← Editorial
          </Link>
          <span className="text-[10px] uppercase tracking-[0.2em] text-bronze-500 border border-bronze-400/30 px-2.5 py-1 block w-fit mb-6">
            {article.category}
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-charcoal-900 leading-[0.95] tracking-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 mt-6 text-xs text-charcoal-400">
            {article.author && <span>By {article.author}</span>}
            {article.author && <span className="text-stone-300">·</span>}
            <span>{formatDate(article.publishedAt)}</span>
            <span className="text-stone-300">·</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. ARTICLE CONTENT
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          {article.excerpt && (
            <p className="font-serif text-xl md:text-2xl text-charcoal-600 leading-relaxed italic mb-12 border-l-2 border-bronze-300 pl-6">
              {article.excerpt}
            </p>
          )}

          {article.content && (
            <div className="prose-article text-charcoal-500 leading-[1.9] text-base md:text-lg whitespace-pre-line">
              {article.content}
            </div>
          )}

          {!article.content && !article.excerpt && (
            <p className="text-charcoal-400 italic">Article content coming soon.</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. GALLERY (if article has gallery images)
      ═══════════════════════════════════════════════════════════ */}
      {article.gallery && article.gallery.length > 0 && (
        <section className="py-16 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-8">Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {article.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover opacity-85" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          4. RELATED ARTICLES
      ═══════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-8">More in {article.category}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r._id} to={`/editorial/${r.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
                    {r.coverImage ? (
                      <img
                        src={r.coverImage}
                        alt={r.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                        loading="lazy" decoding="async"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
                        <span className="font-display text-3xl text-stone-300">{r.title?.[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-bronze-400/70">{r.category}</span>
                      <h3 className="font-serif text-base text-white mt-1 group-hover:text-bronze-400 transition-colors duration-300">{r.title}</h3>
                      <p className="text-xs text-ivory-300 mt-1">{formatDate(r.publishedAt)} · {r.readTime} min</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. BACK TO EDITORIAL
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/editorial" className="inline-flex items-center gap-2 text-sm text-bronze-500 tracking-wider hover:text-bronze-400 transition-colors uppercase">
            ← Back to Editorial
          </Link>
        </div>
      </section>
    </div>
  );
}
