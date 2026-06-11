import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { toggleCart, selectCartCount } from "../store/cartSlice";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import PageTransition from "./PageTransition";

/* ── Social SVG icons ─────────────────────────────────────────────── */
const SocialInstagram = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>;
const SocialPinterest = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2C6.48 2 2 6.48 2 12c0 4.08 2.46 7.58 5.97 9.12-.08-.72-.16-1.83.03-2.62.17-.71 1.12-4.74 1.12-4.74s-.29-.57-.29-1.41c0-1.32.77-2.31 1.72-2.31.81 0 1.2.61 1.2 1.34 0 .81-.52 2.03-.79 3.16-.22.94.47 1.71 1.4 1.71 1.68 0 2.97-1.77 2.97-4.33 0-2.26-1.63-3.85-3.95-3.85-2.69 0-4.27 2.02-4.27 4.1 0 .81.31 1.69.71 2.16.08.09.09.18.07.27-.07.3-.24.94-.27 1.07-.04.17-.14.21-.32.13-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.34-5.81 3.33 0 5.92 2.37 5.92 5.54 0 3.31-2.08 5.97-4.97 5.97-.97 0-1.89-.51-2.2-1.11l-.6 2.28c-.22.84-.81 1.89-1.21 2.53.91.28 1.88.43 2.88.43 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>;
const SocialTwitter = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const SocialFacebook = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const SocialTikTok = (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .55.04.8.1V9.4a6.33 6.33 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.7 6.34 6.34 0 0 0 9.49 22a6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.84z"/></svg>;

const socialLinks = [
  { Icon: SocialInstagram, href: "https://instagram.com/adorzia", label: "Instagram" },
  { Icon: SocialPinterest, href: "https://pinterest.com/adorzia", label: "Pinterest" },
  { Icon: SocialTwitter, href: "https://x.com/adorzia", label: "X / Twitter" },
  { Icon: SocialTikTok, href: "https://tiktok.com/@adorzia", label: "TikTok" },
  { Icon: SocialFacebook, href: "https://facebook.com/adorzia", label: "Facebook" },
];

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

/* ── Icon for back-to-top ──────────────────────────────────────────── */
const IconArrowUp = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;

/* ──────────────────────────────────────────────────────────────────── */
export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const { data: user } = useSelector((state) => state.user);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setShowBackTop(y > 500);
      // Scroll progress
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (y / docH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileMenu(false); }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Skip to content ─────────────────────────────────────── */}
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      {/* ── Scroll progress bar ─────────────────────────────────── */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* ══════════════════════════════════════════════════════════════
          HEADER — Ultra-minimal, pure white, editorial + shrink on scroll
      ═══════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/97 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.04)]"
            : "bg-white border-b border-stone-100"
        }`}
      >
        <div className={`max-w-[1520px] mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] text-charcoal-500">
            {leftNav.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`underline-slide transition-colors duration-500 hover:text-charcoal-900 ${
                  location.pathname === l.to ? "text-charcoal-900" : ""
                }`}
              >
                {l.label}
                {location.pathname === l.to && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-bronze-400" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-1 text-charcoal-800">
            {mobileMenu ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>

          {/* Center logo */}
          <Link to="/" className={`absolute left-1/2 -translate-x-1/2 font-display text-charcoal-900 tracking-[0.04em] transition-all duration-500 ${scrolled ? "text-[24px]" : "text-[28px]"}`}>
            Adorzia
          </Link>

          {/* Right nav , icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500"
              aria-label="Search"
            >
              <IconSearch className="w-[18px] h-[18px]" />
            </button>
            <Link
              to={user?.role === "buyer" ? "/dashboard/wishlist" : "/customer/login"}
              className="hidden sm:flex text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500"
              aria-label="Wishlist"
            >
              <IconHeart className="w-[18px] h-[18px]" />
            </Link>
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500"
              aria-label={`Shopping bag , ${cartCount} items`}
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

        {/* ── Mobile menu — full-screen overlay ──────────────────── */}
        <div
          className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${
            mobileMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenu(false)}
          />
          {/* Panel */}
          <div
            className={`absolute inset-y-0 left-0 w-full max-w-sm bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mobileMenu ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100">
              <span className="font-display text-[22px] text-charcoal-900 tracking-[0.04em]">Adorzia</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="w-10 h-10 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors tap-scale"
                aria-label="Close menu"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links — staggered entrance */}
            <nav className="px-8 py-8 space-y-0">
              {leftNav.map((l, i) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMobileMenu(false)}
                  className="block text-[11px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 py-4 border-b border-stone-100 transition-all duration-500"
                  style={{
                    opacity: mobileMenu ? 1 : 0,
                    transform: mobileMenu ? "translateX(0)" : "translateX(-20px)",
                    transition: `opacity 0.4s ease ${0.1 + i * 0.06}s, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.06}s, color 0.3s ease`,
                  }}
                >
                  {l.label}
                </Link>
              ))}

              {/* Auth links */}
              {!user && (
                <div
                  className="pt-8 flex gap-3"
                  style={{
                    opacity: mobileMenu ? 1 : 0,
                    transition: `opacity 0.4s ease ${0.1 + leftNav.length * 0.06 + 0.1}s`,
                  }}
                >
                  <Link to="/customer/login" onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white py-3.5 hover:bg-charcoal-800 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/customer/register" onClick={() => setMobileMenu(false)}
                    className="flex-1 text-center text-[10px] uppercase tracking-[0.18em] border border-charcoal-300 py-3.5 hover:bg-stone-50 transition-colors">
                    Register
                  </Link>
                </div>
              )}
              {user && (
                <Link to={dashboardPath(user.role)} onClick={() => setMobileMenu(false)}
                  className="block text-[11px] uppercase tracking-[0.25em] text-charcoal-700 py-4 border-b border-stone-100 transition-colors"
                  style={{
                    opacity: mobileMenu ? 1 : 0,
                    transition: `opacity 0.4s ease ${0.1 + leftNav.length * 0.06 + 0.1}s`,
                  }}>
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Social icons at bottom */}
            <div
              className="absolute bottom-8 left-8 right-8 flex gap-3"
              style={{
                opacity: mobileMenu ? 1 : 0,
                transition: `opacity 0.4s ease ${0.1 + leftNav.length * 0.06 + 0.2}s`,
              }}
            >
              {socialLinks.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border border-stone-200 text-charcoal-400 hover:border-charcoal-400 hover:text-charcoal-900 transition-all duration-500 hover:-translate-y-0.5"
                  aria-label={label}>
                  <Icon className="w-[14px] h-[14px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER , Architectural, magazine-style, minimal
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-stone-50 border-t border-stone-200">
        {/* Top section */}
        <div className="max-w-[1520px] mx-auto px-6 lg:px-10 pt-20 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4 mb-10 lg:mb-0">
              <span className="font-display text-[30px] text-charcoal-900 tracking-[0.04em]">Adorzia</span>
              <p className="mt-5 text-[13px] text-charcoal-500 leading-[1.8] max-w-xs font-light">
                Pakistan's first luxury fashion marketplace — bridging heritage craft with global contemporary design.
              </p>
              {/* Social icons */}
              <div className="mt-8 flex gap-3">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 text-charcoal-400 hover:border-charcoal-400 hover:text-charcoal-900 transition-all duration-500 hover:-translate-y-0.5 hover:rotate-3"
                    aria-label={label}
                  >
                    <Icon className="w-[15px] h-[15px]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns — accordion on mobile, grid on desktop */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <details key={heading} className="lg:col-span-2 footer-accordion lg:[&:not(details)]" open>
                <summary className="lg:pointer-events-none">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-5 lg:mb-5 font-medium">{heading}</p>
                </summary>
                <ul className="space-y-3 pb-6 lg:pb-0">
                  {links.map((link) => (
                    <li key={link}>
                      <a href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-[13px] text-charcoal-500 hover:text-charcoal-900 transition-colors duration-500 font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
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
      {/* ── Back to top button ─────────────────────────────────────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`back-to-top transition-all duration-500 ${showBackTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <IconArrowUp className="w-4 h-4" />
      </button>
      {/* ── Cart Drawer ─────────────────────────────────────────── */}
      <CartDrawer />
      {/* ── Search Overlay ─────────────────────────────────────────── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
