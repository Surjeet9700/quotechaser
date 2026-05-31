/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/marketing/sections/site-footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#EFEFEF] text-gray-900 selection:bg-gray-900 selection:text-white">
      {/* Navigation */}
      <nav className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3 mt-2 sm:mt-4">
        <div className="bg-white rounded-full p-[5px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-sm border border-gray-100 p-1">
              <img src="/logo.png" alt="QuoteChaser Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </Link>
            <span className="font-semibold text-gray-900 text-[16px] sm:text-[18px] tracking-tight">QuoteChaser</span>
          </div>

          <div className="pr-1">
            <Link href="/" className="group flex items-center bg-gray-900 hover:bg-black text-white text-[12px] sm:text-[13px] font-medium rounded-full pl-4 sm:pl-5 pr-2 py-1.5 sm:py-2 gap-2 sm:gap-3 transition-transform hover:scale-[1.02]">
              <span>Back to Home</span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center text-gray-900">
                <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 my-8 sm:my-16">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-gray-100">
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#F26522] uppercase tracking-wider block mb-2">Legal Terms</span>
          <h1 className="text-[28px] sm:text-[40px] font-medium tracking-tight text-gray-900 mb-6 leading-tight">Terms of Service</h1>
          
          <div className="text-[13px] sm:text-[14px] text-gray-500 mb-8 border-b border-gray-100 pb-4">
            Last updated: May 26, 2026
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-[17px] sm:text-[19px] font-semibold text-gray-900 mb-2.5">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using QuoteChaser, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these terms, please do not access or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-[17px] sm:text-[19px] font-semibold text-gray-900 mb-2.5">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                QuoteChaser provides tools, dashboards, and automated email sequences designed to manage and follow up on submitted business quotes. We reserve the right to modify, suspend, or discontinue the service (or any part thereof) at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-[17px] sm:text-[19px] font-semibold text-gray-900 mb-2.5">3. User Accounts</h2>
              <p className="text-gray-600 leading-relaxed">
                To access features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-[17px] sm:text-[19px] font-semibold text-gray-900 mb-2.5">4. Subscriptions and Payments</h2>
              <p className="text-gray-600 leading-relaxed">
                Certain premium features of the Service require a paid subscription. Subscriptions are billed in advance on a recurring, periodic basis (monthly or annually) according to your selected plan. Subscriptions automatically renew unless canceled prior to the next billing cycle.
              </p>
            </section>

            <section>
              <h2 className="text-[17px] sm:text-[19px] font-semibold text-gray-900 mb-2.5">5. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions or concerns regarding these Terms of Service, please reach out to us at{" "}
                <a href="mailto:support@quotechaser.com" className="text-[#F26522] hover:underline font-medium">
                  support@quotechaser.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
