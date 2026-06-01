 
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions";
import { ProfileForm } from "./profile-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If the trigger failed or user is older than the trigger, profile might be null.
  if (!profile) {
    profile = {
      sender_name: "",
      business_name: "",
      phone: "",
      signature: "",
    };
  }

  const isSubscribed = !!profile?.stripe_subscription_id;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-background">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Manage your business profile and subscription.</p>
        </div>
        <form action={signOut}>
          <button 
            type="submit" 
            className="rounded-full bg-card hover:bg-muted text-foreground px-4 h-9 border border-border font-bold text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign Out
          </button>
        </form>
      </header>

      {/* Renders the cohesive settings profile brand forms and real-time live preview */}
      <ProfileForm profile={profile} userEmail={user.email || ""} isSubscribed={isSubscribed} />
    </div>
  );
}
