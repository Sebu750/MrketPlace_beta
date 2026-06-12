import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAddresses, addAddressAPI, updateAddressAPI, removeAddressAPI, setDefaultAddressAPI,
  addAddress, updateAddress, removeAddress, setDefaultAddress,
} from "../store/customerSlice";

const emptyForm = { name: "", phone: "", address: "", city: "", postalCode: "", country: "Pakistan", isDefault: false };

export default function CustomerAddresses() {
  const addresses = useSelector((s) => s.customer.addresses);
  const loading = useSelector((s) => s.customer.addressesLoading);
  const dispatch = useDispatch();
  const hasAuth = !!localStorage.getItem("token");

  useEffect(() => {
    if (hasAuth) dispatch(fetchAddresses());
  }, [dispatch, hasAuth]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setForm({ name: addr.name, phone: addr.phone, address: addr.address, city: addr.city, postalCode: addr.postalCode, country: addr.country || "Pakistan", isDefault: addr.isDefault });
    setEditing(addr.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.address) return;
    if (editing) {
      if (hasAuth) {
        dispatch(updateAddressAPI({ id: editing, ...form }));
      } else {
        dispatch(updateAddress({ ...form, id: editing }));
      }
    } else {
      if (hasAuth) {
        dispatch(addAddressAPI({ ...form, id: `addr_${Date.now()}` }));
      } else {
        dispatch(addAddress(form));
      }
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <p className="text-sm text-charcoal-400">{addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved</p>
        <button
          onClick={openAdd}
          className="w-full sm:w-auto px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors"
        >
          Add Address
        </button>
      </div>

      {/* ── Address form ────────────────────────────────────── */}
      {showForm && (
        <div className="border border-stone-200 p-6 space-y-4">
          <p className="text-sm text-charcoal-900 font-medium">{editing ? "Edit Address" : "New Address"}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Full Name" value={form.name} onChange={(e) => setField("name", e.target.value)} className="px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none" />
            <input placeholder="Phone Number" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none" />
          </div>
          <input placeholder="Street Address" value={form.address} onChange={(e) => setField("address", e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="City" value={form.city} onChange={(e) => setField("city", e.target.value)} className="px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none" />
            <input placeholder="Postal Code" value={form.postalCode} onChange={(e) => setField("postalCode", e.target.value)} className="px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none" />
            <input placeholder="Country" value={form.country} onChange={(e) => setField("country", e.target.value)} className="px-3 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal-600 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setField("isDefault", e.target.checked)} className="accent-charcoal-900" />
            Set as default address
          </label>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave} className="px-5 py-2 text-[11px] uppercase tracking-[0.15em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
              Save
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2 text-[11px] uppercase tracking-[0.15em] border border-stone-300 text-charcoal-500 hover:text-charcoal-900 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Address cards ───────────────────────────────────── */}
      {addresses.length === 0 && !showForm ? (
        <div className="py-16 text-center">
          <p className="text-sm text-charcoal-400 mb-4">No addresses saved yet</p>
          <button onClick={openAdd} className="text-xs uppercase tracking-[0.2em] text-bronze-600 hover:text-bronze-800 transition-colors">
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`border p-5 ${addr.isDefault ? "border-charcoal-900" : "border-stone-200"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-charcoal-900 font-medium">{addr.name}</p>
                  {addr.phone && <p className="text-[11px] text-charcoal-400 mt-0.5">{addr.phone}</p>}
                </div>
                {addr.isDefault && (
                  <span className="text-[9px] uppercase tracking-[0.2em] bg-charcoal-900 text-white px-2 py-0.5">Default</span>
                )}
              </div>
              <p className="text-[12px] text-charcoal-600 leading-relaxed">
                {addr.address}
                {addr.city && `, ${addr.city}`}
                {addr.postalCode && ` ${addr.postalCode}`}
                {addr.country && `, ${addr.country}`}
              </p>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mt-4 pt-3 border-t border-stone-100">
                <button onClick={() => openEdit(addr)} className="text-[10px] uppercase tracking-[0.15em] text-charcoal-400 hover:text-charcoal-900 transition-colors py-1">
                  Edit
                </button>
                {!addr.isDefault && (
                  <>
                    <span className="text-charcoal-200">·</span>
                    <button onClick={() => dispatch(hasAuth ? setDefaultAddressAPI(addr.id) : setDefaultAddress(addr.id))} className="text-[10px] uppercase tracking-[0.15em] text-charcoal-400 hover:text-charcoal-900 transition-colors py-1">
                      Set Default
                    </button>
                  </>
                )}
                <span className="text-charcoal-200">·</span>
                <button onClick={() => dispatch(hasAuth ? removeAddressAPI(addr.id) : removeAddress(addr.id))} className="text-[10px] uppercase tracking-[0.15em] text-red-400 hover:text-red-600 transition-colors py-1">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
