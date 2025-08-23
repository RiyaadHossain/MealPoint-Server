import Stripe from "stripe";
import config from "./index.js";

export const stripe = new Stripe(config.STRIPE_API_KEY as string, {
  apiVersion: "2025-07-30.basil",
});
