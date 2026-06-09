import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { customerLogin, clearError } from "../store/userSlice";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user, loading, error } = useSelector((s) => s.user);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(customerLogin({ email, password }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl text-charcoal-900">Adorzia</Link>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-bronze-500 mb-2">Customer Portal</p>
            <h1 className="font-serif text-3xl text-charcoal-900">Welcome back</h1>
            <p className="mt-2 text-sm text-charcoal-400">Sign in to browse and shop</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="bg-stone-50 border border-stone-200 text-charcoal-800 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-400 mb-2">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 text-charcoal-900 text-sm bg-white focus:outline-none focus:border-bronze-500 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-400 mb-2">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 text-charcoal-900 text-sm bg-white focus:outline-none focus:border-bronze-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-charcoal-900 text-white py-3 text-sm uppercase tracking-wider hover:bg-charcoal-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-charcoal-400">
            New to Adorzia?{" "}
            <Link to="/customer/register" className="text-charcoal-900 hover:text-bronze-500 transition-colors font-medium">
              Create a customer account
            </Link>
          </p>
          <p className="text-xs text-charcoal-300">
            Are you a designer?{" "}
            <Link to="/designer/login" className="text-charcoal-500 hover:text-bronze-500 transition-colors">
              Designer Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
