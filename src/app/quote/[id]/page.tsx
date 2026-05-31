import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import Stripe from "stripe";

function getAdminSupabase() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing in environment variables.");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });
}

export default async function ClientQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabaseAdmin = getAdminSupabase();

  const { data: quote } = await supabaseAdmin
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (!quote) {
    return notFound();
  }

  const depositAmountCents = Math.round(quote.quote_amount_cents * 0.5);
  const totalAmount = (quote.quote_amount_cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  const depositAmount = (depositAmountCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

  async function handleApprove() {
    "use server";
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    const stripe = getStripe();

    // Create Stripe Checkout Session for 50% deposit
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Deposit for: ${quote.service}`,
              description: `50% deposit for project with ${quote.customer_name}`,
            },
            unit_amount: depositAmountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/quote/${id}?success=true`,
      cancel_url: `${appUrl}/quote/${id}`,
      metadata: {
        quote_id: id,
      },
    });

    if (session.url) {
      redirect(session.url);
    } else {
      // Fallback
      const supabaseAdmin = getAdminSupabase();
      await supabaseAdmin
        .from("quotes")
        .update({ status: "won" })
        .eq("id", id);
      redirect(`/quote/${id}?success=true`);
    }
  }

  // Check if it's already approved
  const isApproved = quote.status === "won";

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-[#F26522]/20">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl mx-auto shadow-sm flex items-center justify-center">
             {/* Fallback logo or initial */}
             <span className="text-xl font-bold text-gray-900 tracking-tighter">QC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
            Project Proposal
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Prepared for <strong className="text-gray-900">{quote.customer_name}</strong>
          </p>
        </div>

        {/* Success State */}
        {isApproved && (
          <div className="bg-green-50 border border-green-200 rounded-3xl p-8 mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-900 mb-2">Proposal Approved & Deposit Paid</h2>
            <p className="text-green-700 text-sm">We&apos;re thrilled to get started on this project. You&apos;ll receive a receipt via email shortly.</p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* Quote Details */}
          <div className="p-8 sm:p-10 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Service Details</h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-950 mb-1">{quote.service}</h3>
                {quote.notes && (
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                    {quote.notes}
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500 mb-1">Total Project Cost</p>
                <p className="text-3xl font-bold text-gray-950 tracking-tight">{totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Scope Protection */}
          <div className="bg-gray-50/50 p-8 sm:p-10 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Standard Terms & Scope</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                <p><strong className="text-gray-900">50% Deposit Required:</strong> Work commences immediately upon receipt of the deposit ({depositAmount}). The remaining balance is due upon completion.</p>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                <p><strong className="text-gray-900">Revision Limits:</strong> Includes up to 2 rounds of standard revisions. Additional revisions or major scope changes will be billed at an hourly rate.</p>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                <p><strong className="text-gray-900">Kill Fee:</strong> If the project is cancelled by the client after work has commenced, the 50% deposit is non-refundable to cover scheduled time.</p>
              </li>
            </ul>
          </div>

          {/* Action Area */}
          {!isApproved && (
            <div className="p-8 sm:p-10 bg-white flex flex-col items-center justify-center">
              <p className="text-sm font-semibold text-gray-900 mb-6 text-center">Ready to move forward?</p>
              <form action={handleApprove} className="w-full sm:w-auto">
                <button 
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#F26522] hover:bg-[#e05a1a] hover:scale-[1.02] active:scale-[0.98] text-white px-8 h-12 font-bold text-sm tracking-wide shadow-[0_4px_14px_0_rgba(242,101,34,0.39)] transition-all duration-200 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  Approve & Pay {depositAmount} Deposit
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Secured by Stripe. By approving, you agree to the terms above.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
