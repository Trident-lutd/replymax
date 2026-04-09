import Stripe from "stripe";

let stripe;

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}
