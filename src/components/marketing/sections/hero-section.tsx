/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Menu, X } from "lucide-react";
import { Shader, ChromaFlow, FilmGrain, FlutedGlass, Swirl } from "shaders/react";
import { RollText } from "@/components/marketing/ui/roll-text";

export function HeroSection() {
  const [time, setTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(now.toLocaleTimeString("en-GB", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-svh bg-[#EFEFEF] overflow-hidden flex flex-col">
      {/* Shaders Background */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <Shader className="w-full h-full block" style={{ width: "100%", height: "100%" }}>
          <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
          <ChromaFlow baseColor="#ffffff" downColor="#ff5f03" leftColor="#ff5f03" rightColor="#ff5f03" upColor="#ff5f03" momentum={13} radius={3.5} />
          <FlutedGlass aberration={0.61} angle={31} frequency={8} highlight={0.12} highlightSoftness={0} lightAngle={-90} refraction={4} shape="rounded" softness={1} speed={0.15} />
          <FilmGrain strength={0.05} />
        </Shader>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3 mt-2 sm:mt-4">
        <div className="bg-white rounded-full p-[5px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-sm border border-gray-100 p-1">
              <img src="/logo.png" alt="QuoteChaser Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-[14px] text-gray-900 font-medium">
              <Link href="#how-it-works" className="hover:text-gray-500 transition-colors duration-300">How it works</Link>
              <Link href="#features" className="hover:text-gray-500 transition-colors duration-300">Features</Link>
              <Link href="#pricing" className="hover:text-gray-500 transition-colors duration-300">Pricing</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 pr-1">
            <span className="text-[13px] text-gray-600 hidden lg:block">Stop losing jobs to bad follow-up</span>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-600 mr-2">
              <Clock className="w-[14px] h-[14px]" />
              <span>{time || "12:00"} in London</span>
            </div>
            <Link href="/login" className="group flex items-center bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 gap-3 transition-transform hover:scale-[1.02]">
              <RollText text="Start your free trial" />
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-900">
                <ArrowRight className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>
            </Link>
          </div>

          <button
            className="md:hidden w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-20 flex-1 flex flex-col justify-end max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
        <p className="text-[12px] sm:text-[13px] text-[#F26522] tracking-wide mb-4 uppercase font-bold">The Anti-Ghosting Decision Engine</p>
        <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
          Stop getting ghosted <br className="hidden sm:block" />
          on your proposals. <br className="hidden sm:block" />
          Meet the Next-Action Queue.
        </h1>
        <p className="text-[14px] sm:text-[16px] leading-[1.6] text-gray-600 max-w-2xl mt-5 font-medium">
          Spreadsheets are a chore. Bloated CRMs force you to do all the thinking. QuoteChaser works as a single-screen Next-Action Queue—giving you B2B-proven follow-up templates to chase open estimates in 1-click without feeling like a pest.
        </p>


        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
          <Link href="/login" className="group flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 gap-3 transition-all duration-300">
            <RollText text="Start your 7-day trial" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-[#F26522]">
              <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
            </div>
          </Link>

          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 rounded-[4px] px-2 py-1.5 cursor-default">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#E8704E]">
              <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/>
            </svg>
            <span className="text-[13px] sm:text-[14px] font-medium ml-1">Stripe Partner</span>
            <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded ml-2">Verified</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 md:hidden animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl mx-3 mb-3 p-6 animate-in slide-in-from-bottom-full duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-[13px] text-gray-600 border border-gray-200 rounded-full px-3 py-1">
                <Clock className="w-4 h-4" />
                <span>{time || "12:00"} in London</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4 text-[28px] font-medium mb-12">
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
              <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </div>
            <Link href="/login" className="flex items-center justify-between w-full bg-gray-900 text-white rounded-full pl-6 pr-2 py-2">
              <span className="font-medium text-lg">Get Started</span>
              <div className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5 -rotate-45" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
