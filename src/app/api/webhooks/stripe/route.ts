import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing in environment variables.");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getWebhookSecret() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is missing in environment variables.");
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
}

function getAdminSupabase() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;
  let stripe: Stripe;
  let webhookSecret: string;
  let supabase: ReturnType<typeof getAdminSupabase>;

  try {
    stripe = getStripe();
    webhookSecret = getWebhookSecret();
    supabase = getAdminSupabase();
  } catch (err) {
    console.error("Env configuration error:", err);
    return new NextResponse("Internal Server Error: Missing configuration", { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook signature verification failed.`, error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "payment" && session.metadata?.quote_id) {
          // Quote deposit paid
          await supabase
            .from("quotes")
            .update({ status: "won" })
            .eq("id", session.metadata.quote_id);
        } else if (session.mode === "subscription" && session.client_reference_id) {
          // Ensure we have a client_reference_id (which should be the user's Supabase ID)
          const rawSub = await stripe.subscriptions.retrieve(session.subscription as string);
          const subscription = rawSub as unknown as Stripe.Subscription;
          
          await supabase
            .from("profiles")
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0].price.id,
              stripe_current_period_end: new Date(((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end) * 1000).toISOString(),
            })
            .eq("id", session.client_reference_id);
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find the user by stripe_customer_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();
          
        if (profile) {
          await supabase
            .from("profiles")
            .update({
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0].price.id,
              stripe_current_period_end: new Date(((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end) * 1000).toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: null,
            stripe_price_id: null,
            stripe_current_period_end: null,
          })
          .eq("stripe_customer_id", subscription.customer as string);
        break;
      }
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
