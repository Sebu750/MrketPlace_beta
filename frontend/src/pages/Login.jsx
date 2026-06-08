import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearError } from "../store/userSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, loading, error } = useSelector((state) => state.user);

  const from = location.state?.from || null;

  useEffect(() => {
    if (user) {
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Role-based redirect
        if (user.role === "admin") navigate("/admin", { replace: true });
        else if (user.role === "seller") navigate("/designer-dashboard", { replace: true });
        else navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate, from]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl text-noir-900">Adorzia</Link>
          <h1 className="mt-6 font-serif text-3xl text-noir-900">Welcome back</h1>
          <p className="mt-2 text-sm text-noir-500">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-500 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-noir-200 text-noir-900 text-sm focus:outline-none focus:border-noir-900 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-500 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-noir-200 text-noir-900 text-sm focus:outline-none focus:border-noir-900 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-noir-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-noir-900 hover:text-gold-500 transition-colors">
              Create account
            </Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-10 pt-8 border-t border-noir-100">
          <p className="text-xs uppercase tracking-wider text-noir-400 mb-4">Demo Accounts</p>
          <div className="space-y-2 text-sm">
            <button
              onClick={() => { setEmail("customer@demo.com"); setPassword("password123"); }}
              className="w-full text-left px-4 py-2 border border-noir-100 hover:border-noir-300 transition-colors"
            >
              <span className="text-noir-900">Customer</span>
              <span className="text-noir-400 ml-2">customer@demo.com</span>
            </button>
            <button
              onClick={() => { setEmail("designer@demo.com"); setPassword("password123"); }}
              className="w-full text-left px-4 py-2 border border-noir-100 hover:border-noir-300 transition-colors"
            >
              <span className="text-noir-900">Designer</span>
              <span className="text-noir-400 ml-2">designer@demo.com</span>
            </button>
            <button
              onClick={() => { setEmail("admin@adorzia.com"); setPassword("password123"); }}
              className="w-full text-left px-4 py-2 border border-noir-100 hover:border-noir-300 transition-colors"
            >
              <span className="text-noir-900">Admin</span>
              <span className="text-noir-400 ml-2">admin@adorzia.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
