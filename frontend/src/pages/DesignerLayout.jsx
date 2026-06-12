import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { logout } from "../store/userSlice";

/* ── SVG Icons (Tabler outline style) ──────────────────────────────── */
const IconHome = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"/></svg>;
const IconGrid = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconBag = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8h12l-1.5 12H7.5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>;
const IconChart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 5-6"/></svg>;
const IconWallet = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-2H9a2 2 0 01-2-2v-1"/><path d="M14 3v4a1 1 0 01-1 1H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-1"/></svg>;
const IconSettings = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const IconBell = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IconLogout = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconMenu = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconExternal = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>;
const IconStar = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>;

/* ── Navigation items ──────────────────────────────────────────────── */
const navItems = [
  { label: "Overview", to: "", icon: IconHome, end: true },
  { label: "Products", to: "products", icon: IconGrid },
  { label: "Collections", to: "collections", icon: IconGrid },
  { label: "Orders", to: "orders", icon: IconBag },
  { label: "Analytics", to: "analytics", icon: IconChart },
  { label: "Payouts", to: "payouts", icon: IconWallet },
  { label: "Profile Settings", to: "settings", icon: IconSettings },
];

/* ── Page title map ────────────────────────────────────────────────── */
const pageTitles = {
  "": "Overview",
  "products": "Products",
  "products/new": "New Product",
  "collections": "Collections",
  "collections/new": "New Collection",
  "orders": "Orders",
  "analytics": "Analytics",
  "payouts": "Payouts",
  "settings": "Profile Settings",
};

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerLayout() {
  const { data: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  /* Auto-close sidebar on route change */
  useEffect(() => { setMobileNav(false); }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  /* Derive current page segment */
  const pathSegments = location.pathname.replace("/designer-dashboard/", "").replace("/designer-dashboard", "");
  const pageTitle = pageTitles[pathSegments] || "Dashboard";

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 md:py-2.5 text-[13px] tracking-wide transition-all duration-300 ${
      isActive
        ? "bg-white/10 text-white border-l-2 border-bronze-400"
        : "text-charcoal-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
    }`;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* ════════════════════════════════════════════════════════════
          SIDEBAR , Dark charcoal, luxury editorial
      ═════════════════════════════════════════════════════════════ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-charcoal-950 flex flex-col transition-transform duration-500 lg:translate-x-0 pt-[var(--sat)] pb-[var(--sab)] ${
        mobileNav ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand */}
        <div className="px-6 py-6 border-b border-charcoal-800">
          <Link to="/" className="font-serif text-[22px] text-white tracking-[0.02em] font-light">
            Adorzia
          </Link>
          <p className="text-[9px] uppercase tracking-[0.3em] text-bronze-400 mt-1">Designer Studio</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <p className="px-6 text-[9px] uppercase tracking-[0.3em] text-charcoal-600 mb-3">Navigation</p>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to || "."}
              end={item.end}
              onClick={() => setMobileNav(false)}
              className={linkClass}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {item.label}
            </NavLink>
          ))}

          {/* External links */}
          <div className="pt-6 mt-6 border-t border-charcoal-800">
            <p className="px-6 text-[9px] uppercase tracking-[0.3em] text-charcoal-600 mb-3">Quick Actions</p>
            <NavLink
              to="collections/new"
              onClick={() => setMobileNav(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-[13px] tracking-wide transition-all duration-300 ${
                  isActive ? "bg-white/10 text-white" : "text-bronze-400 hover:text-bronze-300 hover:bg-white/5"
                }`
              }
            >
              <IconPlus className="w-[18px] h-[18px] shrink-0" />
              New Collection
            </NavLink>
            <Link
              to="/designer/plans"
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-charcoal-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <IconStar className="w-[18px] h-[18px] shrink-0" />
              Plans & Pricing
            </Link>
          </div>
        </nav>

        {/* User panel at bottom */}
        <div className="border-t border-charcoal-800 px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 flex items-center justify-center bg-bronze-600 text-charcoal-900 text-xs font-semibold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "D"}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{user?.name || "Designer"}</p>
              <p className="text-[10px] text-charcoal-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal-500 hover:text-white transition-colors duration-300"
          >
            <IconLogout className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile nav overlay ─────────────────────────────────── */}
      {mobileNav && (
        <div className="fixed inset-0 bg-charcoal-950/60 z-40 lg:hidden animate-fade-in" onClick={() => setMobileNav(false)} />
      )}

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ═════════════════════════════════════════════════════════════ */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* ── Top Bar ──────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200">
          <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="lg:hidden p-2.5 text-charcoal-500 hover:text-charcoal-900 transition-colors"
              >
                {mobileNav ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
              </button>

              {/* Page title */}
              <h1 className="font-serif text-xl md:text-2xl text-charcoal-900 font-light">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* View storefront */}
              <Link
                to={`/${user?.slug || user?.name?.toLowerCase().replace(/\s+/g, "-") || ""}`}
                className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors duration-300"
              >
                <IconExternal className="w-3.5 h-3.5" />
                View Storefront
              </Link>

              {/* Notifications */}
              <button className="relative p-1.5 text-charcoal-400 hover:text-charcoal-900 transition-colors duration-300" aria-label="Notifications">
                <IconBell className="w-[18px] h-[18px]" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-bronze-500 rounded-full" />
              </button>

              {/* Plan badge */}
              <span className="hidden md:inline-flex text-[9px] uppercase tracking-[0.2em] text-bronze-600 border border-bronze-200 px-2.5 py-1 bg-bronze-50/50">
                Pro Plan
              </span>
            </div>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────── */}
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
