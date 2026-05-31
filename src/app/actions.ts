"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import * as schemas from "@/lib/schemas";

const appUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

async function currentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return { supabase, userId: user.id };
}

export async function signInWithEmail(_prevState: unknown, formData: FormData) {
  const parseResult = schemas.signInSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0].message };
  }

  const { email } = parseResult.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: "" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createQuote(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  const parseResult = schemas.createQuoteSchema.safeParse({
    customerName: formData.get("customerName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    amount: formData.get("amount"),
    quoteSentOn: formData.get("quoteSentOn"),
    notes: formData.get("notes"),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0].message };
  }

  const data = parseResult.data;

  // Default next follow up is +2 days
  const nextFollowUpAt = new Date(`${data.quoteSentOn}T00:00:00`);
  nextFollowUpAt.setDate(nextFollowUpAt.getDate() + 2);

  const { error } = await supabase.from("quotes").insert({
    contact_name: data.contactName,
    customer_name: data.customerName,
    email: data.email || null,
    last_touch_at: null,
    notes: data.notes || null,
    phone: data.phone || null,
    quote_amount_cents: data.amount * 100,
    quote_sent_on: data.quoteSentOn,
    service: data.service,
    status: "open",
    user_id: userId,
    next_follow_up_at: nextFollowUpAt.toISOString(),
    follow_up_stage: 2,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateQuote(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  const parseResult = schemas.updateQuoteSchema.safeParse({
    id: formData.get("id"),
    customerName: formData.get("customerName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    amount: formData.get("amount"),
    quoteSentOn: formData.get("quoteSentOn"),
    notes: formData.get("notes"),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0].message };
  }

  const data = parseResult.data;

  const { error } = await supabase
    .from("quotes")
    .update({
      contact_name: data.contactName,
      customer_name: data.customerName,
      email: data.email || null,
      notes: data.notes || null,
      phone: data.phone || null,
      quote_amount_cents: data.amount * 100,
      service: data.service,
    })
    .eq("id", data.id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateQuoteStatus(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  const parseResult = schemas.updateQuoteStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0].message };
  }

  const { id, status } = parseResult.data;

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

  revalidatePath("/");
  return { success: true };
}

export async function logFollowUp(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  const parseResult = schemas.logFollowUpSchema.safeParse({
    id: formData.get("id"),
    channel: formData.get("channel") || "manual",
    currentStage: formData.get("currentStage") || 2,
    quoteSentOn: formData.get("quoteSentOn"),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0].message };
  }

  const { id, channel, currentStage, quoteSentOn } = parseResult.data;

  // Calculate next stage
  let nextStageDay: number | null = null;
  if (currentStage === 2) nextStageDay = 7;
  else if (currentStage === 7) nextStageDay = 14;
  else if (currentStage === 14) nextStageDay = 30;

  let nextFollowUpAt: Date | null = null;
  if (nextStageDay) {
    nextFollowUpAt = new Date(`${quoteSentOn}T00:00:00`);
    nextFollowUpAt.setDate(nextFollowUpAt.getDate() + nextStageDay);
  }

  const { error } = await supabase
    .from("quotes")
    .update({
      last_touch_at: new Date().toISOString(),
      follow_up_stage: nextStageDay || 30, // stay at 30 if maxed
      next_follow_up_at: nextFollowUpAt ? nextFollowUpAt.toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  // Log in history
  await supabase.from("follow_up_history").insert({
    quote_id: id,
    user_id: userId,
    channel,
    notes: `Sent Day ${currentStage} follow-up`,
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteQuote(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const parseResult = schemas.deleteQuoteSchema.safeParse({ id: formData.get("id") });

  if (!parseResult.success) return { error: parseResult.error.issues[0].message };
  const { id } = parseResult.data;

  const { error } = await supabase.from("quotes").delete().eq("id", id).eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
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
      throw new Error(`Admin create failed: ${createError.message}`);
    }
  }

  // Sign in standard user client
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: DEV_EMAIL,
    password: DEV_PASSWORD,
  });

  if (signInError) {
    throw new Error(`Sign-in failed: ${signInError.message}`);
  }

  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  const parseResult = schemas.updateProfileSchema.safeParse({
    senderName: formData.get("senderName"),
    businessName: formData.get("businessName"),
    phone: formData.get("phone"),
    signature: formData.get("signature"),
  });

  if (!parseResult.success) return { error: parseResult.error.issues[0].message };
  const data = parseResult.data;
  
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      sender_name: data.senderName,
      business_name: data.businessName,
      phone: data.phone,
      signature: data.signature,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateTemplate(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const parseResult = schemas.updateTemplateSchema.safeParse({
    id: formData.get("id"),
    body: formData.get("body"),
  });

  if (!parseResult.success) return { error: parseResult.error.issues[0].message };
  const { id, body } = parseResult.data;
  
  const { error } = await supabase
    .from("templates")
    .update({ body })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function createCheckoutSession(priceId: string) {
  const { supabase, userId } = await currentUserId();
  const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", userId).single();

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const customer = await stripe.customers.create({
      email: user?.email,
      metadata: { userId },
    });
    customerId = customer.id;

    await supabase.from("profiles").upsert({ id: userId, stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl()}/settings?success=true`,
    cancel_url: `${appUrl()}/settings?canceled=true`,
  });

  if (!session.url) {
    return { error: "Could not create checkout session" };
  }

  redirect(session.url);
}

export async function createPortalSession() {
  const { supabase, userId } = await currentUserId();
  const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", userId).single();

  if (!profile?.stripe_customer_id) {
    return { error: "No billing profile found" };
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl()}/settings`,
  });

  if (!session.url) {
    return { error: "Could not create portal session" };
  }

  redirect(session.url);
}

export async function sendQuoteEmail(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  
  const parseResult = schemas.sendQuoteEmailSchema.safeParse({
    email: formData.get("email"),
    subject: formData.get("subject"),
    body: formData.get("body"),
    quoteId: formData.get("quoteId"),
  });

  if (!parseResult.success) return { error: parseResult.error.issues[0].message };
  const { email, subject, body, quoteId } = parseResult.data;

  // Verify subscription status (rudimentary check for MVP)
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", userId)
    .single();
    
  if (!profile?.stripe_subscription_id && process.env.NODE_ENV === "production") {
    return { error: "You must upgrade to a Pro plan to send emails automatically." };
  }

  try {
    const { getResend, getFromEmail } = await import("@/lib/email");
    const resend = getResend();
    if (!resend) return { error: "Email provider not configured." };

    const { error: resendError } = await resend.emails.send({
      from: getFromEmail(),
      to: [email],
      subject,
      text: body,
      replyTo: "no-reply@quotechaser.com", 
    });

    if (resendError) return { error: resendError.message };

    // Record that we sent an email
    await supabase.from("follow_up_history").insert({
      quote_id: quoteId,
      user_id: userId,
      channel: "email",
      notes: `Sent email with subject: "${subject}"`,
    });

    return { success: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { error: "Failed to send email. Check server logs." };
  }
}

export async function submitFeedback(formData: FormData) {
  const { supabase, userId } = await currentUserId();
  const parseResult = schemas.submitFeedbackSchema.safeParse({
    message: formData.get("message"),
    sentiment: formData.get("sentiment"),
  });

  if (!parseResult.success) return { error: parseResult.error.issues[0].message };
  const { message, sentiment } = parseResult.data;

  try {
    // 1. Insert into database (fail silently if schema not applied)
    await supabase.from("feedback").insert({
      user_id: userId,
      message,
      sentiment,
    });
  } catch (err) {
    console.warn("Could not save feedback to DB:", err);
  }

  // 2. Alert Slack if configured
  if (process.env.SLACK_WEBHOOK_URL) {
    const icon = sentiment === "positive" ? "🟢" : sentiment === "negative" ? "🔴" : "⚪";
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `${icon} *New Feedback*\n> ${message}\n_Sentiment: ${sentiment}, User ID: ${userId}_`,
        }),
      });
    } catch (err) {
      console.warn("Could not send feedback to Slack:", err);
    }
  }

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
