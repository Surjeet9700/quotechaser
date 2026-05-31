"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type QuoteStatus = "open" | "won" | "lost" | "snoozed";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

async function currentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  return { supabase, userId: user.id };
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect("/?auth=missing-email");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appUrl()}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/?auth=error&message=${encodeURIComponent(error.message)}`);
  }

  redirect("/?auth=check-email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createQuote(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const amount = Math.round(Number(formData.get("amount") || 0) * 100);
  const quoteSentOn = String(formData.get("quoteSentOn") || "");

  // Default next follow up is +2 days
  const nextFollowUpAt = new Date(`${quoteSentOn}T00:00:00`);
  nextFollowUpAt.setDate(nextFollowUpAt.getDate() + 2);

  const { error } = await supabase.from("quotes").insert({
    contact_name: String(formData.get("contactName") || "").trim(),
    customer_name: String(formData.get("customerName") || "").trim(),
    email: String(formData.get("email") || "").trim() || null,
    last_touch_at: null,
    notes: String(formData.get("notes") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    quote_amount_cents: amount,
    quote_sent_on: quoteSentOn,
    service: String(formData.get("service") || "").trim(),
    status: "open",
    user_id: userId,
    next_follow_up_at: nextFollowUpAt.toISOString(),
    follow_up_stage: 2,
  });

  if (error) {
    return { error: error.message };
  }

  await supabase.from("app_events").insert({
    event_name: "quote_created",
    properties: { amount_cents: amount },
    user_id: userId,
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateQuote(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const id = String(formData.get("id") || "");
  const amount = Math.round(Number(formData.get("amount") || 0) * 100);

  const { error } = await supabase
    .from("quotes")
    .update({
      contact_name: String(formData.get("contactName") || "").trim(),
      customer_name: String(formData.get("customerName") || "").trim(),
      email: String(formData.get("email") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
      phone: String(formData.get("phone") || "").trim() || null,
      quote_amount_cents: amount,
      service: String(formData.get("service") || "").trim(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateQuoteStatus(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as QuoteStatus;

  if (!["open", "won", "lost", "snoozed"].includes(status)) {
    return { error: "Invalid status" };
  }

  const { error } = await supabase
    .from("quotes")
    .update({
      last_touch_at: new Date().toISOString(),
      status,
      // Clear next_follow_up_at if won or lost so it leaves the Today queue
      ...(status === "won" || status === "lost" ? { next_follow_up_at: null } : {}),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  await supabase.from("app_events").insert({
    event_name: `quote_marked_${status}`,
    properties: { quote_id: id },
    user_id: userId,
  });

  revalidatePath("/");
}

export async function logFollowUp(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const id = String(formData.get("id") || "");
  const channel = String(formData.get("channel") || "manual");
  const currentStage = Number(formData.get("currentStage") || 2);
  const quoteSentOn = String(formData.get("quoteSentOn") || "");

  if (!id) return { error: "Missing quote ID" };

  // Calculate next stage
  let nextStageDay: number | null = null;
  if (currentStage === 2) nextStageDay = 7;
  else if (currentStage === 7) nextStageDay = 14;
  else if (currentStage === 14) nextStageDay = 30;
  else nextStageDay = null; // after 30, it stops

  let nextFollowUpAt: string | null = null;
  if (nextStageDay !== null && quoteSentOn) {
    const nextDate = new Date(`${quoteSentOn}T00:00:00`);
    nextDate.setDate(nextDate.getDate() + nextStageDay);
    nextFollowUpAt = nextDate.toISOString();
  }

  const { error: logError } = await supabase.from("quote_follow_ups").insert({
    quote_id: id,
    user_id: userId,
    channel,
  });

  if (logError) return { error: logError.message };

  const { error: quoteError } = await supabase
    .from("quotes")
    .update({
      last_touch_at: new Date().toISOString(),
      last_follow_up_channel: channel,
      follow_up_stage: nextStageDay,
      next_follow_up_at: nextFollowUpAt,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (quoteError) return { error: quoteError.message };

  revalidatePath("/");
  return { success: true };
}

export async function deleteQuote(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const id = String(formData.get("id") || "");

  const { error } = await supabase.from("quotes").delete().eq("id", id).eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  await supabase.from("app_events").insert({
    event_name: "quote_deleted",
    properties: { quote_id: id },
    user_id: userId,
  });

  revalidatePath("/");
}

export async function devBypassLogin() {
  if (process.env.ENABLE_DEV_BYPASS !== "true") {
    throw new Error("Dev bypass is disabled.");
  }

  const DEV_EMAIL = "dev@quotechaser.local";
  const DEV_PASSWORD = "dev-bypass-password-123!";

  // Use the admin client (service role) — bypasses email confirmation & rate limits entirely
  const admin = createAdminClient();

  // Try to find the existing dev user first
  const { data: listData } = await admin.auth.admin.listUsers();
  const existingUser = listData?.users?.find((u) => u.email === DEV_EMAIL);

  if (!existingUser) {
    // Create the dev user with email_confirm: true — no email sent, no rate limit
    const { error: createError } = await admin.auth.admin.createUser({
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
      email_confirm: true,
    });
    if (createError) {
      redirect(
        `/?auth=error&message=${encodeURIComponent(`Admin create failed: ${createError.message}`)}`
      );
    }
  }

  // Now sign in as the dev user using the regular client
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: DEV_EMAIL,
    password: DEV_PASSWORD,
  });

  if (signInError) {
    redirect(
      `/?auth=error&message=${encodeURIComponent(`Sign-in failed: ${signInError.message}`)}`
    );
  }

  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      sender_name: String(formData.get("senderName") || "").trim(),
      business_name: String(formData.get("businessName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      signature: String(formData.get("signature") || "").trim(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateTemplate(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const id = String(formData.get("id") || "");
  const body = String(formData.get("body") || "").trim();
  
  const { error } = await supabase
    .from("templates")
    .update({ body })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/templates");
  return { success: true };
}

export async function resetTemplates() {
  const { supabase, userId } = await currentUserId();

  // Delete all existing templates
  await supabase.from("templates").delete().eq("user_id", userId);

  // Re-insert default templates
  const { error } = await supabase.from("templates").insert([
    {
      user_id: userId,
      name: "Day 2 — The Bump",
      timing_label: "Send 2 days after quoting",
      stage_day: 2,
      body: "Hi {{customer_name}},\n\nJust floating this to the top of your inbox. Did you have any questions about the quote for {{service}}?\n\nThanks,\n{{sender_name}}\n{{business_name}}"
    },
    {
      user_id: userId,
      name: "Day 7 — The Check-in",
      timing_label: "Send 1 week after quoting",
      stage_day: 7,
      body: "Hi {{customer_name}},\n\nChecking in on the quote from last week for {{service}}. Let me know if you need me to adjust anything to make this work for your budget.\n\nBest,\n{{sender_name}}\n{{business_name}}"
    },
    {
      user_id: userId,
      name: "Day 14 — The Resource",
      timing_label: "Send 2 weeks after quoting",
      stage_day: 14,
      body: "Hi {{customer_name}},\n\nI know things get busy. While you're reviewing the quote for {{service}}, here is a quick overview of our process and what you can expect when we start.\n\nTalk soon,\n{{sender_name}}\n{{business_name}}"
    },
    {
      user_id: userId,
      name: "Day 30 — The Breakup",
      timing_label: "Send 1 month after quoting",
      stage_day: 30,
      body: "Hi {{customer_name}},\n\nI haven't heard back regarding the {{service}} quote, so I'm assuming this isn't a priority right now. I'll close this out on my end. Feel free to reach out if things change!\n\nCheers,\n{{sender_name}}\n{{business_name}}"
    }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/templates");
  return { success: true };
}

export async function sendQuoteEmail(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  // Verify subscription status (rudimentary check for MVP)
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", userId)
    .single();
    
  if (!profile?.stripe_subscription_id && process.env.NODE_ENV === "production") {
    return { error: "You must upgrade to a Pro plan to send emails automatically." };
  }

  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const quoteId = String(formData.get("quoteId") || "").trim();

  if (!email || !subject || !body) {
    return { error: "Missing email, subject, or body" };
  }

  try {
    const { getResend, getFromEmail } = await import("@/lib/email");
    const resend = getResend();
    const fromEmail = getFromEmail();
    
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: subject,
      text: body,
    });
    
    // Update the last_touch_at on the quote
    if (quoteId) {
      await supabase
        .from("quotes")
        .update({ last_touch_at: new Date().toISOString() })
        .eq("id", quoteId)
        .eq("user_id", userId);
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { error: err instanceof Error ? err.message : "Failed to send email" };
  }
}

export async function submitFeedback(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const message = String(formData.get("message") || "").trim();
  const sentiment = String(formData.get("sentiment") || "").trim();

  if (!message) {
    return { error: "Message cannot be empty." };
  }

  try {
    // 1. Insert into database (fail silently if schema not applied)
    const { error: dbError } = await supabase.from("feedbacks").insert({
      user_id: userId,
      message,
      sentiment,
    });
    if (dbError) {
      console.warn("Feedback DB insert failed (schema might not be applied):", dbError.message);
    }

    // 2. Send email notification
    const { getResend, getFromEmail } = await import("@/lib/email");
    const resend = getResend();
    const fromEmail = getFromEmail();
    const { data: { user } } = await supabase.auth.getUser();

    await resend.emails.send({
      from: fromEmail,
      to: "surjeet@quotechaser.com", // Send to admin
      subject: `New Feedback from ${user?.email || userId} (${sentiment || "neutral"})`,
      text: `User ID: ${userId}\nEmail: ${user?.email || "Unknown"}\nSentiment: ${sentiment}\n\nMessage:\n${message}`,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { error: error instanceof Error ? error.message : "Failed to submit feedback." };
  }
}

export async function importQuotes(quotes: Record<string, string | number>[]) {
  const { supabase, userId } = await currentUserId();

  if (!quotes || !quotes.length) {
    return { error: "No quotes provided to import." };
  }

  const insertData = quotes.map((q) => {
    const amount = Math.round(Number(q.amount || 0) * 100);
    
    // Default to today if date is missing/invalid
    let sentDate = q.quoteSentOn ? String(q.quoteSentOn) : "";
    if (!sentDate || isNaN(Date.parse(sentDate))) {
      sentDate = new Date().toISOString().slice(0, 10);
    }
    
    return {
      contact_name: String(q.contactName || "").trim(),
      customer_name: String(q.customerName || "").trim() || "Unknown Customer",
      email: String(q.email || "").trim() || null,
      last_touch_at: null,
      notes: String(q.notes || "").trim() || null,
      phone: String(q.phone || "").trim() || null,
      quote_amount_cents: amount,
      quote_sent_on: sentDate,
      service: String(q.service || "").trim() || "Consulting",
      status: "open",
      user_id: userId,
    };
  });

  const { error } = await supabase.from("quotes").insert(insertData);

  if (error) {
    return { error: error.message };
  }

  // Record a single app event for bulk import
  await supabase.from("app_events").insert({
    event_name: "quotes_imported",
    properties: { count: quotes.length },
    user_id: userId,
  });

  revalidatePath("/");
  return { success: true };
}
