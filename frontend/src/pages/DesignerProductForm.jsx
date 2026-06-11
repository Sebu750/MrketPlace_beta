import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconArrowLeft = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const IconUpload = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;

const STEPS = [
  { n: 1, label: "Basics" },
  { n: 2, label: "Media" },
  { n: 3, label: "Variants" },
  { n: 4, label: "Details" },
  { n: 5, label: "Review" },
];

const collections = ["Geometry of Home", "Threads of the Indus", "The Archive"];
const categories = ["Womenswear", "Menswear", "Unisex", "Accessories"];
const crafts = ["Ajrak Block Printing", "Chikankari", "Handloom Weaving", "Sindhi Mirror Work", "Zardozi", "Phulkari", "Pashmina", "Rilli Quilting"];
const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "Free Size"];

/* ── Form Field ───────────────────────────────────────────────────── */
const Field = ({ label, children, hint, required }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-charcoal-300 mt-1">{hint}</p>}
  </div>
);
const inputCls = "w-full border border-stone-200 px-4 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-300 transition-colors bg-white";

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  /* Form state */
  const [form, setForm] = useState({
    name: "", collection: "", category: "", craft: "", price: "", oneLiner: "",
    images: [], colors: ["Natural"], sizes: [], stock: {},
    description: "", craftStory: "", materials: "", care: "", delivery: "", returns: "",
  });
  const [newColor, setNewColor] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSize = (s) => {
    if (form.sizes.includes(s)) {
      update("sizes", form.sizes.filter((x) => x !== s));
    } else {
      update("sizes", [...form.sizes, s]);
    }
  };

  const addColor = () => {
    if (newColor.trim() && !form.colors.includes(newColor.trim())) {
      update("colors", [...form.colors, newColor.trim()]);
      setNewColor("");
    }
  };
  const removeColor = (c) => update("colors", form.colors.filter((x) => x !== c));

  const updateStock = (size, color, qty) => {
    const key = `${size}-${color}`;
    update("stock", { ...form.stock, [key]: parseInt(qty) || 0 });
  };

  const handleSave = (status) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to=".." className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-charcoal-400 hover:text-charcoal-900 transition-colors mb-2">
            <IconArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h2 className="font-serif text-3xl text-charcoal-900 font-light">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleSave("draft")}
            className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">
            Save as Draft
          </button>
          <button onClick={() => handleSave("publish")}
            className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
            {saved ? <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5" /> Saved</span> : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Progress Bar ────────────────────────────────────────── */}
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

      {/* ── Step 1: Basics ──────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white border border-stone-200 p-8 space-y-6 max-w-2xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Step 1</p>
            <h3 className="font-serif text-2xl text-charcoal-900">Basic Information</h3>
          </div>

          <Field label="Product Name" required>
            <input className={inputCls} placeholder="e.g. Ajrak Architect Coat" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </Field>

          <Field label="One-Liner" hint="A brief tagline shown on product cards">
            <input className={inputCls} placeholder="e.g. Heritage craft meets modern structure" value={form.oneLiner} onChange={(e) => update("oneLiner", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Collection" required>
              <select className={`${inputCls} appearance-none`} value={form.collection} onChange={(e) => update("collection", e.target.value)}>
                <option value="">Select collection</option>
                {collections.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Category" required>
              <select className={`${inputCls} appearance-none`} value={form.category} onChange={(e) => update("category", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (PKR)" required>
              <input className={inputCls} placeholder="48,000" value={form.price} onChange={(e) => update("price", e.target.value)} />
            </Field>
            <Field label="Craft">
              <select className={`${inputCls} appearance-none`} value={form.craft} onChange={(e) => update("craft", e.target.value)}>
                <option value="">Select craft</option>
                {crafts.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

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
            <h3 className="font-serif text-2xl text-charcoal-900">Product Images</h3>
            <p className="text-sm text-charcoal-400 mt-1">Upload high-quality images. First image is the primary display image.</p>
          </div>

          {/* Main image upload */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-2">Primary Image *</label>
            <div className="border-2 border-dashed border-stone-300 bg-stone-50 p-12 text-center hover:border-bronze-300 transition-colors cursor-pointer">
              <IconUpload className="w-8 h-8 text-charcoal-300 mx-auto mb-3" />
              <p className="text-sm text-charcoal-600 mb-1">Drag & drop or click to upload</p>
              <p className="text-[11px] text-charcoal-400">JPEG, PNG or WebP · Max 5MB · Min 1200×1600px</p>
            </div>
          </div>

          {/* Gallery images */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-2">Gallery Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] border-2 border-dashed border-stone-200 bg-stone-50 flex flex-col items-center justify-center hover:border-bronze-300 transition-colors cursor-pointer group">
                  <IconUpload className="w-5 h-5 text-charcoal-300 group-hover:text-charcoal-500 mb-1.5" />
                  <span className="text-[9px] text-charcoal-400 uppercase tracking-wider">Image {i + 1}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-charcoal-300 mt-2">Add detail shots, fabric close-ups, and lifestyle images</p>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-2">Image Labels</label>
            <p className="text-[11px] text-charcoal-300 mb-2">Optional captions displayed beneath each image</p>
            <div className="space-y-2">
              {["Front View", "Detail / Fabric", "Back View", "Lifestyle / Styled"].map((label, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] text-charcoal-400 w-8 shrink-0">#{i + 1}</span>
                  <input className={`${inputCls} py-2`} placeholder={label} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button onClick={() => setStep(1)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">Back</button>
            <button onClick={() => setStep(3)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">Next: Variants</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Variants ────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-white border border-stone-200 p-8 space-y-6 max-w-3xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Step 3</p>
            <h3 className="font-serif text-2xl text-charcoal-900">Sizes & Colors</h3>
          </div>

          {/* Sizes */}
          <Field label="Available Sizes" required hint="Select all sizes this product is available in">
            <div className="flex flex-wrap gap-2 mt-1">
              {sizes.map((s) => (
                <button key={s} onClick={() => toggleSize(s)}
                  className={`w-14 h-10 text-xs font-medium border transition-all duration-200 ${
                    form.sizes.includes(s) ? "bg-charcoal-900 text-white border-charcoal-900" : "bg-white text-charcoal-600 border-stone-200 hover:border-charcoal-300"
                  }`}>{s}</button>
              ))}
            </div>
          </Field>

          {/* Colors */}
          <Field label="Colors" hint="Add color options available for this product">
            <div className="flex flex-wrap gap-2 mb-2">
              {form.colors.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs text-charcoal-700">
                  {c}
                  <button onClick={() => removeColor(c)} className="text-charcoal-400 hover:text-red-500 transition-colors"><IconX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} placeholder="Add color..." value={newColor} onChange={(e) => setNewColor(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} />
              <button onClick={addColor} className="px-4 py-2 border border-stone-200 text-xs text-charcoal-600 hover:bg-stone-50 transition-colors">Add</button>
            </div>
          </Field>

          {/* Stock per variant */}
          {form.sizes.length > 0 && form.colors.length > 0 && (
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal-500 font-medium mb-2">Stock per Variant</label>
              <div className="border border-stone-200 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="text-left px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-charcoal-400 font-medium">Size \ Color</th>
                      {form.colors.map((c) => (
                        <th key={c} className="text-center px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-charcoal-400 font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {form.sizes.map((s) => (
                      <tr key={s}>
                        <td className="px-4 py-2 text-charcoal-700 font-medium">{s}</td>
                        {form.colors.map((c) => (
                          <td key={c} className="px-3 py-2 text-center">
                            <input type="number" min="0" value={form.stock[`${s}-${c}`] || ""} onChange={(e) => updateStock(s, c, e.target.value)}
                              className="w-16 text-center border border-stone-200 px-2 py-1 text-xs text-charcoal-900 focus:outline-none focus:border-bronze-300" placeholder="0" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button onClick={() => setStep(2)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">Back</button>
            <button onClick={() => setStep(4)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">Next: Details</button>
          </div>
        </div>
      )}

      {/* ── Step 4: Details ─────────────────────────────────────── */}
      {step === 4 && (
        <div className="bg-white border border-stone-200 p-8 space-y-6 max-w-2xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Step 4</p>
            <h3 className="font-serif text-2xl text-charcoal-900">Product Details</h3>
          </div>

          <Field label="Full Description" required hint="Shown on the product page below images">
            <textarea className={`${inputCls} min-h-[120px] resize-y`} placeholder="Describe the design philosophy, silhouette, and construction..."
              value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>

          <Field label="Craftsmanship Story" hint="Share the artisan process behind this piece">
            <textarea className={`${inputCls} min-h-[80px] resize-y`} placeholder="Describe the traditional techniques used..."
              value={form.craftStory} onChange={(e) => update("craftStory", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Materials">
              <textarea className={`${inputCls} min-h-[80px] resize-y`} placeholder="100% handloom cotton, natural indigo dye..."
                value={form.materials} onChange={(e) => update("materials", e.target.value)} />
            </Field>
            <Field label="Care Instructions">
              <textarea className={`${inputCls} min-h-[80px] resize-y`} placeholder="Dry clean only. Store flat..."
                value={form.care} onChange={(e) => update("care", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Delivery Time">
              <input className={inputCls} placeholder="e.g. 2-4 weeks (made-to-order)" value={form.delivery} onChange={(e) => update("delivery", e.target.value)} />
            </Field>
            <Field label="Return Policy">
              <input className={inputCls} placeholder="e.g. 14-day return policy" value={form.returns} onChange={(e) => update("returns", e.target.value)} />
            </Field>
          </div>

          <div className="flex justify-between pt-4 border-t border-stone-100">
            <button onClick={() => setStep(3)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">Back</button>
            <button onClick={() => setStep(5)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">Next: Review</button>
          </div>
        </div>
      )}

      {/* ── Step 5: Review ──────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 p-8 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Step 5</p>
            <h3 className="font-serif text-2xl text-charcoal-900 mb-6">Review Your Listing</h3>

            {/* Preview card */}
            <div className="bg-stone-50 border border-stone-200 p-6">
              <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-3">Preview , How it appears on the marketplace</p>
              <div className="grid grid-cols-2 gap-6">
                {/* Image area */}
                <div className="aspect-[3/4] bg-stone-200 flex items-center justify-center">
                  <span className="text-[11px] text-charcoal-400 uppercase tracking-wider">Product Image</span>
                </div>
                {/* Info area */}
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal-400">{form.collection || "Collection Name"}</p>
                    <h4 className="font-serif text-xl text-charcoal-900 mt-0.5">{form.name || "Product Name"}</h4>
                    {form.oneLiner && <p className="text-xs text-charcoal-500 mt-1 italic">{form.oneLiner}</p>}
                  </div>
                  <p className="text-sm text-charcoal-900 font-medium">{form.price ? `PKR ${form.price}` : "PKR ,"}</p>
                  {form.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {form.sizes.map((s) => <span key={s} className="text-[9px] uppercase tracking-wider px-2 py-0.5 border border-stone-300 text-charcoal-500">{s}</span>)}
                    </div>
                  )}
                  {form.colors.length > 0 && (
                    <p className="text-[11px] text-charcoal-400">Colors: {form.colors.join(", ")}</p>
                  )}
                  {form.craft && (
                    <p className="text-[11px] text-charcoal-400">Craft: {form.craft}</p>
                  )}
                  {form.category && (
                    <p className="text-[11px] text-charcoal-400">Category: {form.category}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Details summary */}
            <div className="mt-6 space-y-4 text-sm">
              {form.description && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-1">Description</p>
                  <p className="text-charcoal-700 leading-relaxed">{form.description}</p>
                </div>
              )}
              {form.materials && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-1">Materials</p>
                  <p className="text-charcoal-700">{form.materials}</p>
                </div>
              )}
              {form.delivery && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-1">Delivery</p>
                  <p className="text-charcoal-700">{form.delivery}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between max-w-2xl">
            <button onClick={() => setStep(4)} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">Back</button>
            <div className="flex items-center gap-3">
              <button onClick={() => handleSave("draft")}
                className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">
                Save as Draft
              </button>
              <button onClick={() => handleSave("publish")}
                className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
                {saved ? <span className="flex items-center gap-1.5"><IconCheck className="w-3.5 h-3.5" /> Published</span> : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
