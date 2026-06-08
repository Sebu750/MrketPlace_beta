import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const navItems = [
  { label: "Overview", icon: "□" },
  { label: "Collections", icon: "◈" },
  { label: "Orders", icon: "⊞" },
  { label: "Analytics", icon: "◐" },
  { label: "Payouts", icon: "◇" },
  { label: "Studio", icon: "⌂" },
  { label: "Profile Settings", icon: "⚙" },
];

const collections = [
  { name: "Geometry of Home", pieces: 6, status: "Published", sales: 12, revenue: "PKR 576,000" },
  { name: "Threads of the Indus", pieces: 4, status: "In Review", sales: 0, revenue: "—" },
];

const recentOrders = [
  { id: "AD-2026-4821", date: "Jun 3, 2026", item: "Ajrak Architect Coat", customer: "Sarah K.", status: "In Production", total: "PKR 48,000" },
  { id: "AD-2026-4798", date: "May 28, 2026", item: "Phulkari Reborn Blazer", customer: "Amir R.", status: "To Ship", total: "PKR 42,000" },
  { id: "AD-2026-4756", date: "May 22, 2026", item: "Khaddar Modern Suit", customer: "Fatima S.", status: "Delivered", total: "PKR 36,500" },
];

export default function DesignerDashboard() {
  const { data: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-noir-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl text-noir-900">Adorzia</Link>
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-wider text-gold-500 border border-gold-500/30 px-2 py-0.5">Designer</span>
            <span className="text-sm text-noir-500">{user?.name}</span>
            <button
              onClick={() => dispatch(logout())}
              className="text-xs uppercase tracking-wider text-noir-500 hover:text-noir-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <p className="text-xs uppercase tracking-wider text-noir-400 mb-4">Designer Panel</p>
            <nav className="space-y-1">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    i === 0
                      ? "bg-noir-900 text-white"
                      : "text-noir-600 hover:bg-stone-50 hover:text-noir-900"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Studio info */}
            <div className="mt-8 p-4 bg-stone-50 border border-noir-100">
              <p className="text-xs uppercase tracking-wider text-noir-400 mb-2">Your Studio</p>
              <p className="font-serif text-lg text-noir-900">Adorzia Lahore</p>
              <p className="text-sm text-noir-500 mt-1">Coworking space assigned</p>
              <Link to="/studios" className="text-xs text-gold-500 hover:text-gold-600 mt-2 inline-block">
                Manage studio →
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            {/* Welcome */}
            <div className="mb-10">
              <h1 className="font-serif text-3xl text-noir-900">
                Hello, <span className="text-gold-500">{user?.name?.split(" ")[0]}</span>
              </h1>
              <p className="mt-2 text-sm text-noir-500">Manage your collections, orders, and grow your brand on Adorzia.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Collections", value: "2", sub: "1 in review" },
                { label: "Pieces Sold", value: "12", sub: "this month" },
                { label: "Revenue", value: "PKR 576K", sub: "total to date" },
                { label: "Following", value: "234", sub: "customers" },
              ].map((stat, i) => (
                <div key={i} className="border border-noir-100 p-5">
                  <p className="text-xs uppercase tracking-wider text-noir-400 mb-2">{stat.label}</p>
                  <p className="font-serif text-2xl text-noir-900">{stat.value}</p>
                  <p className="text-xs text-noir-400 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Collections */}
            <div className="border border-noir-100 mb-8">
              <div className="px-6 py-4 border-b border-noir-100 flex items-center justify-between">
                <h2 className="text-sm font-medium text-noir-900">Your Collections</h2>
                <button className="text-xs bg-noir-900 text-white px-3 py-1.5 hover:bg-noir-800 transition-colors">
                  + New Collection
                </button>
              </div>
              <div className="divide-y divide-noir-100">
                {collections.map((col, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-noir-900">{col.name}</p>
                      <p className="text-xs text-noir-400 mt-0.5">
                        {col.pieces} pieces · {col.sales} sales · {col.revenue}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 ${
                      col.status === "Published"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      {col.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="border border-noir-100 mb-8">
              <div className="px-6 py-4 border-b border-noir-100 flex items-center justify-between">
                <h2 className="text-sm font-medium text-noir-900">Recent Orders</h2>
                <Link to="/designer-orders" className="text-xs text-noir-500 hover:text-noir-900 transition-colors">View All</Link>
              </div>
              <div className="divide-y divide-noir-100">
                {recentOrders.map((order, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-noir-900">{order.item}</p>
                      <p className="text-xs text-noir-400 mt-0.5">
                        {order.id} · {order.date} · {order.customer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-noir-900">{order.total}</p>
                      <span className={`text-xs mt-0.5 inline-block px-2 py-0.5 ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-600"
                          : order.status === "To Ship"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="border border-noir-100 p-6 hover:border-noir-300 transition-colors text-left group">
                <p className="text-xs uppercase tracking-wider text-noir-400 mb-2">Create</p>
                <p className="font-serif text-lg text-noir-900 group-hover:text-gold-500 transition-colors">New Collection</p>
                <p className="text-sm text-noir-500 mt-1">Upload pieces and launch your next collection</p>
              </button>
              <button className="border border-noir-100 p-6 hover:border-noir-300 transition-colors text-left group">
                <p className="text-xs uppercase tracking-wider text-noir-400 mb-2">Grow</p>
                <p className="font-serif text-lg text-noir-900 group-hover:text-gold-500 transition-colors">Apply for Spotlight</p>
                <p className="text-sm text-noir-500 mt-1">Get featured on the Adorzia homepage</p>
              </button>
              <button className="border border-noir-100 p-6 hover:border-noir-300 transition-colors text-left group">
                <p className="text-xs uppercase tracking-wider text-noir-400 mb-2">Connect</p>
                <p className="font-serif text-lg text-noir-900 group-hover:text-gold-500 transition-colors">Artisan Network</p>
                <p className="text-sm text-noir-500 mt-1">Find craft partners across Pakistan</p>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
