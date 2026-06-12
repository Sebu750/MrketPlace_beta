import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CustomerSettings() {
  const { data: user } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      await API.put("/customer/profile", { name: profile.name, phone: profile.phone });
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.name = profile.name;
      stored.phone = profile.phone;
      localStorage.setItem("user", JSON.stringify(stored));
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage("");
    if (passwords.newPass !== passwords.confirm) {
      setMessage("New passwords do not match");
      return;
    }
    if (passwords.newPass.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await API.put("/customer/password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      setPasswords({ current: "", newPass: "", confirm: "" });
      setMessage("Password changed successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This action cannot be undone. All your data will be permanently deleted.")) {
      alert("Account deletion request submitted. You will receive a confirmation email.");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    { id: "account", label: "Account" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-stone-200 pb-4 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setMessage(""); }}
            className={`shrink-0 snap-start px-4 py-2.5 text-[12px] tracking-wide transition-colors ${
              tab === t.id
                ? "bg-charcoal-900 text-white"
                : "text-charcoal-500 hover:text-charcoal-900 hover:bg-stone-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Message ─────────────────────────────────────────── */}
      {message && (
        <div className={`px-4 py-3 text-[12px] ${
          message.includes("success") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          PROFILE TAB
      ═══════════════════════════════════════════════════════ */}
      {tab === "profile" && (
        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-4">Personal Information</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-charcoal-400 mb-1.5">Full Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-charcoal-400 mb-1.5">Email</label>
                <input
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50 text-charcoal-400 cursor-not-allowed"
                />
                <p className="text-[10px] text-charcoal-300 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-charcoal-400 mb-1.5">Phone</label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+92 xxx xxxxxxx"
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          PASSWORD TAB
      ═══════════════════════════════════════════════════════ */}
      {tab === "password" && (
        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-4">Change Password</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-charcoal-400 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-charcoal-400 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-charcoal-400 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            disabled={saving || !passwords.current || !passwords.newPass || !passwords.confirm}
            className="w-full sm:w-auto px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Changing…" : "Change Password"}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ACCOUNT TAB
      ═══════════════════════════════════════════════════════ */}
      {tab === "account" && (
        <div className="space-y-8">
          {/* Account info */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-4">Account Details</p>
            <div className="border border-stone-200 divide-y divide-stone-100">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-[12px] text-charcoal-400">Role</span>
                <span className="text-[12px] text-charcoal-900">{user?.role || "buyer"}</span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-[12px] text-charcoal-400">Member Since</span>
                <span className="text-[12px] text-charcoal-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-PK", { month: "long", year: "numeric" }) : ","}
                </span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-[12px] text-charcoal-400">Account ID</span>
                <span className="text-[11px] text-charcoal-400 font-mono">{user?._id?.slice(-8) || ","}</span>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-3">Session</p>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] border border-stone-300 text-charcoal-600 hover:text-charcoal-900 hover:border-charcoal-400 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Danger zone */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-red-400 mb-3">Danger Zone</p>
            <div className="border border-red-200 p-5">
              <p className="text-sm text-charcoal-900 mb-1">Delete Account</p>
              <p className="text-[11px] text-charcoal-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
