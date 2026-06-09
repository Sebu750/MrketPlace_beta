import { useState } from "react";
import useReveal from "../hooks/useReveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div ref={ref} className="reveal max-w-2xl mx-auto px-6">
        {/* Corner bracket frame */}
        <div className="p-10 md:p-14 text-center">
          {!submitted ? (
            <>
              <p className="section-label mb-4">Stay Connected</p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium">
                First to Know.
              </h2>
              <p className="mt-4 text-charcoal-400 text-sm leading-relaxed max-w-sm mx-auto">
                New designer drops, heritage stories, and exclusive access —
                delivered to your inbox before anyone else.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-5 py-3 text-sm border border-bronze-300 bg-white text-charcoal-800 placeholder:text-charcoal-300 focus:border-bronze-500 focus:outline-none transition-colors"
                />
                <button type="submit" className="btn-primary whitespace-nowrap px-8">
                  Subscribe
                </button>
              </form>
              <p className="mt-4 text-[10px] text-charcoal-300 uppercase tracking-wider">
                No spam · Unsubscribe anytime
              </p>
            </>
          ) : (
            <div className="py-6">
              <p className="section-label mb-3">Welcome</p>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">
                You're on the list.
              </h2>
              <p className="mt-3 text-charcoal-400 text-sm">
                Expect something beautiful soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
