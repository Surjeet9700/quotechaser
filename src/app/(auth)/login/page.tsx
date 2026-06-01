import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { LoginBackground } from "@/components/auth/login-background";
import Link from "next/link";

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function LoginPage() {
  if (!hasSupabaseConfig()) {
    return <SetupRequired />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const devBypassEnabled = process.env.ENABLE_DEV_BYPASS === "true";

  return (
    <main className="relative w-full h-svh bg-[#EFEFEF] overflow-hidden flex flex-col items-center justify-center text-gray-900 selection:bg-gray-900 selection:text-white">
      <LoginBackground />

      {/* Login Card */}
      <section className="relative z-20 w-full max-w-md px-4 sm:px-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-8 sm:p-10 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-sm border border-gray-100 p-2 mb-5 hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="QuoteChaser Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </Link>
            <h1 className="text-[24px] font-bold tracking-tight text-gray-900 text-center">Welcome back</h1>
            <p className="text-gray-500 text-[13px] font-medium mt-1.5 leading-relaxed text-center">Sign in to manage your pipeline.</p>
          </div>
          
          <LoginForm devBypassEnabled={devBypassEnabled} />
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
