/**
 * Stripe client initialization and configuration
 */

import Stripe from 'stripe'

// Validate environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Initialize Stripe client (server-side only)
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Price IDs from environment variables
export const STRIPE_PRICE_ID_MONTHLY = process.env.STRIPE_PRICE_ID_MONTHLY
export const STRIPE_PRICE_ID_YEARLY = process.env.STRIPE_PRICE_ID_YEARLY

if (!STRIPE_PRICE_ID_MONTHLY || !STRIPE_PRICE_ID_YEARLY) {
  throw new Error('STRIPE_PRICE_ID_MONTHLY and STRIPE_PRICE_ID_YEARLY must be set in environment variables')
}

// Helper function to get price ID by plan type
export function getPriceId(plan: 'monthly' | 'yearly'): string {
  const priceId = plan === 'monthly' ? STRIPE_PRICE_ID_MONTHLY : STRIPE_PRICE_ID_YEARLY
  if (!priceId) {
    throw new Error(`Missing Stripe price ID for ${plan} plan`)
  }
  return priceId
}
