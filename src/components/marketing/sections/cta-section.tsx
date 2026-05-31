 
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RollText } from "@/components/marketing/ui/roll-text";

export function CtaSection() {
  return (
    <section className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
            4
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            Get started today
          </div>
        </div>

        <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16 max-w-5xl">
          Stop letting proposals go cold. <br className="hidden sm:block" />
          Claim your Next-Action Queue today.
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Link href="/login" className="group flex items-center bg-gray-900 hover:scale-[1.02] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 gap-3 transition-transform duration-300">
            <RollText text="Start your free trial" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-gray-900">
              <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
            </div>
          </Link>
          <Link href="/login" className="group flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 gap-3 transition-all duration-300">
            <RollText text="See the dashboard" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-[#F26522]">
              <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
