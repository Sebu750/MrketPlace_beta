import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../store/userSlice";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else if (user.role === "seller") navigate("/designer-dashboard", { replace: true });
      else navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password, role }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl text-noir-900">Adorzia</Link>
          <h1 className="mt-6 font-serif text-3xl text-noir-900">Create account</h1>
          <p className="mt-2 text-sm text-noir-500">Join Pakistan's premier fashion marketplace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-500 mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`px-4 py-3 border text-sm transition-colors ${
                  role === "buyer"
                    ? "border-noir-900 bg-noir-900 text-white"
                    : "border-noir-200 text-noir-600 hover:border-noir-400"
                }`}
              >
                Customer
                <p className="text-xs mt-1 opacity-70">Shop collections</p>
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`px-4 py-3 border text-sm transition-colors ${
                  role === "seller"
                    ? "border-noir-900 bg-noir-900 text-white"
                    : "border-noir-200 text-noir-600 hover:border-noir-400"
                }`}
              >
                Designer / Brand
                <p className="text-xs mt-1 opacity-70">Sell your work</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-noir-500 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-noir-200 text-noir-900 text-sm focus:outline-none focus:border-noir-900 transition-colors"
              placeholder="Your full name"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-noir-200 text-noir-900 text-sm focus:outline-none focus:border-noir-900 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          {role === "seller" && (
            <div className="bg-stone-50 border border-noir-100 p-4 text-sm text-noir-600">
              <p className="font-medium text-noir-900 mb-1">Designer Application</p>
              <p>After registration, you'll be directed to complete your designer profile and submit your first collection for review.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-noir-500">
            Already have an account?{" "}
            <Link to="/login" className="text-noir-900 hover:text-gold-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
