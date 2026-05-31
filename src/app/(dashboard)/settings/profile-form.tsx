/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions";
import { StripeButton } from "@/components/dashboard/stripe-button";
import { Loader2 } from "lucide-react";

export function ProfileForm({
  profile,
  userEmail,
  isSubscribed,
}: {
  profile: any;
  userEmail: string;
  isSubscribed: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  // Controlled states for live preview
  const [senderName, setSenderName] = useState(profile?.sender_name || "");
  const [businessName, setBusinessName] = useState(profile?.business_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [signature, setSignature] = useState(profile?.signature || "");

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated successfully");
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
      
      {/* Left Column - Forms & Settings */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Profile Card */}
        <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-6 sm:p-8">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-950 tracking-tight">Business Profile</h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              These details dynamically populate follow-up emails sent to your clients.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="senderName" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Sender Name
                </label>
                <input
                  id="senderName"
                  name="senderName"
                  type="text"
                  placeholder="Jane Doe"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="businessName" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Acme Corp"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  readOnly
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[13px] text-gray-400 font-medium cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="signature" className="text-[12px] font-semibold text-gray-700 block">
                  Email Signature
                </label>
                <span className="text-[10px] text-gray-400 font-medium italic">Wraps the end of follow-ups</span>
              </div>
              <textarea
                id="signature"
                name="signature"
                placeholder="Best regards,&#10;Jane Doe&#10;Owner, Acme Corp"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full min-h-[100px] p-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full font-bold text-[12px] uppercase tracking-wider px-5 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : null}
              <span>{isPending ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </form>

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)] p-6 sm:p-8">
          <div className="mb-4 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-950 tracking-tight">Subscription</h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">Manage your current billing cycle and plan features.</p>
          </div>
          
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F26522] animate-pulse shrink-0" />
                <p className="font-bold text-[14px] text-gray-950">Pro Plan (Beta)</p>
              </div>
              <p className="text-gray-400 text-xs mt-1.5 font-medium leading-relaxed max-w-md">
                {isSubscribed 
                  ? "Your Pro subscription is active. Enjoy unlimited automated quotes." 
                  : "Upgrade to Pro to unlock unlimited proposal tracking and email automation."}
              </p>
            </div>
            <StripeButton isSubscribed={isSubscribed} />
          </div>
        </div>
      </div>

      {/* Right Column - Plain Text Email Preview Pane */}
      <div className="lg:col-span-5 lg:sticky lg:top-6 self-start space-y-4">
        
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-6">
          <div className="mb-4 border-b border-gray-100 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Client Follow-up Preview
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              Plain Text Format
            </span>
          </div>

          {/* Email Headers Block */}
          <div className="text-[12px] space-y-2 border-b border-gray-100 pb-4 mb-4">
            <div className="flex">
              <span className="text-gray-400 font-semibold w-16">From:</span>
              <span className="text-gray-700 font-medium truncate">
                {senderName || <span className="text-gray-300 italic">[Sender Name]</span>}{" "}
                <span className="text-gray-400">&lt;{userEmail}&gt;</span>
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 font-semibold w-16">To:</span>
              <span className="text-gray-700 font-medium">client@example.com</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 font-semibold w-16">Subject:</span>
              <span className="text-gray-800 font-bold truncate">
                Re: Quote for Web Design - {businessName || <span className="text-gray-300 italic">[Business Name]</span>}
              </span>
            </div>
          </div>

          {/* Email Body Area */}
          <div className="text-[13px] text-gray-600 leading-relaxed space-y-4 font-sans py-2 min-h-[180px] flex flex-col justify-between">
            <div className="space-y-3">
              <p>Hi Alex,</p>
              <p>
                Just floating this to the top of your inbox. Did you have any questions about the quote we sent for <span className="font-bold text-[#F26522]">Web Design</span>?
              </p>
              <p>
                Let me know if you need me to adjust anything to make this work.
              </p>
            </div>

            {/* Email Signature Section */}
            <div className="border-t border-gray-100 pt-4 mt-6 text-gray-500 text-[12px] space-y-2">
              {signature ? (
                <div className="whitespace-pre-wrap leading-relaxed text-gray-600 font-medium italic border-l border-gray-200 pl-3">
                  {signature}
                </div>
              ) : (
                <div className="text-gray-300 italic">
                  No signature configured.
                </div>
              )}

              {phone && (
                <div className="text-gray-400 font-semibold text-[11px] pt-1">
                  Phone: {phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available placeholders helper table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-5">
          <h4 className="text-[12px] font-bold text-gray-950 mb-3 tracking-tight">Available Placeholders</h4>
          <div className="space-y-2.5">
            {[
              { tag: "{{customer_name}}", desc: "Client name" },
              { tag: "{{service}}", desc: "Service quoted" },
              { tag: "{{sender_name}}", desc: "Your name" },
              { tag: "{{business_name}}", desc: "Your business" }
            ].map((item) => (
              <div key={item.tag} className="flex justify-between items-center text-[11px]">
                <span className="font-mono font-bold text-[#F26522] bg-[#F26522]/5 px-2 py-0.5 rounded border border-[#F26522]/10">
                  {item.tag}
                </span>
                <span className="text-gray-400 font-medium">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
