/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white pt-14 sm:pt-20 pb-10 sm:pb-14 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-0 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1.5">
                <img src="/logo.png" alt="QuoteChaser" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <span className="font-semibold text-white text-[18px] tracking-tight">QuoteChaser</span>
            </div>
            <p className="text-[14px] leading-relaxed text-white/50 max-w-[260px]">
              The automated follow-up CRM for freelancers and agencies.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-10 gap-y-4 text-[14px] font-medium text-white/60">
            <Link href="#how-it-works" className="hover:text-white transition-colors duration-300">How it works</Link>
            <Link href="#features" className="hover:text-white transition-colors duration-300">Features</Link>
            <Link href="#pricing" className="hover:text-white transition-colors duration-300">Pricing</Link>
            <Link href="/login" className="hover:text-white transition-colors duration-300">Login</Link>
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms</Link>
            <a href="mailto:support@quotechaser.com" className="hover:text-white transition-colors duration-300">Contact</a>
          </nav>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[13px] text-white/30">
          <p>© {new Date().getFullYear()} QuoteChaser. All rights reserved.</p>
          <p>Built with love to help you win more quotes.</p>
        </div>
      </div>
    </footer>
  );
}
