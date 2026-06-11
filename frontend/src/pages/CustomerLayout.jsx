import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../store/userSlice";

/* ── SVG Icons (Tabler outline style) ──────────────────────────────── */
const IconHome = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"/></svg>;
const IconBag = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8h12l-1.5 12H7.5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>;
const IconHeart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IconMapPin = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconStar = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconUser = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconLogout = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconMenu = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconBell = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IconShoppingBag = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;

/* ── Navigation items ──────────────────────────────────────────────── */
const navItems = [
  { label: "Overview", to: "", icon: IconHome, end: true },
  { label: "My Orders", to: "orders", icon: IconBag },
  { label: "Wishlist", to: "wishlist", icon: IconHeart },
  { label: "Addresses", to: "addresses", icon: IconMapPin },
  { label: "Reviews", to: "reviews", icon: IconStar },
  { label: "Account", to: "settings", icon: IconUser },
];

/* ── Page title map ────────────────────────────────────────────────── */
const pageTitles = {
  "": "Overview",
  "orders": "My Orders",
  "wishlist": "Wishlist",
  "addresses": "Address Book",
  "reviews": "My Reviews",
  "settings": "Account Settings",
};

/* ───────────────────────────────────────────────────────────────────── */
export default function CustomerLayout() {
  const { data: user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const pathSegments = location.pathname.replace("/dashboard/", "").replace("/dashboard", "");
  const pageTitle = pageTitles[pathSegments] || "My Account";

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-2.5 text-[13px] tracking-wide transition-all duration-200 ${
      isActive
        ? "bg-charcoal-900 text-white"
        : "text-charcoal-500 hover:text-charcoal-900 hover:bg-stone-100"
    }`;

  return (
    <div className="min-h-screen bg-white flex">
      {/* ════════════════════════════════════════════════════════════
          SIDEBAR , Cream/warm white, editorial luxury
      ═════════════════════════════════════════════════════════════ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-stone-50 border-r border-stone-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        mobileNav ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand */}
        <div className="px-6 py-6 border-b border-stone-200">
          <Link to="/" className="font-serif text-[22px] text-charcoal-900 tracking-[0.02em] font-light">
            Adorzia
          </Link>
          <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mt-1">My Account</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <p className="px-6 text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-4">Navigation</p>
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to || "."}
                end={item.end}
                onClick={() => setMobileNav(false)}
                className={linkClass}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.label === "Wishlist" && wishlist.length > 0 && (
                  <span className="text-[10px] text-charcoal-400">{wishlist.length}</span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Quick links */}
          <div className="mt-8 pt-6 border-t border-stone-200 mx-6">
            <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-3">Explore</p>
            <Link
              to="/products"
              className="flex items-center gap-2 text-[12px] text-charcoal-500 hover:text-charcoal-900 py-1.5 transition-colors"
            >
              <IconShoppingBag className="w-4 h-4" />
              Browse Products
            </Link>
            <Link
              to="/designers"
              className="flex items-center gap-2 text-[12px] text-charcoal-500 hover:text-charcoal-900 py-1.5 transition-colors"
            >
              <IconUser className="w-4 h-4" />
              Discover Designers
            </Link>
          </div>
        </nav>

        {/* User panel */}
        <div className="border-t border-stone-200 px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 flex items-center justify-center bg-charcoal-900 text-white text-xs font-semibold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "C"}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-charcoal-900 truncate">{user?.name || "Customer"}</p>
              <p className="text-[10px] text-charcoal-400 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors duration-200"
          >
            <IconLogout className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay ──────────────────────────────────────── */}
      {mobileNav && (
        <div className="fixed inset-0 bg-charcoal-950/30 z-40 lg:hidden" onClick={() => setMobileNav(false)} />
      )}

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT
      ═════════════════════════════════════════════════════════════ */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* ── Top Bar ──────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100">
          <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="lg:hidden p-1.5 text-charcoal-500 hover:text-charcoal-900 transition-colors"
              >
                {mobileNav ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
              </button>
              <h1 className="font-serif text-xl md:text-2xl text-charcoal-900 font-light">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-5">
              <Link
                to="/products"
                className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors"
              >
                Continue Shopping
              </Link>
              <button className="relative p-1.5 text-charcoal-400 hover:text-charcoal-900 transition-colors" aria-label="Notifications">
                <IconBell className="w-[18px] h-[18px]" />
              </button>
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
