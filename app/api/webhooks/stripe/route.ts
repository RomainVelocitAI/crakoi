import { NextRequest, NextResponse } from "next/server";

// Stripe webhook handler
// TODO: Replace with actual Stripe SDK once account is created
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // TODO: Verify Stripe webhook signature
  // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  // } catch (err) {
  //   console.error("Webhook signature verification failed:", err);
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  // }

  // For now, parse the body directly (dev mode)
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        // TODO: Update order status in Supabase
        // const supabase = createServiceRoleClient();
        // await supabase
        //   .from("orders")
        //   .update({ status: "paid", paid_at: new Date().toISOString(), stripe_session_id: session.id })
        //   .eq("id", orderId);
        console.log(`Order ${orderId} paid via Stripe session ${session.id}`);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      console.error(`Payment failed for intent ${intent.id}:`, intent.last_payment_error?.message);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
