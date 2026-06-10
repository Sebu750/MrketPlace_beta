import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomerOrders } from "../store/customerSlice";
import API from "../services/api";

export default function CustomerReviews() {
  const { orders } = useSelector((s) => s.customer);
  const dispatch = useDispatch();
  const [reviewing, setReviewing] = useState(null);
  const [form, setForm] = useState({ rating: 5, title: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    dispatch(fetchCustomerOrders({ status: "delivered", limit: 50 }));
  }, [dispatch]);

  const deliveredOrders = (orders.items || []).filter((o) => o.status === "delivered");

  const handleReview = async (productId, designerId) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await API.post(`/reviews/products/${productId}/reviews`, {
        rating: form.rating,
        title: form.title,
        text: form.text,
        designer: designerId,
      });
      setSubmitted((p) => ({ ...p, [productId]: true }));
      setReviewing(null);
      setForm({ rating: 5, title: "", text: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (deliveredOrders.length === 0 && !orders.loading) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-charcoal-900 mb-2">No Reviews Yet</p>
        <p className="text-sm text-charcoal-400 mb-6">Once your orders are delivered, you can leave reviews here.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-charcoal-400">
        Share your experience — leave reviews for delivered orders
      </p>

      {orders.loading ? (
        <div className="py-12 text-center text-sm text-charcoal-400">Loading orders…</div>
      ) : (
        <div className="space-y-4">
          {deliveredOrders.map((order) =>
            (order.items || []).map((item, idx) => {
              const key = `${order._id}-${item.product}`;
              const isReviewing = reviewing === key;
              const isSubmitted = submitted[item.product];

              return (
                <div key={key} className="border border-stone-200">
                  <div className="px-5 py-4 flex items-center gap-4">
                    {item.image && (
                      <img src={item.image} alt="" className="w-14 h-14 object-cover bg-stone-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal-900">{item.name}</p>
                      <p className="text-[11px] text-charcoal-400 mt-0.5">
                        {order.orderNumber} · Delivered {new Date(order.updatedAt || order.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isSubmitted ? (
                        <span className="text-[10px] uppercase tracking-[0.15em] bg-emerald-50 text-emerald-700 px-2.5 py-1">Review Submitted</span>
                      ) : (
                        <button
                          onClick={() => isReviewing ? setReviewing(null) : setReviewing(key)}
                          className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] border border-stone-300 text-charcoal-500 hover:text-charcoal-900 hover:border-charcoal-400 transition-colors"
                        >
                          {isReviewing ? "Cancel" : "Write Review"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review form */}
                  {isReviewing && (
                    <div className="px-5 pb-5 border-t border-stone-100 pt-4 space-y-4">
                      {/* Star rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setForm((p) => ({ ...p, rating: star }))}
                            className={`text-xl transition-colors ${star <= form.rating ? "text-amber-500" : "text-stone-300"}`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-[11px] text-charcoal-400">{form.rating} out of 5</span>
                      </div>

                      <input
                        placeholder="Review title (optional)"
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none"
                      />
                      <textarea
                        placeholder="Share your thoughts about this piece…"
                        rows={3}
                        value={form.text}
                        onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none resize-none"
                      />
                      <button
                        onClick={() => handleReview(item.product, order.designer?._id || order.designer)}
                        disabled={submitting}
                        className="px-5 py-2 text-[11px] uppercase tracking-[0.15em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors disabled:opacity-50"
                      >
                        {submitting ? "Submitting…" : "Submit Review"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
