import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

/* ── Footer link columns ──────────────────────────────────────────── */
const footerLinks = {
  Marketplace: ["New In", "Collections", "Designers", "Best Sellers", "Sale"],
  Craft: ["Ajrak", "Phulkari", "Pashmina", "Khaddar", "Mirror Work"],
  Platform: ["How It Works", "Designer Spotlight", "Studios", "Apply"],
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
const IconChevron = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="m6 9 6 6 6-6"/></svg>;
const IconPayment = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;

/* ── Nav data ──────────────────────────────────────────────────────── */
const leftNav = [
  { label: "New In", to: "/products?sort=newest" },
  { label: "Collections", to: "/collections" },
  { label: "Designers", to: "/designers" },
  { label: "Craft Heritage", to: "/craft" },
  { label: "Sale", to: "/products?sale=true" },
];

/* ──────────────────────────────────────────────────────────────────── */
export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* ══════════════════════════════════════════════════════════════
          HEADER — cream, centered logo, gold hairline
      ═══════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream-100/97 backdrop-blur-md shadow-[0_1px_0_0_rgba(187,148,87,0.5)]"
            : "bg-cream-100 border-b border-gold-200/60"
        }`}
      >
        {/* Main nav row */}
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-noir-600">
            {leftNav.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-noir-900 transition-colors duration-300">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-1 text-noir-800">
            {mobileMenu ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>

          {/* Center logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl text-noir-900 tracking-tight">
            Adorzia
          </Link>

          {/* Right nav — icons */}
          <div className="flex items-center gap-4">
            <button className="text-noir-700 hover:text-noir-900 transition-colors" aria-label="Search">
              <IconSearch className="w-5 h-5" />
            </button>
            <button className="text-noir-700 hover:text-noir-900 transition-colors" aria-label="Wishlist">
              <IconHeart className="w-5 h-5" />
            </button>
            <button className="relative text-noir-700 hover:text-noir-900 transition-colors" aria-label="Bag">
              <IconBag className="w-5 h-5" />
            </button>

            {/* User / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-noir-800 hover:text-noir-900 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-gold-400 text-noir-950 text-[10px] font-semibold font-serif">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-3 w-52 bg-cream-50 border border-gold-200 shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-gold-200">
                        <p className="text-xs text-noir-900 font-medium">{user.name}</p>
                        <p className="text-[10px] text-noir-400 mt-0.5">{user.email}</p>
                        <span className="inline-block mt-1.5 text-[9px] uppercase tracking-[0.2em] bg-parchment-100 text-noir-600 px-2 py-0.5">
                          {user.role === "buyer" ? "Customer" : user.role === "seller" ? "Designer" : "Admin"}
                        </span>
                      </div>
                      <div className="py-2">
                        <Link to={dashboardPath(user.role)} onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-noir-700 hover:bg-parchment-100 transition-colors">
                          Dashboard
                        </Link>
                        <button onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs text-noir-500 hover:bg-parchment-100 transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-[11px] uppercase tracking-[0.18em] text-noir-800 hover:text-noir-900 transition-colors hidden sm:block">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile menu ────────────────────────────────────────── */}
        {mobileMenu && (
          <div className="lg:hidden bg-cream-100 border-t border-gold-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-1">
              {leftNav.map((l) => (
                <Link key={l.label} to={l.to} onClick={() => setMobileMenu(false)}
                  className="block text-[11px] uppercase tracking-[0.22em] text-noir-700 hover:text-noir-900 py-3 border-b border-gold-200/50 transition-colors">
                  {l.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-5 flex gap-3">
                  <Link to="/login" onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center text-[11px] uppercase tracking-[0.15em] bg-crimson-600 text-cream-50 py-3 hover:bg-crimson-700 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center text-[11px] uppercase tracking-[0.15em] border border-gold-400 py-3 hover:bg-parchment-100 transition-colors">
                    Register
                  </Link>
                </div>
              )}
              {user && (
                <Link to={dashboardPath(user.role)} onClick={() => setMobileMenu(false)}
                  className="block text-[11px] uppercase tracking-[0.22em] text-noir-700 py-3 border-b border-gold-200/50 transition-colors">
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
          FOOTER — warm cream, luxury magazine feel
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-parchment-100 border-t border-gold-300">
        {/* Gold hairline top */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

        {/* Top section */}
        <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <span className="font-serif text-2xl text-noir-900">Adorzia</span>
              <p className="mt-4 text-sm text-noir-500 leading-relaxed max-w-xs">
                Pakistan's first luxury fashion marketplace — bridging heritage craft with global contemporary design.
              </p>
              {/* Social icons */}
              <div className="mt-8 flex gap-3">
                {["Instagram", "Pinterest", "LinkedIn", "Twitter"].map((s) => (
                  <a key={s} href={`#${s.toLowerCase()}`}
                    className="w-9 h-9 flex items-center justify-center border border-gold-300 text-noir-500 text-[10px] uppercase tracking-wider hover:border-gold-500 hover:text-noir-900 transition-colors duration-300"
                    aria-label={s}>
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="lg:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-noir-400 mb-5">{heading}</p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-noir-500 hover:text-noir-900 transition-colors duration-300">
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
        <div className="border-t border-gold-200">
          <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-noir-500">
              &copy; {new Date().getFullYear()} Adorzia. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <IconPayment className="w-5 h-5 text-noir-400" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-noir-500">PKR · USD · GBP · EUR</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-noir-500">
              Karachi · Lahore · Islamabad
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
