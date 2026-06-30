import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicDesigners } from "../store/designerSlice";
import useReveal from "../hooks/useReveal";
import { Spinner } from "./Skeleton";

export default function DesignerSpotlight() {
  const dispatch = useDispatch();
  const { items: designers, loading } = useSelector((s) => s.designer.public);
  const ref = useReveal();

  useEffect(() => {
    dispatch(fetchPublicDesigners({ verified: true, limit: 1 }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="bg-stone-50 py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      </section>
    );
  }

  const spotlight = designers[0];

  if (!spotlight) {
    return null;
  }

  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-0 items-center">
          {/* ── Left: Portrait with corner bracket ────────────── */}
          <div className="relative ">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
              <img
                src={spotlight.coverImage || spotlight.profileImage || "/assets/images/Zara-ahmad.webp"}
                alt={`${spotlight.name} , Designer Spotlight`}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/20 to-transparent" />
            </div>
          </div>

          {/* ── Right: Editorial text with gold hairline ──────── */}
          <div className="lg:pl-12 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-bronze-300 lg:pl-14">
            <p className="text-[10px] uppercase tracking-[0.35em] text-bronze-500 mb-4">Spotlight</p>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal-900 leading-tight">
              {spotlight.name}
            </h2>

            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-charcoal-300">
              {spotlight.craftTraditions?.slice(0, 2).join(" & ") || "Contemporary Design"} · {spotlight.studioCity || "Pakistan"}
            </p>

            <p className="mt-6 text-charcoal-400 text-base leading-relaxed max-w-md">
              {spotlight.bio || "Crafting contemporary fashion rooted in Pakistani heritage traditions."}
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link to={`/${spotlight.slug}`}
                className="text-xs uppercase tracking-[0.2em] text-charcoal-700 hover:text-charcoal-800 transition-colors border-b border-charcoal-700 pb-0.5">
                Shop Their Work →
              </Link>
              <Link to="/designers"
                className="text-xs uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors">
                All Designers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
