import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../store/userSlice";

/* ── SVG Icons ───────────────────────────────────────────── */
const IconHome = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"/></svg>;
const IconUsers = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const IconDesigners = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
const IconBag = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8h12l-1.5 12H7.5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>;
const IconGrid = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconWallet = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-2H9a2 2 0 01-2-2v-1"/><path d="M14 3v4a1 1 0 01-1 1H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-1"/></svg>;
const IconChart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 5-6"/></svg>;
const IconSettings = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const IconLogout = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconMenu = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconBox = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconStar = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>;

const navItems = [
  { label: "Overview", to: "", icon: IconHome, end: true },
  { label: "Users", to: "users", icon: IconUsers },
  { label: "Designers", to: "designers", icon: IconDesigners },
  { label: "Products", to: "products", icon: IconBox },
  { label: "Orders", to: "orders", icon: IconBag },
  { label: "Collections", to: "collections", icon: IconGrid },
  { label: "Payouts", to: "payouts", icon: IconWallet },
  { label: "Reports", to: "reports", icon: IconChart },
  { label: "Reviews", to: "reviews", icon: IconStar },
  { label: "Settings", to: "settings", icon: IconSettings },
];

const pageTitles = {
  "": "Platform Overview",
  users: "User Management",
  designers: "Designer Management",
  products: "Product Management",
  orders: "Order Management",
  collections: "Collection Management",
  payouts: "Payout Management",
  reports: "Reports & Analytics",
  reviews: "Review Management",
  settings: "Platform Settings",
};

export default function AdminLayout() {
  const { data: user } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate("/"); };

  const pathSeg = location.pathname.replace("/admin/", "").replace("/admin", "");
  const pageTitle = pageTitles[pathSeg] || "Dashboard";

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 text-[13px] tracking-wide transition-all duration-300 ${
      isActive
        ? "bg-white/10 text-white border-l-2 border-red-500"
        : "text-stone-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
    }`;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* ═══════ SIDEBAR ═══════ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-neutral-950 flex flex-col transition-transform duration-500 lg:translate-x-0 ${
        mobileNav ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand */}
        <div className="px-6 py-5 border-b border-neutral-800">
          <Link to="/" className="font-serif text-[20px] text-white tracking-[0.02em] font-light">Adorzia</Link>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-red-400">Admin Control</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 space-y-0.5 overflow-y-auto">
          <p className="px-6 text-[9px] uppercase tracking-[0.3em] text-neutral-600 mb-3">Management</p>
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to || "."} end={item.end}
              onClick={() => setMobileNav(false)} className={linkClass}>
              <item.icon className="w-[17px] h-[17px] shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 flex items-center justify-center bg-red-600 text-white text-xs font-semibold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-neutral-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors">
            <IconLogout className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileNav && (
        <div className="fixed inset-0 bg-neutral-950/60 z-40 lg:hidden" onClick={() => setMobileNav(false)} />
      )}

      {/* ═══════ MAIN ═══════ */}
      <div className="flex-1 lg:ml-[250px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200">
          <div className="px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileNav(!mobileNav)}
                className="lg:hidden p-1.5 text-charcoal-500 hover:text-charcoal-900 transition-colors">
                {mobileNav ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
              </button>
              <h1 className="font-serif text-xl md:text-2xl text-charcoal-900 font-light">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/"
                className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors">
                View Site
              </Link>
              <span className="text-[9px] uppercase tracking-[0.2em] text-red-600 border border-red-200 px-2.5 py-1 bg-red-50/50">
                Admin
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
