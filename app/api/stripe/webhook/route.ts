import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { init } from '@instantdb/admin'

// Initialize InstantDB admin client (server-side only)
const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_SECRET!,
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  console.log(`[Webhook] Received event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('[Webhook] Session data:', {
          client_reference_id: session.client_reference_id,
          customer_email: session.customer_email,
          customer: session.customer,
          subscription: session.subscription,
          metadata: session.metadata,
        })

        let userId = session.client_reference_id || session.metadata?.userId

        // If no userId in session, try to find user by email
        if (!userId && session.customer_email) {
          console.log(`[Webhook] No userId in session, looking up by email: ${session.customer_email}`)
          
          try {
            const usersQuery = await db.query({
              $users: {
                $: {
                  where: {
                    email: session.customer_email
                  }
                }
              }
            })
            
            const user = usersQuery.$users?.[0]
            if (user) {
              userId = user.id
              console.log(`[Webhook] Found user by email: ${userId}`)
            }
          } catch (err) {
            console.error('[Webhook] Error looking up user by email:', err)
          }
        }

        if (!userId) {
          console.error('[Webhook] No user ID found in checkout session and could not find by email')
          break
        }

        console.log(`[Webhook] Checkout completed for user: ${userId}`)

        // Get subscription details
        const subscriptionId = session.subscription as string
        if (!subscriptionId) {
          console.error('[Webhook] No subscription ID in session')
          break
        }
        
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        
        // Determine plan type (monthly or yearly)
        const priceId = subscription.items.data[0]?.price.id
        let subscriptionPlan: 'monthly' | 'yearly' = 'monthly'
        
        if (priceId === process.env.STRIPE_PRICE_ID_YEARLY) {
          subscriptionPlan = 'yearly'
        }

        console.log(`[Webhook] Updating user ${userId} with billing_status: active, subscription_plan: ${subscriptionPlan}`)

        // Update user in InstantDB
        await db.transact([
          db.tx.$users[userId].update({
            billing_status: 'active',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            subscription_plan: subscriptionPlan,
          }),
        ])

        console.log(`[Webhook] Successfully updated user ${userId} to active with ${subscriptionPlan} plan`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('No user ID found in subscription metadata')
          break
        }

        console.log(`[Webhook] Subscription updated for user: ${userId}`)

        // Determine plan type
        const priceId = subscription.items.data[0]?.price.id
        let subscriptionPlan: 'monthly' | 'yearly' = 'monthly'
        
        if (priceId === process.env.STRIPE_PRICE_ID_YEARLY) {
          subscriptionPlan = 'yearly'
        }

        // Update billing status based on subscription status
        let billingStatus: 'active' | 'canceled' | 'expired' = 'active'
        
        if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
          billingStatus = 'canceled'
        } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
          billingStatus = 'expired'
        }

        await db.transact([
          db.tx.$users[userId].update({
            billing_status: billingStatus,
            subscription_plan: subscriptionPlan,
          }),
        ])

        console.log(`[Webhook] User ${userId} status updated to ${billingStatus}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('No user ID found in subscription metadata')
          break
        }

        console.log(`[Webhook] Subscription deleted for user: ${userId}`)

        await db.transact([
          db.tx.$users[userId].update({
            billing_status: 'canceled',
          }),
        ])

        console.log(`[Webhook] User ${userId} marked as canceled`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionRef = (invoice as any).subscription
        const subscriptionId = typeof subscriptionRef === 'string' 
          ? subscriptionRef 
          : subscriptionRef?.id

        if (!subscriptionId) break

        // Get subscription to find user ID
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error('No user ID found in subscription metadata')
          break
        }

        console.log(`[Webhook] Payment failed for user: ${userId}`)

        await db.transact([
          db.tx.$users[userId].update({
            billing_status: 'expired',
          }),
        ])

        console.log(`[Webhook] User ${userId} marked as expired due to payment failure`)
        break
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error(`[Webhook] Error processing event ${event.type}:`, error)
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    )
  }
}
