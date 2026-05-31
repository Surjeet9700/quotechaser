 
import { ArrowRight } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto">
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
            2
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            Features
          </div>
        </div>

        <div className="px-5 sm:px-8 lg:px-12">
          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16 max-w-4xl">
            Everything you need to <br className="hidden sm:block" />
            win the job.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
          {/* Card 1 - Proven Templates */}
          <div className="flex flex-col">
            <div className="relative aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] group cursor-pointer">
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[148px] bg-white rounded-full flex items-center justify-between p-1 transition-all duration-300 ease-in-out overflow-hidden shadow-lg">
                <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap text-[13px] font-medium text-gray-900 pl-3 transition-opacity duration-300 delay-100">
                  See templates
                </span>
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 text-gray-900">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed font-medium">
              Deploy pre-saved, psychology-backed follow-up sequences. Remove the emotional friction and awkwardness of chasing quiet clients with 1-click plain text cadences that convert.
            </p>
            <h3 className="text-[14px] sm:text-[15px] font-bold text-gray-900 mt-1">Anti-Ghosting Templates</h3>
          </div>

          {/* Card 2 - Revenue Pipeline */}
          <div className="flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] group cursor-pointer">
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[168px] bg-gray-900 rounded-full flex items-center justify-between p-1 transition-all duration-300 ease-in-out overflow-hidden shadow-lg">
                <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap text-[13px] font-medium text-white pl-3 transition-opacity duration-300 delay-100">
                  Track decisions
                </span>
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
            </div>
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed font-medium">
              Ditch complicated sales pipelines and spreadsheets. See exactly who to contact today, prioritizing your highest-value outstanding quotes inside a clean, decision-driven queue.
            </p>
            <h3 className="text-[14px] sm:text-[15px] font-bold text-gray-900 mt-1">Next-Action Decision Queue</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
