 
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const eventName = body?.eventName;

  if (typeof eventName !== "string" || eventName.length > 80) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { error } = await supabase.from("app_events").insert({
    event_name: eventName,
    properties: body?.properties ?? {},
    user_id: user.id,
  });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
