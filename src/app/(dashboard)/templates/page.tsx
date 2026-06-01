/* eslint-disable react/no-unescaped-entities */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TemplateList } from "./template-list";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .eq("user_id", user.id)
    .order("stage_day", { ascending: true });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-background">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Message Templates</h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">
          Customize your follow-up messaging. These templates automatically pull in your customer's details and your profile information.
        </p>
      </header>

      <TemplateList templates={templates || []} />
    </div>
  );
}
