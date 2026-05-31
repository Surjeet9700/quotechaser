/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RollText } from "@/components/marketing/ui/roll-text";

export function AboutSection() {
  return (
    <section id="how-it-works" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
            1
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            The Follow-Up Gap
          </div>
        </div>

        <div className="px-5 sm:px-8 lg:px-12">
          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-20 max-w-5xl">
            80% of deals require 5 follow-ups to close. <br className="hidden sm:block" />
            Yet 44% of freelancers give up after just one attempt.
          </h2>
        </div>

        <div className="px-5 sm:px-8 lg:px-12">
          {/* Mobile/Tablet Stacked Layout */}
          <div className="lg:hidden flex flex-col gap-8">
            <div>
              <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-600 mb-6">
                Most deals are still highly alive when they go quiet. QuoteChaser turns the awkward, emotional procrastination of chasing open quotes into a painless, 1-click decision routine. Never get ghosted on a proposal again.
              </p>
              <Link href="/login" className="group inline-flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 gap-3 transition-all">
                <RollText text="See how the queue works" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-[#F26522]">
                  <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                </div>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                alt="Dashboard stats"
                className="sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl object-cover"
              />
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                alt="Quote tracking"
                className="sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl object-cover"
              />
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
            <div className="self-end">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
                alt="Dashboard stats"
                className="w-full aspect-[438/346] rounded-2xl object-cover"
              />
            </div>
            <div className="self-start flex flex-col justify-end items-start h-full pb-10 xl:pb-16 pl-4">
              <p className="text-[16px] xl:text-[17px] leading-[1.65] font-medium text-gray-600 mb-8">
                Most client leads are still highly alive when they<br />
                go quiet. QuoteChaser turns the awkward, emotional<br />
                procrastination of chasing open estimates into a<br />
                painless, 1-click decision routine.
              </p>
              <Link href="/login" className="group inline-flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white text-[14px] font-medium rounded-full pl-6 pr-2 py-2 gap-3 transition-all">
                <RollText text="Claim your action queue" />
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#F26522]">
                  <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                </div>
              </Link>
            </div>
            <div className="self-end">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
                alt="Quote tracking"
                className="w-full aspect-[3/2] rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
