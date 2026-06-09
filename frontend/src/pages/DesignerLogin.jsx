import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { designerLogin, clearError } from "../store/userSlice";

export default function DesignerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user, loading, error } = useSelector((s) => s.user);

  useEffect(() => {
    if (user) navigate("/designer-dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(designerLogin({ email, password }));
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl text-white">Adorzia</Link>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-bronze-400 mb-2">Designer Portal</p>
            <h1 className="font-serif text-3xl text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-ivory-300">Manage your collections and storefront</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="bg-charcoal-900/40 border border-charcoal-800 text-charcoal-300 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-charcoal-700 bg-charcoal-800 text-white text-sm focus:outline-none focus:border-bronze-400 transition-colors"
              placeholder="designer@email.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-charcoal-700 bg-charcoal-800 text-white text-sm focus:outline-none focus:border-bronze-400 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-bronze-600 text-charcoal-900 py-3 text-sm uppercase tracking-wider font-medium hover:bg-bronze-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to Studio"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-stone-400">
            New to Adorzia?{" "}
            <Link to="/designer/register" className="text-bronze-400 hover:text-bronze-300 transition-colors font-medium">
              Apply as a Designer
            </Link>
          </p>
          <p className="text-xs text-stone-500">
            Looking to shop?{" "}
            <Link to="/customer/login" className="text-stone-400 hover:text-bronze-400 transition-colors">
              Customer Portal
            </Link>
            <span className="mx-2 text-stone-500">·</span>
            <Link to="/designer/plans" className="text-stone-400 hover:text-bronze-400 transition-colors">
              View Plans
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
