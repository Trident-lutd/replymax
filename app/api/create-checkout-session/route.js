import { NextResponse } from "next/server";
import { getStripeClient } from "../../../lib/stripe";

export async function POST() {
  try {
    const stripe = getStripeClient();
    const price = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!stripe) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY." }, { status: 500 });
    }
    if (!price) {
      return NextResponse.json({ error: "Missing STRIPE_PRICE_ID." }, { status: 500 });
    }
    if (!appUrl) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_APP_URL." }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      allow_promotion_codes: true
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
  }
}
