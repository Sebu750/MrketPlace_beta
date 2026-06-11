import { Link } from "react-router-dom";
import { useState } from "react";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconArrowLeft = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const IconUpload = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;

const STEPS = [{ n: 1, label: "Details" }, { n: 2, label: "Media" }, { n: 3, label: "Review" }];
const seasons = ["Spring/Summer 2026", "Autumn/Winter 2026", "Resort 2026", "Bridal 2026", "Festive 2026"];
const categories = ["Womenswear", "Menswear", "Unisex", "Bridal", "Pret", "Accessories"];
const crafts = ["Ajrak Block Printing", "Chikankari", "Handloom Weaving", "Sindhi Mirror Work", "Zardozi", "Phulkari", "Pashmina", "Rilli Quilting", "Kamdani", "Gotakinpatti"];

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
export default function DesignerCollectionForm() {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "", season: "", category: "", description: "", crafts: [],
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleCraft = (c) => {
    if (form.crafts.includes(c)) update("crafts", form.crafts.filter((x) => x !== c));
    else update("crafts", [...form.crafts, c]);
  };

  const handleSave = (action) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to=".." className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-charcoal-400 hover:text-charcoal-900 transition-colors mb-2">
            <IconArrowLeft className="w-3.5 h-3.5" /> Back to Collections
          </Link>
          <h2 className="font-serif text-3xl text-charcoal-900 font-light">New Collection</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleSave("draft")}
            className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">
            Save as Draft
          </button>
          <button onClick={() => handleSave("review")}
            className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
            {saved ? <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5" /> Saved</span> : "Submit for Review"}
          </button>
        </div>
      </div>

      {/* ── Progress ────────────────────────────────────────────── */}
      <div className="bg-white border border-stone-200 p-5">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-initial">
              <button onClick={() => setStep(s.n)} className="flex items-center gap-2.5 group">
                <div className={`w-8 h-8 flex items-center justify-center text-[11px] font-medium border transition-all duration-300 ${
                  step === s.n ? "bg-charcoal-900 text-white border-charcoal-900" :
                  step > s.n ? "bg-bronze-500 text-white border-bronze-500" :
                  "bg-white text-charcoal-400 border-stone-200 group-hover:border-charcoal-300"
                }`}>
                  {step > s.n ? <IconCheck className="w-3.5 h-3.5" /> : s.n}
                </div>
                <span className={`text-[10px] uppercase tracking-[0.18em] hidden sm:block ${
                  step >= s.n ? "text-charcoal-900" : "text-charcoal-300"
                }`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 transition-colors duration-300 ${
                  step > s.n ? "bg-bronze-500" : "bg-stone-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Step 1: Details ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white border border-stone-200 p-8 space-y-6 max-w-2xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Step 1</p>
            <h3 className="font-serif text-2xl text-charcoal-900">Collection Details</h3>
          </div>

          <Field label="Collection Name" required>
            <input className={inputCls} placeholder="e.g. Geometry of Home" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Season" required>
              <select className={`${inputCls} appearance-none`} value={form.season} onChange={(e) => update("season", e.target.value)}>
                <option value="">Select season</option>
                {seasons.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Category" required>
              <select className={`${inputCls} appearance-none`} value={form.category} onChange={(e) => update("category", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Collection Story" required hint="Tell the story behind this collection , concept, inspiration, craft philosophy">
            <textarea className={`${inputCls} min-h-[140px] resize-y`} placeholder="This collection explores the intersection of geometric precision found in Mughal architecture and the organic fluidity of hand-woven textiles..."
              value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>

          <Field label="Craft Traditions" hint="Select the traditional crafts featured in this collection">
            <div className="flex flex-wrap gap-2">
              {crafts.map((c) => (
                <button key={c} onClick={() => toggleCraft(c)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border transition-all duration-200 ${
                    form.crafts.includes(c) ? "bg-charcoal-900 text-white border-charcoal-900" : "bg-white text-charcoal-500 border-stone-200 hover:border-charcoal-300"
                  }`}>{c}</button>
              ))}
            </div>
          </Field>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button onClick={() => setStep(2)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
              Next: Media
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Media ───────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white border border-stone-200 p-8 space-y-6 max-w-3xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Step 2</p>
            <h3 className="font-serif text-2xl text-charcoal-900">Collection Media</h3>
          </div>

          <Field label="Cover Image" required hint="The primary image representing this collection">
            <div className="border-2 border-dashed border-stone-300 bg-stone-50 p-16 text-center hover:border-bronze-300 transition-colors cursor-pointer">
              <IconUpload className="w-8 h-8 text-charcoal-300 mx-auto mb-3" />
              <p className="text-sm text-charcoal-600 mb-1">Drag & drop or click to upload</p>
              <p className="text-[11px] text-charcoal-400">JPEG, PNG or WebP · Min 1600×1000px</p>
            </div>
          </Field>

          <Field label="Lookbook Images" hint="Upload editorial images that tell the collection story">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] border-2 border-dashed border-stone-200 bg-stone-50 flex flex-col items-center justify-center hover:border-bronze-300 transition-colors cursor-pointer group">
                  <IconUpload className="w-5 h-5 text-charcoal-300 group-hover:text-charcoal-500 mb-1.5" />
                  <span className="text-[9px] text-charcoal-400 uppercase tracking-wider">Image {i}</span>
                </div>
              ))}
            </div>
          </Field>

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button onClick={() => setStep(1)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">Back</button>
            <button onClick={() => setStep(3)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">Next: Review</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review ──────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 p-8 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Step 3</p>
            <h3 className="font-serif text-2xl text-charcoal-900 mb-6">Review Your Collection</h3>

            {/* Preview card */}
            <div className="bg-stone-50 border border-stone-200 overflow-hidden">
              <div className="aspect-[16/7] bg-stone-200 flex items-center justify-center">
                <span className="text-[11px] text-charcoal-400 uppercase tracking-wider">Cover Image</span>
              </div>
              <div className="p-6">
                <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400">{form.season || "Season"}</p>
                <h4 className="font-serif text-2xl text-charcoal-900 mt-1">{form.name || "Collection Name"}</h4>
                <p className="text-sm text-charcoal-500 mt-2 line-clamp-3">
                  {form.description || "Your collection story will appear here..."}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {form.crafts.length > 0 ? form.crafts.map((c) => (
                    <span key={c} className="text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-stone-300 text-charcoal-500">{c}</span>
                  )) : (
                    <span className="text-[10px] text-charcoal-300 italic">No craft traditions selected</span>
                  )}
                </div>
                {form.category && (
                  <p className="text-[11px] text-charcoal-400 mt-3">Category: {form.category}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between max-w-2xl">
            <button onClick={() => setStep(2)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">Back</button>
            <div className="flex items-center gap-3">
              <button onClick={() => handleSave("draft")}
                className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">
                Save as Draft
              </button>
              <button onClick={() => handleSave("publish")}
                className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
                {saved ? <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5" /> Published</span> : "Publish Collection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
