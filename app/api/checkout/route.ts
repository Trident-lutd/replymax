import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!secretKey || !priceId) {
    return NextResponse.json({ error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID.' }, { status: 501 });
  }

  const stripe = new Stripe(secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}?checkout=success`,
    cancel_url: `${appUrl}?checkout=cancelled`,
    billing_address_collection: 'auto',
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
