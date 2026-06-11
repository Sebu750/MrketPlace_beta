import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminReviews, deleteReview } from "../store/adminSlice";

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <span key={s} className={s <= rating ? "text-amber-500" : "text-stone-200"}>★</span>
    ))}
  </div>
);

export default function AdminReviews() {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((s) => s.admin);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminReviews({ page }));
  }, [dispatch, page]);

  const items = reviews.items || [];
  const pg = reviews.pagination || {};

  const handleDelete = (id) => {
    if (window.confirm("Delete this review? This cannot be undone.")) {
      dispatch(deleteReview(id));
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Summary ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-charcoal-400">
            {pg.total ? `${pg.total} total reviews on platform` : "Loading…"}
          </p>
        </div>
      </div>

      {/* ── Reviews List ─────────────────────────────── */}
      <div className="space-y-4">
        {loading && items.length === 0 ? (
          <div className="bg-white border border-stone-200 p-12 text-center text-charcoal-400">Loading reviews…</div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-stone-200 p-12 text-center text-charcoal-400">No reviews found</div>
        ) : items.map((r) => (
          <div key={r._id} className="bg-white border border-stone-200 p-5 hover:border-stone-300 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <StarRow rating={r.rating} />
                  <span className="text-[10px] text-charcoal-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }) : ""}
                  </span>
                </div>

                {/* Review content */}
                {r.title && (
                  <p className="text-[14px] text-charcoal-800 font-medium mb-1">{r.title}</p>
                )}
                {r.text && (
                  <p className="text-[13px] text-charcoal-600 leading-relaxed mb-3">{r.text}</p>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-charcoal-400">
                  <span>By: <span className="text-charcoal-600">{r.customer?.name || r.customer?.email || "Anonymous"}</span></span>
                  {r.product && (
                    <span>Product: <span className="text-charcoal-600">{r.product.name || r.product._id || ","}</span></span>
                  )}
                  {r.verifiedPurchase && (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <span className="text-[9px]">●</span> Verified Purchase
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <button onClick={() => handleDelete(r._id)}
                className="shrink-0 px-3 py-1.5 text-[10px] uppercase tracking-wider text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ───────────────────────────────── */}
      {pg.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-charcoal-400">
            Page {pg.page} of {pg.totalPages}
          </p>
          <div className="flex gap-1.5">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-[11px] border border-stone-200 bg-white text-charcoal-500 hover:border-charcoal-400 disabled:opacity-30 transition-colors">
              Prev
            </button>
            <button onClick={() => setPage(Math.min(pg.totalPages, page + 1))} disabled={page >= pg.totalPages}
              className="px-3 py-1.5 text-[11px] border border-stone-200 bg-white text-charcoal-500 hover:border-charcoal-400 disabled:opacity-30 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
