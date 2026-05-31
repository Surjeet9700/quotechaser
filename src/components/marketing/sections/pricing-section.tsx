 
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { RollText } from "@/components/marketing/ui/roll-text";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For freelancers just getting started.",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Start for free",
    ctaHref: "/login",
    highlight: false,
    badge: null,
    features: [
      "Up to 5 active quotes",
      "1 follow-up sequence per quote",
      "Basic email templates",
      "Quote status tracking",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For freelancers serious about closing.",
    monthlyPrice: 19,
    annualPrice: 14,
    cta: "Start 7-day free trial",
    ctaHref: "/login",
    highlight: true,
    badge: null,
    features: [
      "Unlimited active quotes",
      "Smart automated sequences",
      "B2B proven follow-up templates",
      "Revenue pipeline dashboard",
      "Custom branding on emails",
      "Priority support",
    ],
  },
];

const FAQS = [
  {
    q: "Do I send emails automatically or do I copy-paste them?",
    a: "You have both options. Pro users can trigger automatic transactional delivery directly from QuoteChaser. If you prefer high-touch control, you can use our 1-click copy actions to send B2B-proven email and SMS drafts from your own personal inbox or phone.",
  },
  {
    q: "What is the follow-up cadence schedule?",
    a: "QuoteChaser operates a B2B-proven cadence: Day 2 (The Bump), Day 7 (The Check-in), Day 14 (The Resource), and Day 30 (The Breakup). The dashboard places outstanding estimates in your Next-Action Queue exactly when the outreach day arrives.",
  },
  {
    q: "Can I customize templates and brand my signature?",
    a: "Yes. In Settings, you can configure your sender details, business name, phone, and a custom multi-line signature. In the Templates tab, you can completely rewrite the body of all follow-ups using dynamic tags that auto-populate client and service details.",
  },
  {
    q: "Do I need a credit card to start the free trial?",
    a: "No. You can start the 7-day Pro trial with just your email — no credit card required. We will remind you before the trial expires.",
  },
  {
    q: "What happens to my quotes if I cancel my subscription?",
    a: "If you cancel, you downgrade to our Starter plan. You keep read-only access to all quote tracking history forever. Your business data is always yours.",
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section badge */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
            3
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            Simple pricing
          </div>
        </div>

        {/* Headline + toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <h2 className="text-[clamp(1.75rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 max-w-xl">
            Start free. Pay only<br className="hidden sm:block" /> when it pays for itself.
          </h2>

          {/* Monthly / Annual toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-[13px] font-medium transition-colors ${!annual ? "text-gray-900" : "text-gray-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? "bg-gray-900" : "bg-gray-200"}`}
              aria-label="Toggle annual billing"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${annual ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-[13px] font-medium transition-colors ${annual ? "text-gray-900" : "text-gray-400"}`}>
              Annual
              <span className="ml-1.5 text-[11px] bg-[#F26522] text-white rounded-full px-2 py-0.5 font-semibold">
                Save 26%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-16 sm:mb-20 max-w-3xl">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 sm:p-8 flex flex-col transition-shadow duration-300 ${
                plan.highlight
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/20"
                  : "bg-[#F5F5F5] text-gray-900"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-7">
                  <span className="bg-[#F26522] text-white text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name + tagline */}
              <div className="mb-6">
                <h3 className={`text-[17px] font-semibold tracking-tight mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-[13px] leading-relaxed ${plan.highlight ? "text-white/60" : "text-gray-500"}`}>
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-start gap-1">
                  <span className={`text-[20px] font-medium mt-1.5 ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>$</span>
                  <span className={`text-[52px] font-medium leading-none tracking-[-0.04em] ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                </div>
                <p className={`text-[12px] mt-1 ${plan.highlight ? "text-white/50" : "text-gray-400"}`}>
                  {plan.monthlyPrice === 0 ? "free forever" : annual ? "/ mo, billed annually" : "/ month"}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-[13px] sm:text-[14px] font-medium">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-white/20" : "bg-gray-200"}`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlight ? "text-white" : "text-gray-900"}`} strokeWidth={3} />
                    </div>
                    <span className={plan.highlight ? "text-white/90" : "text-gray-700"}>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`group flex items-center justify-between w-full rounded-full pl-5 pr-2 py-2 text-[13px] sm:text-[14px] font-medium transition-all duration-300 ${
                  plan.highlight
                    ? "bg-[#F26522] hover:bg-[#e05a1a] text-white"
                    : "bg-gray-900 hover:bg-black text-white"
                }`}
              >
                <RollText text={plan.cta} />
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-white/20" : "bg-white/10"}`}>
                  <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                </div>
              </Link>

              {plan.highlight && (
                <p className="text-[11px] text-white/40 text-center mt-3">
                  No credit card required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Social proof strip */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-16 sm:mb-20 pb-16 sm:pb-20 border-b border-gray-100">
          {[
            { stat: "20%", label: "more quotes closed on average" },
            { stat: "< 5 min", label: "to set up your first sequence" },
            { stat: "£0", label: "credit card needed to start" },
          ].map(({ stat, label }) => (
            <div key={stat} className="flex items-center gap-3">
              <span className="text-[22px] sm:text-[26px] font-semibold text-gray-900 tracking-tight">{stat}</span>
              <span className="text-[13px] text-gray-500 max-w-[120px] leading-snug">{label}</span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl">
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-gray-900 mb-6">Common questions</h3>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-[14px] font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {faq.q}
                  <span className={`ml-4 shrink-0 text-gray-400 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-[13px] sm:text-[14px] text-gray-500 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
