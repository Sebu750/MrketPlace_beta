import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const navItems = [
  { label: "Dashboard", icon: "□" },
  { label: "Users", icon: "◉" },
  { label: "Designers", icon: "◈" },
  { label: "Orders", icon: "⊞" },
  { label: "Collections", icon: "◐" },
  { label: "Payouts", icon: "◇" },
  { label: "Content", icon: "⊡" },
  { label: "Reports", icon: "◔" },
  { label: "Settings", icon: "⚙" },
];

const platformStats = [
  { label: "Total Users", value: "1,234", change: "+12%", sub: "this month" },
  { label: "Active Designers", value: "48", change: "+3", sub: "new applications" },
  { label: "Orders", value: "892", change: "+24%", sub: "this month" },
  { label: "GMV", value: "PKR 4.2M", change: "+18%", sub: "total volume" },
];

const pendingApprovals = [
  { type: "Designer Application", name: "Maryam Sheikh", city: "Lahore", date: "Jun 5, 2026" },
  { type: "Designer Application", name: "Omair Ali", city: "Karachi", date: "Jun 4, 2026" },
  { type: "Collection Review", name: "Threads of the Indus", designer: "Ayesha Siddiqui", date: "Jun 3, 2026" },
];

const recentActivity = [
  { action: "New order placed", detail: "Sarah K. ordered Ajrak Architect Coat", time: "2 min ago" },
  { action: "Designer approved", detail: "Zara Hameed , Geometry of Home collection", time: "1 hour ago" },
  { action: "Payout processed", detail: "PKR 576,000 to Ayesha Siddiqui", time: "3 hours ago" },
  { action: "User registered", detail: "New customer: Amir Raza (Islamabad)", time: "5 hours ago" },
];

export default function AdminPanel() {
  const { data: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-stone-100 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-serif text-xl text-charcoal-900">Adorzia</Link>
            <span className="text-xs uppercase tracking-wider bg-red-600 text-white px-2 py-0.5">Admin</span>
          </div>
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
          <aside className="lg:col-span-2">
            <nav className="space-y-1">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    i === 0
                      ? "bg-charcoal-900 text-white"
                      : "text-charcoal-500 hover:bg-stone-50 hover:text-charcoal-900"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-10">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl text-charcoal-900">Platform Overview</h1>
                <p className="mt-1 text-sm text-charcoal-400">Monitor and manage all aspects of Adorzia marketplace.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-charcoal-300">Last updated</p>
                <p className="text-sm text-charcoal-900">Jun 8, 2026 · 10:34 AM</p>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {platformStats.map((stat, i) => (
                <div key={i} className="border border-stone-100 p-5">
                  <p className="text-xs uppercase tracking-wider text-charcoal-300 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-serif text-2xl text-charcoal-900">{stat.value}</p>
                    <span className="text-xs text-green-600">{stat.change}</span>
                  </div>
                  <p className="text-xs text-charcoal-300 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <div className="border border-stone-100">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-charcoal-900">Pending Approvals</h2>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5">{pendingApprovals.length} pending</span>
                </div>
                <div className="divide-y divide-stone-100">
                  {pendingApprovals.map((item, i) => (
                    <div key={i} className="px-6 py-4">
                      <p className="text-sm text-charcoal-900">{item.name}</p>
                      <p className="text-xs text-charcoal-300 mt-0.5">
                        {item.type} · {item.city || item.designer} · {item.date}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button className="text-xs bg-charcoal-900 text-white px-3 py-1 hover:bg-charcoal-800 transition-colors">
                          Approve
                        </button>
                        <button className="text-xs border border-stone-200 text-charcoal-500 px-3 py-1 hover:border-stone-400 transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border border-stone-100">
                <div className="px-6 py-4 border-b border-stone-100">
                  <h2 className="text-sm font-medium text-charcoal-900">Recent Activity</h2>
                </div>
                <div className="divide-y divide-stone-100">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="px-6 py-4">
                      <p className="text-sm text-charcoal-900">{activity.action}</p>
                      <p className="text-xs text-charcoal-300 mt-0.5">{activity.detail}</p>
                      <p className="text-xs text-stone-300 mt-1">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Users", action: "Manage Users", desc: "View and manage all user accounts" },
                { label: "Designers", action: "Review Applications", desc: "Approve new designer applications" },
                { label: "Payouts", action: "Process Payouts", desc: "Review and release designer earnings" },
                { label: "Content", action: "Manage Content", desc: "Homepage, Spotlight, and editorial" },
              ].map((action, i) => (
                <button key={i} className="border border-stone-100 p-5 hover:border-stone-300 transition-colors text-left group">
                  <p className="text-xs uppercase tracking-wider text-charcoal-300 mb-2">{action.label}</p>
                  <p className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors">{action.action}</p>
                  <p className="text-xs text-charcoal-400 mt-1">{action.desc}</p>
                </button>
              ))}
            </div>

            {/* System status */}
            <div className="mt-8 border border-stone-100 p-6 bg-stone-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-charcoal-300 mb-1">System Status</p>
                  <p className="text-sm text-charcoal-900">All systems operational</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600">Healthy</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
