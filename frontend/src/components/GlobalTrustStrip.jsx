import useReveal from "../hooks/useReveal";

const IconGlobe = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconBadge = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>;
const IconSparkle = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83"/></svg>;
const IconLock = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;

const trusts = [
  { icon: IconGlobe, title: "Ships to 47 Countries", sub: "Worldwide express delivery" },
  { icon: IconBadge, title: "Handmade & Authentic", sub: "Every piece verified" },
  { icon: IconSparkle, title: "Emerging Designers Only", sub: "Fresh talent, fresh vision" },
  { icon: IconLock, title: "Secure Checkout", sub: "SSL encrypted payments" },
];

export default function GlobalTrustStrip() {
  const ref = useReveal();

  return (
    <section className="bg-stone-50 border-t border-b border-bronze-200">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {trusts.map((t) => (
            <div key={t.title} className="text-center">
              <t.icon className="w-7 h-7 mx-auto text-charcoal-700 mb-3" />
              <p className="text-sm text-charcoal-800 font-medium">{t.title}</p>
              <p className="text-xs text-charcoal-300 mt-1">{t.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
