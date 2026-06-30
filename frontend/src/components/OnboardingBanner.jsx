import { Link } from "react-router-dom";
import { useState } from "react";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
const IconCircle = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><circle cx="12" cy="12" r="9"/></svg>;
const IconX = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;

/* ───────────────────────────────────────────────────────────────────── */
export default function OnboardingBanner({ onboarding, designerName }) {
  const [dismissed, setDismissed] = useState(false);

  if (!onboarding || onboarding.onboardingComplete || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("designer-onboarding-dismissed", "true");
    setDismissed(true);
  };

  // Calculate progress
  const steps = [
    { label: "Complete your studio profile", done: onboarding.hasProfile, link: "/designer-dashboard/settings" },
    { label: "Create your first collection", done: onboarding.hasCollection, link: "/designer-dashboard/collections/new" },
  ];
  const completedSteps = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  const currentStep = steps.find((s) => !s.done);
  const stepLabel = currentStep ? currentStep.label : "You're all set!";
  const stepLink = currentStep ? currentStep.link : "/designer-dashboard";

  return (
    <div className="relative bg-amber-50 border-l-4 border-bronze-400 p-6 pr-12">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-charcoal-400 hover:text-charcoal-700 transition-colors"
        aria-label="Dismiss onboarding"
      >
        <IconX className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-600 mb-1">Welcome to Adorzia</p>
        <h3 className="font-serif text-2xl text-charcoal-900">
          Let's get your studio ready, {designerName?.split(" ")[0] || "Designer"}
        </h3>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-charcoal-500 mb-2">
          <span>Step {completedSteps + 1} of {steps.length}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-stone-200 overflow-hidden">
          <div
            className="h-full bg-bronze-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps checklist */}
      <div className="space-y-2 mb-6">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-start gap-3 text-sm ${s.done ? "text-charcoal-500" : "text-charcoal-900"}`}>
            <div className={`mt-0.5 w-5 h-5 flex items-center justify-center shrink-0 ${
              s.done ? "text-bronze-500" : "text-charcoal-300"
            }`}>
              {s.done ? <IconCheck className="w-4 h-4" /> : <IconCircle className="w-4 h-4" />}
            </div>
            <span className={s.done ? "line-through opacity-60" : "font-medium"}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {steps.filter((s) => !s.done).slice(0, 2).map((s, i) => (
          <Link
            key={i}
            to={s.link}
            className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors text-center ${
              i === 0
                ? "bg-charcoal-900 text-white hover:bg-charcoal-800"
                : "bg-white text-charcoal-700 border border-stone-300 hover:border-charcoal-400"
            }`}
          >
            {s.label}
          </Link>
        ))}
        <button
          onClick={handleDismiss}
          className="px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal-500 hover:text-charcoal-700 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
