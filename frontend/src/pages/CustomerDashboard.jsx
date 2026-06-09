import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const navItems = [
  { label: "Overview", icon: "□" },
  { label: "Orders", icon: "◈" },
  { label: "Wishlist", icon: "♡" },
  { label: "Addresses", icon: "⌂" },
  { label: "Payment Methods", icon: "◇" },
  { label: "Account Settings", icon: "⚙" },
];

const recentOrders = [
  { id: "AD-2026-4821", date: "Jun 3, 2026", item: "Ajrak Architect Coat", designer: "Ayesha Siddiqui", status: "In Production", total: "PKR 48,000" },
  { id: "AD-2026-4798", date: "May 28, 2026", item: "Phulkari Reborn Blazer", designer: "Zara Hameed", status: "Shipped", total: "PKR 42,000" },
  { id: "AD-2026-4756", date: "May 22, 2026", item: "Pashmina Wrap Dress", designer: "Hira Khan", status: "Delivered", total: "PKR 52,000" },
];

export default function CustomerDashboard() {
  const { data: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl text-charcoal-900">Adorzia</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-charcoal-400">{user?.name}</span>
            <button
              onClick={() => dispatch(logout())}
              className="text-xs uppercase tracking-wider text-charcoal-400 hover:text-charcoal-900 transition-colors"
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
            <p className="text-xs uppercase tracking-wider text-charcoal-300 mb-4">My Account</p>
            <nav className="space-y-1">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    i === 0
                      ? "bg-charcoal-900 text-white"
                      : "text-charcoal-500 hover:bg-stone-50 hover:text-charcoal-900"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            {/* Welcome */}
            <div className="mb-10">
              <h1 className="font-serif text-3xl text-charcoal-900">
                Welcome back, <span className="text-bronze-500">{user?.name?.split(" ")[0]}</span>
              </h1>
              <p className="mt-2 text-sm text-charcoal-400">Manage your orders, wishlist, and account settings.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Orders", value: "3", sub: "2 in progress" },
                { label: "Wishlist", value: "12", sub: "pieces saved" },
                { label: "Following", value: "8", sub: "designers" },
                { label: "Points", value: "2,450", sub: "loyalty tier" },
              ].map((stat, i) => (
                <div key={i} className="border border-stone-100 p-5">
                  <p className="text-xs uppercase tracking-wider text-charcoal-300 mb-2">{stat.label}</p>
                  <p className="font-serif text-2xl text-charcoal-900">{stat.value}</p>
                  <p className="text-xs text-charcoal-300 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="border border-stone-100">
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-sm font-medium text-charcoal-900">Recent Orders</h2>
                <Link to="/orders" className="text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors">View All</Link>
              </div>
              <div className="divide-y divide-stone-100">
                {recentOrders.map((order, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-charcoal-900">{order.item}</p>
                      <p className="text-xs text-charcoal-300 mt-0.5">
                        {order.id} · {order.date} · {order.designer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-charcoal-900">{order.total}</p>
                      <span className={`text-xs mt-0.5 inline-block px-2 py-0.5 ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-600"
                          : order.status === "Shipped"
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
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/products" className="border border-stone-100 p-6 hover:border-stone-300 transition-colors group">
                <p className="text-xs uppercase tracking-wider text-charcoal-300 mb-2">Discover</p>
                <p className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-500 transition-colors">Browse Collections</p>
                <p className="text-sm text-charcoal-400 mt-1">Explore new arrivals from Pakistan's finest designers</p>
              </Link>
              <Link to="/designers" className="border border-stone-100 p-6 hover:border-stone-300 transition-colors group">
                <p className="text-xs uppercase tracking-wider text-charcoal-300 mb-2">Connect</p>
                <p className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-500 transition-colors">Meet Our Designers</p>
                <p className="text-sm text-charcoal-400 mt-1">Follow your favorite creators and see their latest work</p>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
