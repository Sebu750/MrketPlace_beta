import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDesignerProfile, updateDesignerProfile } from "../store/designerSlice";
import API from "../services/api";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
const IconUpload = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconShield = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconEye = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>;

const TABS = ["Brand", "Store", "Account"];
const cities = ["Lahore", "Islamabad", "Karachi", "Faisalabad", "Peshawar", "Multan"];
const inputCls = "w-full border border-stone-200 px-4 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-300 transition-colors bg-white";

const Field = ({ label, children, hint, required }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-charcoal-300 mt-1">{hint}</p>}
  </div>
);

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerProfileSettings() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((s) => s.designer);
  const [tab, setTab] = useState("Brand");
  const [saved, setSaved] = useState(false);

  /* Upload state */
  const [uploading, setUploading] = useState({ logo: false, banner: false });
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchDesignerProfile());
  }, [dispatch]);

  /* Brand state */
  const [brand, setBrand] = useState({
    name: "", bio: "", instagram: "", website: "",
  });

  /* Store state */
  const [store, setStore] = useState({
    city: "Lahore", hours: "Mon–Fri, 10am–6pm", shipping: "Made-to-order, ships within 2–4 weeks",
    returnPolicy: "14-day return policy for ready-to-wear items. Made-to-order pieces are non-refundable.",
  });

  /* Account state */
  const [account, setAccount] = useState({
    email: "", name: "",
    notifyOrder: true, notifyPayout: true, notifyReview: true, notifyMarketing: false,
  });

  useEffect(() => {
    if (profile) {
      setBrand({ name: profile.brandName || profile.name || "", bio: profile.bio || "", instagram: profile.socialLinks?.instagram || "", website: profile.socialLinks?.website || "", logo: profile.logo || "", banner: profile.banner || "" });
      setLogoPreview(profile.logo || null);
      setBannerPreview(profile.banner || null);
      setStore((s) => ({ ...s, city: profile.studioCity || "Lahore" }));
      setAccount({ email: profile.email || "", name: profile.name || "", notifyOrder: profile.notifications?.orders !== false, notifyPayout: true, notifyReview: true, notifyMarketing: profile.notifications?.marketing || false });
    }
  }, [profile]);

  const handleSave = () => {
    dispatch(updateDesignerProfile({
      brandName: brand.name,
      bio: brand.bio,
      logo: brand.logo,
      banner: brand.banner,
      socialLinks: { instagram: brand.instagram, website: brand.website },
      studioCity: store.city,
    })).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  const updateBrand = (k, v) => setBrand((b) => ({ ...b, [k]: v }));
  const updateStore = (k, v) => setStore((s) => ({ ...s, [k]: v }));
  const updateAccount = (k, v) => setAccount((a) => ({ ...a, [k]: v }));

  const handleImageUpload = async (type, file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading((u) => ({ ...u, [type]: true }));
    
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await API.post("/upload/designer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const url = data.data?.url || "";
      if (type === "logo") {
        setLogoPreview(url);
        setBrand((b) => ({ ...b, logo: url }));
      } else {
        setBannerPreview(url);
        setBrand((b) => ({ ...b, banner: url }));
      }
    } catch (err) {
      console.error(`Failed to upload ${type}:`, err);
    } finally {
      setUploading((u) => ({ ...u, [type]: false }));
    }
  };

  if (loading && !profile) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-charcoal-400">Loading settings...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Settings</p>
        <h2 className="font-serif text-3xl text-charcoal-900 font-light">Profile Settings</h2>
        <p className="text-sm text-charcoal-400 mt-1">Manage your brand, store preferences, and account</p>
      </div>

      {/* ── Verified Badge ──────────────────────────────────────── */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconShield className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-sm text-emerald-800 font-medium">Verified Designer</p>
            <p className="text-xs text-emerald-600">Your identity and credentials have been verified by Adorzia</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-300">Active</span>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0 border-b border-stone-200">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-[10px] uppercase tracking-[0.2em] border-b-2 transition-all duration-300 -mb-px ${
              tab === t ? "border-charcoal-900 text-charcoal-900" : "border-transparent text-charcoal-400 hover:text-charcoal-600"
            }`}>{t}</button>
        ))}
      </div>

      {/* ── Brand Tab ───────────────────────────────────────────── */}
      {tab === "Brand" && (
        <div className="bg-white border border-stone-200 p-8 max-w-2xl space-y-6">
          <Field label="Brand / Designer Name" required>
            <input className={inputCls} value={brand.name} onChange={(e) => updateBrand("name", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Logo" hint="Square, min 400×400px">
              <input
                type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" id="logo-upload"
                onChange={(e) => handleImageUpload("logo", e.target.files?.[0])}
              />
              <label htmlFor="logo-upload" className="block cursor-pointer">
                {logoPreview ? (
                  <div className="relative group">
                    <img src={logoPreview} alt="Logo" className="w-full aspect-square object-cover border border-stone-200" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center hover:border-bronze-300 transition-colors">
                    {uploading.logo ? (
                      <p className="text-[11px] text-charcoal-400">Uploading...</p>
                    ) : (
                      <>
                        <IconUpload className="w-6 h-6 text-charcoal-300 mx-auto mb-2" />
                        <p className="text-[11px] text-charcoal-400">Upload logo</p>
                      </>
                    )}
                  </div>
                )}
              </label>
            </Field>
            <Field label="Banner Image" hint="16:9 ratio, min 1200×675px">
              <input
                type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" id="banner-upload"
                onChange={(e) => handleImageUpload("banner", e.target.files?.[0])}
              />
              <label htmlFor="banner-upload" className="block cursor-pointer">
                {bannerPreview ? (
                  <div className="relative group">
                    <img src={bannerPreview} alt="Banner" className="w-full aspect-[16/9] object-cover border border-stone-200" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center hover:border-bronze-300 transition-colors">
                    {uploading.banner ? (
                      <p className="text-[11px] text-charcoal-400">Uploading...</p>
                    ) : (
                      <>
                        <IconUpload className="w-6 h-6 text-charcoal-300 mx-auto mb-2" />
                        <p className="text-[11px] text-charcoal-400">Upload banner</p>
                      </>
                    )}
                  </div>
                )}
              </label>
            </Field>
          </div>

          <Field label="Bio / Philosophy" required hint="This appears on your public designer profile">
            <textarea className={`${inputCls} min-h-[120px] resize-y`} value={brand.bio} onChange={(e) => updateBrand("bio", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Instagram" hint="Without @">
              <input className={inputCls} value={brand.instagram} onChange={(e) => updateBrand("instagram", e.target.value)} />
            </Field>
            <Field label="Website">
              <input className={inputCls} value={brand.website} onChange={(e) => updateBrand("website", e.target.value)} />
            </Field>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button onClick={handleSave}
              className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
              {saved ? <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5" /> Saved</span> : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── Store Tab ───────────────────────────────────────────── */}
      {tab === "Store" && (
        <div className="bg-white border border-stone-200 p-8 max-w-2xl space-y-6">
          <Field label="Studio City" required>
            <select className={`${inputCls} appearance-none`} value={store.city} onChange={(e) => updateStore("city", e.target.value)}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Operating Hours" hint="Shown on your public profile">
            <input className={inputCls} value={store.hours} onChange={(e) => updateStore("hours", e.target.value)} />
          </Field>

          <Field label="Default Shipping Policy" hint="Applied to all new products unless overridden">
            <textarea className={`${inputCls} min-h-[80px] resize-y`} value={store.shipping} onChange={(e) => updateStore("shipping", e.target.value)} />
          </Field>

          <Field label="Default Return Policy" hint="Applied to all new products unless overridden">
            <textarea className={`${inputCls} min-h-[80px] resize-y`} value={store.returnPolicy} onChange={(e) => updateStore("returnPolicy", e.target.value)} />
          </Field>

          {/* Preview */}
          <div className="bg-stone-50 border border-stone-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <IconEye className="w-4 h-4 text-charcoal-400" />
              <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal-400">Public Profile Preview</p>
            </div>
            <div className="space-y-1.5 text-xs text-charcoal-600">
              <p><span className="text-charcoal-400">Studio:</span> {store.city}</p>
              <p><span className="text-charcoal-400">Hours:</span> {store.hours}</p>
              <p><span className="text-charcoal-400">Shipping:</span> {store.shipping}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button onClick={handleSave}
              className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
              {saved ? <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5" /> Saved</span> : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── Account Tab ─────────────────────────────────────────── */}
      {tab === "Account" && (
        <div className="bg-white border border-stone-200 p-8 max-w-2xl space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name">
              <input className={inputCls} value={account.name} onChange={(e) => updateAccount("name", e.target.value)} />
            </Field>
            <Field label="Email Address" required>
              <input type="email" className={inputCls} value={account.email} onChange={(e) => updateAccount("email", e.target.value)} />
            </Field>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-2">Change Password</label>
            <div className="space-y-2">
              <input type="password" className={inputCls} placeholder="Current password" />
              <div className="grid grid-cols-2 gap-2">
                <input type="password" className={inputCls} placeholder="New password" />
                <input type="password" className={inputCls} placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-3">Notification Preferences</label>
            <div className="space-y-3">
              {[
                { key: "notifyOrder", label: "New Orders", desc: "Get notified when a customer places an order" },
                { key: "notifyPayout", label: "Payouts", desc: "Get notified when a payout is processed" },
                { key: "notifyReview", label: "Collection Reviews", desc: "Get notified about collection review status changes" },
                { key: "notifyMarketing", label: "Marketing & Tips", desc: "Receive tips, guides, and marketplace updates" },
              ].map((n) => (
                <label key={n.key} className="flex items-start gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    account[n.key] ? "bg-charcoal-900 border-charcoal-900" : "border-stone-300 group-hover:border-charcoal-400"
                  }`}
                    onClick={(e) => { e.preventDefault(); updateAccount(n.key, !account[n.key]); }}>
                    {account[n.key] && <IconCheck className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-900">{n.label}</p>
                    <p className="text-[11px] text-charcoal-400">{n.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button onClick={handleSave}
              className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
              {saved ? <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5" /> Saved</span> : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
