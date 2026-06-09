import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative py-24 md:py-32 bg-stone-100 overflow-hidden">
      {/* Subtle background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/home-newsletter-studio.webp"
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-white/85" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="section-label mb-4">Open Call — FW26</p>

        <h2 className="section-heading mb-6">
          Join the First Generation of
          <br />
          <span className="italic text-bronze-500">Adorzia Visionaries</span>
        </h2>

        <p className="text-charcoal-500 leading-relaxed max-w-xl mx-auto mb-12">
          We are currently accepting applications from emerging Pakistani designers
          for our inaugural Spotlight cohort — and opening early access to collectors
          worldwide. Register your interest below.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-charcoal-900 transition-colors"
            />
            <button type="submit" className="btn-primary shrink-0">
              Register Interest
            </button>
          </form>
        ) : (
          <div className="border border-bronze-500/30 bg-bronze-50 px-8 py-6 max-w-lg mx-auto">
            <p className="text-bronze-600 text-sm tracking-wide">
              Application Received — Reference: AD-2026-{Math.floor(1000 + Math.random() * 9000)}
            </p>
            <p className="text-charcoal-300 text-xs mt-2">
              Confirmation email sent. Expected review: August 2026.
            </p>
          </div>
        )}

        {/* Role-based paths */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { role: "Designer", cta: "Apply to Spotlight" },
            { role: "Partner", cta: "Explore Collaborations" },
            { role: "Investor", cta: "Request Information" },
            { role: "Media", cta: "Contact Team" },
          ].map((item, i) => (
            <a
              key={i}
              href={`/${item.role.toLowerCase()}`}
              className="group border border-stone-200 px-5 py-4 hover:border-charcoal-900 transition-colors duration-300"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-300 group-hover:text-charcoal-900 transition-colors">
                {item.role}
              </p>
              <p className="mt-1 text-xs text-charcoal-500 group-hover:text-charcoal-900 transition-colors">
                {item.cta}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
