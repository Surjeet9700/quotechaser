/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import { Clipboard, Mail } from "lucide-react";
import { devBypassLogin, signInWithEmail } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function LoginPage(props: { searchParams: SearchParams }) {
  if (!hasSupabaseConfig()) {
    return <SetupRequired />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const authStatus = searchParams.auth;
  const authMessage = searchParams.message;

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_480px] bg-[#EFEFEF] text-gray-900 selection:bg-white selection:text-gray-900">
      {/* Left panel: Value prop showcase */}
      <section className="flex flex-col justify-between p-8 sm:p-12 bg-gray-900 text-white relative overflow-hidden">
        {/* Subtle glowing decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F26522]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm border border-white/10">
            <img src="/logo.png" alt="QuoteChaser Logo" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">QuoteChaser</span>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-2xl">
          <span className="text-[11px] font-semibold text-[#F26522] uppercase tracking-wider block mb-3">Simple Quote Automation</span>
          <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white">
            Stop losing quotes because follow-up lives in your head.
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-[14px] leading-relaxed">
            Add a quote in 20 seconds, see exactly when it's due, copy a psychology-backed follow-up template, and secure more business. No complex CRM setup needed.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-3xl">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm relative overflow-hidden">
              <p className="font-semibold text-white text-[13px] uppercase tracking-wider">1. Add Quote</p>
              <p className="text-white/50 text-[12px] mt-2 leading-relaxed">Enter customer name, sent date, and quote value.</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm relative overflow-hidden">
              <p className="font-semibold text-white text-[13px] uppercase tracking-wider">2. Automate</p>
              <p className="text-white/50 text-[12px] mt-2 leading-relaxed">Receive follow-up sequences at Day 2, 7, 14, and 30.</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm relative overflow-hidden">
              <p className="font-semibold text-white text-[13px] uppercase tracking-wider">3. Track ROI</p>
              <p className="text-white/50 text-[12px] mt-2 leading-relaxed">Track closed wins and watch your revenue grow.</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-white/40 text-[12px] font-medium">
          Built with love for freelancers, solo service professionals, and tiny B2B agencies.
        </p>
      </section>

      {/* Right panel: Login card */}
      <section className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h2 className="text-[22px] font-semibold tracking-tight text-gray-900">Start with email</h2>
            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">We will send a magic sign-in link to your inbox. No passwords, no extra accounts.</p>
          </div>
          
          <div className="space-y-4">
            {authStatus === "error" && (
              <div className="border-red-200 bg-red-50 text-red-700 rounded-2xl border p-4 text-xs font-medium leading-relaxed">
                <strong className="font-semibold">Error: </strong>
                {authMessage || "An unknown error occurred"}
              </div>
            )}
            {authStatus === "missing-email" && (
              <div className="border-red-200 bg-red-50 text-red-700 rounded-2xl border p-4 text-xs font-medium leading-relaxed">
                Please provide a valid email address.
              </div>
            )}
            {authStatus === "check-email" && (
              <div className="border-[#F26522]/20 bg-[#F26522]/5 text-[#F26522] rounded-2xl border p-4 text-xs font-medium leading-relaxed">
                ✨ We sent you a magic link. Check your inbox to sign in!
              </div>
            )}

            <form action={signInWithEmail}>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    required
                    type="email"
                    placeholder="you@company.com"
                    className="h-10 rounded-full border-gray-200 px-4 text-sm focus-visible:ring-[#F26522]/30 focus-visible:border-[#F26522]"
                  />
                </Field>
                <SubmitButton />
                {process.env.ENABLE_DEV_BYPASS === "true" && (
                  <Button
                    type="submit"
                    formAction={devBypassLogin}
                    formNoValidate
                    className="w-full bg-gray-900 hover:bg-black text-white rounded-full font-semibold h-10 flex items-center justify-center border-none shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                  >
                    Dev Bypass (Login as Demo User)
                  </Button>
                )}
              </FieldGroup>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function SetupRequired() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Connect Supabase to run the MVP</CardTitle>
          <CardDescription>
            This build no longer uses dummy data. Create a Supabase project, run
            `supabase/schema.sql`, then set the environment variables from `.env.example`.
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-muted/40 rounded-lg border p-4 font-mono text-sm">
          NEXT_PUBLIC_SUPABASE_URL
          <br />
          NEXT_PUBLIC_SUPABASE_ANON_KEY
          <br />
          NEXT_PUBLIC_APP_URL
          <br />
          NEXT_PUBLIC_STRIPE_PAYMENT_LINK
        </CardContent>
      </Card>
    </main>
  );
}
