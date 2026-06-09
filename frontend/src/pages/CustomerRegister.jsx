import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { customerRegister, clearError } from "../store/userSlice";

export default function CustomerRegister() {
  const [name, setName] = useState("");
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
    dispatch(customerRegister({ name, email, password }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl text-charcoal-900">Adorzia</Link>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-bronze-500 mb-2">Customer Portal</p>
            <h1 className="font-serif text-3xl text-charcoal-900">Create your account</h1>
            <p className="mt-2 text-sm text-charcoal-400">Discover Pakistan's finest fashion designers</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="bg-stone-50 border border-stone-200 text-charcoal-800 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal-400 mb-2">Full Name</label>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 text-charcoal-900 text-sm bg-white focus:outline-none focus:border-bronze-500 transition-colors"
              placeholder="Your full name"
            />
          </div>

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
              type="password" required minLength={8} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 text-charcoal-900 text-sm bg-white focus:outline-none focus:border-bronze-500 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 text-sm text-charcoal-500">
            <p className="font-medium text-charcoal-900 mb-1">By joining Adorzia</p>
            <ul className="space-y-1 text-xs">
              <li>✓ Access exclusive designer collections</li>
              <li>✓ Save favourites and create wishlists</li>
              <li>✓ Track orders and receive updates</li>
            </ul>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-charcoal-900 text-white py-3 text-sm uppercase tracking-wider hover:bg-charcoal-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-charcoal-400">
            Already have an account?{" "}
            <Link to="/customer/login" className="text-charcoal-900 hover:text-bronze-500 transition-colors font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-charcoal-300">
            Are you a designer?{" "}
            <Link to="/designer/register" className="text-charcoal-500 hover:text-bronze-500 transition-colors">
              Apply as a Designer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
