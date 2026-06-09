import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin, clearError } from "../store/userSlice";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user, loading, error } = useSelector((s) => s.user);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true }); // non-admins bounced home
    }
  }, [user, navigate]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }));
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl text-white">Adorzia</Link>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-charcoal-400 mb-2">Restricted Access</p>
            <h1 className="font-serif text-3xl text-white">Admin Panel</h1>
            <p className="mt-2 text-sm text-stone-500">Authorised personnel only</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="bg-charcoal-900/40 border border-charcoal-800 text-charcoal-300 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Admin Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-charcoal-700 bg-charcoal-800 text-white text-sm focus:outline-none focus:border-charcoal-500 transition-colors"
              placeholder="admin@adorzia.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-charcoal-700 bg-charcoal-800 text-white text-sm focus:outline-none focus:border-charcoal-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-charcoal-700 text-white py-3 text-sm uppercase tracking-wider font-medium hover:bg-charcoal-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Panel"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-charcoal-800 text-center">
          <p className="text-xs text-stone-400">
            Not an admin?{" "}
            <Link to="/" className="text-stone-400 hover:text-ivory-200 transition-colors">
              Return to marketplace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
