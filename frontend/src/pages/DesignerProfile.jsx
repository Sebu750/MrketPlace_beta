import { useParams, Link } from "react-router-dom";
import { useState } from "react";

/* ════════════════════════════════════════════════════════════════
   MOCK DATA , will come from API later
════════════════════════════════════════════════════════════════ */
const designer = {
  name: "Ayesha Siddiqui",
  city: "Lahore",
  country: "Pakistan",
  establishedYear: 2023,
  careerStage: "Rising Talent",
  stageDetail: "Independent Creative",
  oneLiner: "Translating centuries of Sindhi quilting tradition into sculptural modern garments.",
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
  banner: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=500&fit=crop",
  socials: { instagram: "#", pinterest: "#", linkedin: "#" },

  stats: {
    piecesLaunched: 48,
    craftTraditions: 3,
    collectionsOnAdorzia: 4,
    debutYear: 2023,
  },

  about: {
    biography:
      "Ayesha Siddiqui's design practice began not in a studio, but in her grandmother's courtyard in Hyderabad , watching generations-old Ralli quilts being pieced together from fabric remnants. After graduating from the National College of Arts, Lahore, she spent two years apprenticing with master dyers in Bhit Shah before launching her eponymous label in 2023. Her work occupies the space between heritage craft and contemporary minimalism: deconstructed quilt patterns rendered in deadstock linen, organic cotton, and handwoven Khaddar. Each collection is produced in limited runs of 12–20 pieces, with every garment passing through the hands of at least three artisans. She operates from the Adorzia Studio in Lahore, where she mentors two junior designers and collaborates with a network of 14 rural women artisans across Sindh.",
    philosophy:
      "I don't design clothes , I design continuity. Every pattern I use has existed for centuries. My role is to ensure those patterns survive the next century, not as museum pieces but as living garments worn by real people.",
    inspiration:
      "The geometry of Ralli quilts, the light in my grandmother's courtyard, the sound of the Indus at dusk. These are not references , they are the architecture of everything I make.",
    education: "National College of Arts, Lahore , BFA Textile Design",
    languages: "Urdu, English, Sindhi",
  },

  collections: [
    { name: "Geometry of Home", season: "SS26", pieces: 12, img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop" },
    { name: "Threads of the Indus", season: "FW25", pieces: 18, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop" },
    { name: "Hyderabad Monochrome", season: "SS25", pieces: 10, img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop" },
    { name: "Debut Capsule", season: "FW23", pieces: 8, img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop" },
  ],

  selectedWorks: [
    { name: "The Grandmother Coat", collection: "Threads of the Indus", price: "PKR 56,000", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop" },
    { name: "Indigo Fragment No. 7", collection: "Geometry of Home", price: "PKR 42,000", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop" },
    { name: "Courtyard Wrap Dress", collection: "Hyderabad Monochrome", price: "PKR 34,500", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop" },
  ],

  press: [
    { title: "Dawn Images , 'Ones to Watch' 2024", source: "Dawn Images", year: 2024, excerpt: "Ayesha Siddiqui is redefining what Pakistani fashion can be , her Ralli deconstructions are among the most exciting work we've seen from an emerging designer in years." },
    { title: "Libas International Feature", source: "Libas International", year: 2025, excerpt: "In a landscape crowded with surface-level nods to heritage, Siddiqui's work is structural , the craft is the design, not an embellishment applied after the fact." },
    { title: "NCA Emerging Designers Showcase", source: "National College of Arts", year: 2025, excerpt: "Selected as a standout graduate for her thesis collection exploring displacement through textile geometry." },
  ],

  crafts: [
    { name: "Ralli Quilting", region: "Sindh & Southern Punjab", desc: "One of South Asia's oldest textile traditions , geometric quilting built layer by layer using techniques that predate written instruction." },
    { name: "Block Printing", region: "Bhit Shah, Sindh", desc: "300-year-old hand-carved wooden block printing using natural indigo and madder root dyes." },
    { name: "Natural Dyeing", region: "Multan & Punjab", desc: "Plant-based dyeing traditions , indigo, madder root, pomegranate , producing colours that deepen with age." },
  ],

  awards: [
    { title: "NCA Emerging Designers Showcase", year: 2025, org: "National College of Arts" },
    { title: "Ones to Watch", year: 2024, org: "Dawn Images" },
    { title: "Craft Innovation Award", year: 2024, org: "Pakistan Fashion Council" },
  ],

  contact: {
    preferred: "Email",
    responseTime: "Within 48 hours",
    categories: ["Press & Stockist Inquiries", "Custom & Bespoke Orders"],
  },

  moreDesigners: [
    { name: "Zara Hameed", specialty: "Phulkari & Pashmina", city: "Islamabad", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop" },
    { name: "Bilal Raza", specialty: "Ajrak Block Print", city: "Karachi", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" },
    { name: "Mehreen Aslam", specialty: "Pashmina Weaving", city: "Islamabad", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop" },
    { name: "Noor & Sons", specialty: "Mirror Work", city: "Lahore", img: "https://images.unsplash.com/photo-1506794789787-5b53e5d1e464?w=400&h=500&fit=crop" },
    { name: "Hira Khan", specialty: "Khaddar", city: "Lahore", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop" },
  ],
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function DesignerProfile() {
  const { slug } = useParams();
  const d = designer;
  const [supporting, setSupporting] = useState(false);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO , Cover + Portrait + Identity
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Cover image */}
        <div className="h-72 md:h-96 overflow-hidden">
          <img src={d.banner} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/50 to-white" />
        </div>

        {/* Profile , overlaps cover */}
        <div className="relative max-w-7xl mx-auto px-6 -mt-28 md:-mt-32 z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
            {/* Portrait */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 border-white shadow-xl rounded-full">
                <img src={d.avatar} alt={d.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">
                  {d.careerStage}
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-charcoal-400 border border-stone-200 px-2 py-0.5">
                  {d.stageDetail}
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal-900 tracking-tight">{d.name}</h1>
              <p className="mt-2 text-sm text-charcoal-400">
                {d.city}, {d.country} <span className="text-stone-300 mx-2">·</span> Est. {d.establishedYear}
              </p>
              <p className="mt-2 text-sm text-charcoal-500 italic max-w-lg">{d.oneLiner}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pb-2">
              <button
                onClick={() => setSupporting(!supporting)}
                className={`px-6 py-2.5 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                  supporting
                    ? "bg-bronze-300/10 border border-bronze-400 text-bronze-600"
                    : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                }`}
              >
                {supporting ? "Supporting" : "Support This Designer"}
              </button>
              {/* Socials */}
              <div className="flex gap-2">
                {[
                  { key: "instagram", label: "Instagram", icon: "I" },
                  { key: "pinterest", label: "Pinterest", icon: "P" },
                  { key: "linkedin", label: "LinkedIn", icon: "L" },
                ].map((s) => (
                  <a key={s.key} href={d.socials[s.key]} aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. STATS BAR , mission-aligned metrics
      ═══════════════════════════════════════════════════════════ */}
      <section className="mt-12 border-y border-bronze-200/40 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-bronze-200/30">
            {[
              { value: d.stats.piecesLaunched, label: "Pieces Launched" },
              { value: d.stats.craftTraditions, label: "Craft Traditions Worked With" },
              { value: d.stats.collectionsOnAdorzia, label: "Collections on Adorzia" },
              { value: d.stats.debutYear, label: "Debut Year" },
            ].map((stat, i) => (
              <div key={i} className="py-8 px-4 md:px-6 text-center">
                <p className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">{stat.value}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-charcoal-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. ABOUT , Biography, Philosophy, Inspiration
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">About</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-16">The Designer</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Biography */}
            <div className="lg:col-span-7">
              <p className="text-charcoal-500 leading-[1.85] text-base md:text-lg">{d.about.biography}</p>

              {/* Education */}
              <div className="mt-10 border-t border-bronze-200/40 pt-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Education</p>
                <p className="text-sm text-charcoal-500">{d.about.education}</p>
              </div>
            </div>

            {/* Philosophy + Inspiration */}
            <div className="lg:col-span-5 space-y-8">
              <div className="border-l-2 border-bronze-400 pl-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-3">Philosophy</p>
                <p className="font-serif text-lg md:text-xl text-charcoal-800 italic leading-relaxed">"{d.about.philosophy}"</p>
              </div>
              <div className="border-l-2 border-stone-300 pl-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-3">Inspiration</p>
                <p className="text-charcoal-500 leading-relaxed italic">"{d.about.inspiration}"</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Languages</p>
                <p className="text-sm text-charcoal-500">{d.about.languages}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. COLLECTIONS , "The Archive"
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Body of Work</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">The Archive</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {d.collections.map((col, i) => (
              <Link key={i} to={`/collections/${col.name.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={col.img} alt={col.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">{col.season} , {col.pieces} pieces</p>
                    <h3 className="font-serif text-lg text-white">{col.name}</h3>
                    <span className="text-xs text-bronze-400/0 group-hover:text-bronze-400 transition-all duration-300 tracking-wider uppercase mt-2 inline-block">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. SELECTED WORKS , Bestsellers
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Iconic Work</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Selected Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {d.selectedWorks.map((piece, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={piece.img} alt={piece.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent" />
                </div>
                <div className="mt-4">
                  <h3 className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{piece.name}</h3>
                  <p className="text-xs text-charcoal-400 mt-1">From: {piece.collection}</p>
                  <p className="text-sm text-bronze-500 mt-1.5">{piece.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. EDITORIAL , Stories & Press
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">In the Press</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Stories & Press</h2>

          <div className="space-y-6">
            {d.press.map((item, i) => (
              <article key={i} className="border border-stone-200 bg-white p-8 hover:border-bronze-300/50 transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-charcoal-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-charcoal-400 leading-relaxed italic">"{item.excerpt}"</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs uppercase tracking-wider text-charcoal-300">{item.source}</p>
                    <p className="font-serif text-lg text-bronze-500 mt-0.5">{item.year}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. HERITAGE CRAFT USAGE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">Craft Traditions</h2>
          <p className="text-sm text-charcoal-400 max-w-xl mb-14">
            The traditional crafts this designer works with , each one a living heritage practice sustained through contemporary design.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {d.crafts.map((craft, i) => (
              <div key={i} className="border border-stone-100 bg-ivory-50 p-8 hover:border-bronze-300/50 transition-colors duration-300">
                <h3 className="font-serif text-lg text-charcoal-900 mb-1">{craft.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-500/60 mb-4">{craft.region}</p>
                <p className="text-sm text-charcoal-400 leading-relaxed">{craft.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. AWARDS & RECOGNITION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Recognition</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Awards & Features</h2>

          <div className="max-w-2xl">
            {d.awards.map((award, i) => (
              <div key={i} className={`flex items-center gap-6 py-6 ${i < d.awards.length - 1 ? "border-b border-bronze-200/30" : ""}`}>
                <span className="font-serif text-2xl text-bronze-500 shrink-0 w-16">{award.year}</span>
                <div>
                  <h3 className="text-charcoal-900 font-medium">{award.title}</h3>
                  <p className="text-xs text-charcoal-400 mt-0.5">{award.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. CONTACT & SOCIAL LINKS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Get in Touch</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">Contact & Collaborate</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Your Name" required
                    className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors" />
                  <input type="email" placeholder="Email Address" required
                    className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors" />
                </div>
                <select className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-400 text-sm focus:outline-none focus:border-bronze-400 transition-colors">
                  <option>Inquiry Type</option>
                  {d.contact.categories.map((c, i) => (
                    <option key={i}>{c}</option>
                  ))}
                </select>
                <textarea rows={5} placeholder="Your message…" required
                  className="w-full px-5 py-3.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors resize-none" />
                <button type="submit" className="bg-charcoal-900 text-white px-8 py-3 text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors inline-flex items-center gap-2">
                  Send Inquiry
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </form>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5">
              <div className="border border-stone-100 bg-ivory-50 p-8 space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Preferred Contact</p>
                  <p className="text-sm text-charcoal-900">{d.contact.preferred}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-2">Response Time</p>
                  <p className="text-sm text-charcoal-900">{d.contact.responseTime}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-3">Inquiry Categories</p>
                  <ul className="space-y-2">
                    {d.contact.categories.map((c, i) => (
                      <li key={i} className="text-sm text-charcoal-500">{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-bronze-200/30 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500/60 mb-3">Social</p>
                  <div className="flex gap-3">
                    {["Instagram", "Pinterest", "LinkedIn"].map((s) => (
                      <a key={s} href={`#${s.toLowerCase()}`}
                        className="w-10 h-10 flex items-center justify-center border border-stone-200 text-charcoal-400 text-xs hover:border-bronze-400 hover:text-bronze-500 transition-colors">
                        {s[0]}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. MORE DESIGNERS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Discover</p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium">More Designers</h2>
            </div>
            <Link to="/designers" className="hidden md:inline-flex items-center gap-2 text-sm text-bronze-500 tracking-wide hover:text-bronze-400 transition-colors">
              Browse All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {d.moreDesigners.map((other, i) => (
              <Link
                key={i}
                to={`/${other.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="shrink-0 w-60 snap-start group"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={other.img} alt={other.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-serif text-sm text-white">{other.name}</h3>
                    <p className="text-xs text-stone-400 mt-0.5">{other.city}</p>
                  </div>
                </div>
                <p className="text-xs text-charcoal-400 mt-2">{other.specialty}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
