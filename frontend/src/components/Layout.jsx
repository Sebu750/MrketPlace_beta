import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { toggleCart, selectCartCount } from "../store/cartSlice";
import CartDrawer from "./CartDrawer";

/* ── Footer link columns ──────────────────────────────────────────── */
const footerLinks = {
  Marketplace: ["New In", "Collections", "Designers", "Shop"],
  Craft: ["Ajrak", "Chikankari", "Pashmina", "Handloom", "Mirror Work"],
  Platform: ["How It Works", "Designer Apply", "Editorial", "Crafts Archive"],
  Support: ["Contact", "Shipping & Returns", "Size Guide", "Care Guide"],
};

/* ── Helpers ───────────────────────────────────────────────────────── */
const dashboardPath = (role) => {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/designer-dashboard";
  return "/dashboard";
};

/* ── Tabler-style outline icons ────────────────────────────────────── */
const IconSearch = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
const IconHeart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21C12 21 3 13.5 3 8.5 3 5.42 5.42 3 8.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0 1 15.5 3C18.58 3 21 5.42 21 8.5 21 13.5 12 21 12 21z"/></svg>;
const IconBag = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8h12l-1.5 12H7.5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>;
const IconMenu = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;

/* ── Nav data ──────────────────────────────────────────────────────── */
const leftNav = [
  { label: "Collections", to: "/collections" },
  { label: "Designers", to: "/designers" },
  { label: "Shop", to: "/shop" },
  { label: "Craft Heritage", to: "/crafts" },
  { label: "Editorial", to: "/editorial" },
];

/* ──────────────────────────────────────────────────────────────────── */
export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: user } = useSelector((state) => state.user);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileMenu(false); }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ══════════════════════════════════════════════════════════════
          HEADER — Ultra-minimal, pure white, editorial
      ═══════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/97 backdrop-blur-md border-b border-stone-200/60"
            : "bg-white border-b border-stone-100"
        }`}
      >
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] text-charcoal-500">
            {leftNav.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-charcoal-900 transition-colors duration-500">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-1 text-charcoal-800">
            {mobileMenu ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>

          {/* Center logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-[26px] text-charcoal-900 tracking-[0.02em] font-light">
            Adorzia
          </Link>

          {/* Right nav — icons */}
          <div className="flex items-center gap-5">
            <button className="text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500" aria-label="Search">
              <IconSearch className="w-[18px] h-[18px]" />
            </button>
            <button className="hidden sm:block text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500" aria-label="Wishlist">
              <IconHeart className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500"
              aria-label={`Shopping bag — ${cartCount} items`}
            >
              <IconBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-charcoal-900 text-white text-[9px] font-medium px-1 tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-charcoal-800 hover:text-charcoal-900 transition-colors"
                >
                  <span className="w-7 h-7 flex items-center justify-center bg-charcoal-900 text-white text-[10px] font-medium font-sans">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-stone-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)] z-50">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-xs text-charcoal-900 font-medium">{user.name}</p>
                        <p className="text-[10px] text-charcoal-400 mt-0.5">{user.email}</p>
                        <span className="inline-block mt-1.5 text-[9px] uppercase tracking-[0.2em] text-charcoal-500 bg-stone-50 px-2 py-0.5">
                          {user.role === "buyer" ? "Customer" : user.role === "seller" ? "Designer" : "Admin"}
                        </span>
                      </div>
                      <div className="py-2">
                        <Link to={dashboardPath(user.role)} onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-charcoal-700 hover:bg-stone-50 transition-colors">
                          Dashboard
                        </Link>
                        <button onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs text-charcoal-400 hover:bg-stone-50 transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/customer/login" className="text-[10px] uppercase tracking-[0.2em] text-charcoal-700 hover:text-charcoal-900 transition-colors duration-500 hidden sm:block">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile menu ────────────────────────────────────────── */}
        {mobileMenu && (
          <div className="lg:hidden bg-white border-t border-stone-100">
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-1">
              {leftNav.map((l) => (
                <Link key={l.label} to={l.to} onClick={() => setMobileMenu(false)}
                  className="block text-[10px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 py-3 border-b border-stone-100 transition-colors">
                  {l.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-5 flex gap-3">
                  <Link to="/customer/login" onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white py-3 hover:bg-charcoal-800 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/customer/register" onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center text-[10px] uppercase tracking-[0.18em] border border-charcoal-300 py-3 hover:bg-stone-50 transition-colors">
                    Register
                  </Link>
                </div>
              )}
              {user && (
                <Link to={dashboardPath(user.role)} onClick={() => setMobileMenu(false)}
                  className="block text-[10px] uppercase tracking-[0.25em] text-charcoal-700 py-3 border-b border-stone-100 transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER — Architectural, magazine-style, minimal
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-stone-50 border-t border-stone-200">
        {/* Top section */}
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 pt-20 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <span className="font-serif text-[28px] text-charcoal-900 font-light tracking-[0.02em]">Adorzia</span>
              <p className="mt-5 text-[13px] text-charcoal-500 leading-[1.8] max-w-xs font-light">
                Pakistan's first luxury fashion marketplace — bridging heritage craft with global contemporary design.
              </p>
              {/* Social icons */}
              <div className="mt-8 flex gap-3">
                {["Instagram", "Pinterest", "LinkedIn", "Twitter"].map((s) => (
                  <a key={s} href={`#${s.toLowerCase()}`}
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 text-charcoal-400 text-[10px] uppercase tracking-wider hover:border-charcoal-400 hover:text-charcoal-900 transition-colors duration-500"
                    aria-label={s}>
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="lg:col-span-2">
                <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-5 font-medium">{heading}</p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-[13px] text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500 font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-200">
          <div className="max-w-[1520px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-charcoal-400 font-light tracking-wide">
              &copy; {new Date().getFullYear()} Adorzia. All rights reserved.
            </p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal-400 font-light">
              Karachi · Lahore · Islamabad · Worldwide
            </p>
          </div>
        </div>
      </footer>
      {/* ── Cart Drawer ─────────────────────────────────────────── */}
      <CartDrawer />
    </div>
  );
}
