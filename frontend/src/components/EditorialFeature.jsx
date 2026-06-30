import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../store/editorialSlice";
import useReveal from "../hooks/useReveal";
import { Spinner } from "./Skeleton";

export default function EditorialFeature() {
  const dispatch = useDispatch();
  const { items: articles, loading } = useSelector((s) => s.editorial.list);
  const imgRef = useRef(null);
  const ref = useReveal(0.2);

  useEffect(() => {
    dispatch(fetchArticles({ featured: true, limit: 1 }));
  }, [dispatch]);

  /* Subtle parallax , slow and cinematic */
  useEffect(() => {
    const onScroll = () => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.04;
      el.style.transform = `translateY(${offset}px) scale(1.06)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    return (
      <section className="bg-ivory-50 py-24 md:py-36 overflow-hidden flex items-center justify-center min-h-[520px]">
        <Spinner />
      </section>
    );
  }

  const featured = articles[0];

  if (!featured) {
    return null;
  }

  return (
    <section className="bg-ivory-50 py-24 md:py-36 overflow-hidden">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0 items-stretch min-h-[520px] lg:min-h-[640px]">
          {/* ── Left: Full-bleed image with parallax ─────────── */}
          <div className="relative overflow-hidden bg-stone-100">
            <div ref={imgRef} className="absolute inset-[-40px]">
              <img
                src={featured.coverImage || "/assets/images/home-sustainable-fashion.webp"}
                alt={featured.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* ── Right: Editorial text ────────────────────────── */}
          <div className="relative flex flex-col justify-center py-16 lg:py-20 lg:pl-16 border-l border-stone-200">
            <p className="section-label mb-6">{featured.category || "Editorial"}</p>

            <h2 className="font-serif text-display-sm md:text-display text-charcoal-900 font-light leading-[0.95]">
              {featured.title}
            </h2>

            {featured.excerpt && (
              <p className="mt-8 text-charcoal-500 text-sm md:text-base leading-[1.85] max-w-sm font-light">
                {featured.excerpt}
              </p>
            )}

            <div className="mt-10 flex items-center gap-4">
              <Link to={`/editorial/${featured.slug}`} className="btn-outline">
                Read Article
              </Link>
              {featured.author && (
                <span className="text-xs text-charcoal-400">By {featured.author}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
