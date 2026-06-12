import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminUsers, updateUserRole, deleteUser } from "../store/adminSlice";

const roleColors = { buyer: "bg-blue-50 text-blue-700", seller: "bg-amber-50 text-amber-700", admin: "bg-red-50 text-red-600" };
const roleFilters = ["All", "Buyer", "Seller", "Admin"];

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.admin);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    const role = roleFilter === "All" ? null : roleFilter === "Buyer" ? "buyer" : roleFilter === "Seller" ? "seller" : "admin";
    dispatch(fetchAdminUsers({ role, search: search || null }));
  }, [dispatch, roleFilter]);

  const handleSearch = () => {
    const role = roleFilter === "All" ? null : roleFilter === "Buyer" ? "buyer" : roleFilter === "Seller" ? "seller" : "admin";
    dispatch(fetchAdminUsers({ role, search: search || null }));
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ id: userId, role: newRole })).then(() =>
      dispatch(fetchAdminUsers({ role: roleFilter === "All" ? null : roleFilter.toLowerCase() }))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user? This cannot be undone.")) dispatch(deleteUser(id));
  };

  const items = users.items || [];
  const pagination = users.pagination || {};

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1 border border-stone-200 bg-white">
          {roleFilters.map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                roleFilter === r ? "bg-charcoal-900 text-white" : "text-charcoal-500 hover:bg-stone-50"
              }`}>{r}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search users..." className="border border-stone-200 px-4 py-2 text-sm w-60 focus:outline-none focus:border-charcoal-400" />
          <button onClick={handleSearch} className="bg-charcoal-900 text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-charcoal-800 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-charcoal-400">{pagination.total || items.length} users found</p>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {items.length === 0 ? (
          <div className="bg-white border border-stone-200 p-8 text-center text-sm text-charcoal-400">
            {loading ? "Loading..." : "No users found"}
          </div>
        ) : items.map((u) => (
          <div key={u._id} className="border border-stone-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-charcoal-900">{u.name}</p>
              <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${roleColors[u.role] || ""}`}>{u.role}</span>
            </div>
            <p className="text-xs text-charcoal-400 font-mono">{u.email}</p>
            <p className="text-xs text-charcoal-400">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
            {u.role !== "admin" && (
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="text-xs border border-stone-200 px-2 py-1.5 focus:outline-none flex-1">
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
                <button onClick={() => handleDelete(u._id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 border border-red-200">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-stone-200 bg-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Name</th>
              <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Email</th>
              <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Role</th>
              <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Joined</th>
              <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.map((u) => (
              <tr key={u._id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-3 text-sm text-charcoal-900">{u.name}</td>
                <td className="px-6 py-3 text-sm text-charcoal-500 font-mono text-xs">{u.email}</td>
                <td className="px-6 py-3">
                  <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${roleColors[u.role] || ""}`}>{u.role}</span>
                </td>
                <td className="px-6 py-3 text-xs text-charcoal-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    {u.role !== "admin" && (
                      <>
                        <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs border border-stone-200 px-2 py-1 focus:outline-none">
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                        </select>
                        <button onClick={() => handleDelete(u._id)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-charcoal-400">
                {loading ? "Loading..." : "No users found"}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button key={i} onClick={() => dispatch(fetchAdminUsers({ page: i + 1, role: roleFilter === "All" ? null : roleFilter.toLowerCase() }))}
              className={`w-8 h-8 text-xs transition-colors ${
                pagination.page === i + 1 ? "bg-charcoal-900 text-white" : "border border-stone-200 text-charcoal-500 hover:bg-stone-50"
              }`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
