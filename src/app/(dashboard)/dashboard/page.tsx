 
import { signOut } from "@/app/actions";
import { Dashboard } from "@/components/dashboard/index";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { QuoteRow } from "@/components/dashboard/types";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: quotes, error } = await supabase
    .from("quotes")
    .select(
      "id, customer_name, contact_name, email, phone, service, quote_amount_cents, quote_sent_on, status, last_touch_at, notes, next_follow_up_at, follow_up_stage, last_follow_up_channel, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .eq("user_id", user.id)
    .order("stage_day", { ascending: true });

  return (
    <Dashboard
      paymentLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || ""}
      quotes={(quotes ?? []) as QuoteRow[]}
      templates={templates || []}
      profile={profile}
    >
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </Dashboard>
  );
}
