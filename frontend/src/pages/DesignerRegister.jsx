import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { designerRegister, clearError } from "../store/userSlice";

export default function DesignerRegister() {
  const [name, setName] = useState("");
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
    dispatch(designerRegister({ name, email, password }));
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl text-white">Adorzia</Link>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-bronze-400 mb-2">Designer Application</p>
            <h1 className="font-serif text-3xl text-white">Join our atelier</h1>
            <p className="mt-2 text-sm text-ivory-300">Showcase your craft to a global audience</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="bg-charcoal-900/40 border border-charcoal-800 text-charcoal-300 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2">Designer / Brand Name</label>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-charcoal-700 bg-charcoal-800 text-white text-sm focus:outline-none focus:border-bronze-400 transition-colors"
              placeholder="Your name or brand"
            />
          </div>

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
              type="password" required minLength={8} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-charcoal-700 bg-charcoal-800 text-white text-sm focus:outline-none focus:border-bronze-400 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="bg-charcoal-800 border border-charcoal-700 p-4 text-sm text-stone-400">
            <p className="font-medium text-ivory-200 mb-2">What happens next?</p>
            <ul className="space-y-1 text-xs">
              <li className="text-ivory-300">1. Complete your designer profile</li>
              <li className="text-ivory-300">2. Submit your first collection for review</li>
              <li className="text-ivory-300">3. Our curation team reviews within 48 hours</li>
              <li className="text-ivory-300">4. Once approved, your storefront goes live</li>
            </ul>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-bronze-600 text-charcoal-900 py-3 text-sm uppercase tracking-wider font-medium hover:bg-bronze-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting application..." : "Submit Application"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-stone-400">
            Already have a studio account?{" "}
            <Link to="/designer/login" className="text-bronze-400 hover:text-bronze-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-stone-500">
            Looking to shop?{" "}
            <Link to="/customer/login" className="text-stone-400 hover:text-bronze-400 transition-colors">
              Customer Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
