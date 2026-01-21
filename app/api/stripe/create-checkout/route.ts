import { NextRequest, NextResponse } from 'next/server'
import { stripe, getPriceId } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, userId, userEmail, allowPromoCode = false } = body

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // Validate priceId or use plan type
    let finalPriceId = priceId
    if (!finalPriceId && body.plan) {
      finalPriceId = getPriceId(body.plan as 'monthly' | 'yearly')
    }

    if (!finalPriceId) {
      return NextResponse.json(
        { error: 'Price ID or plan type is required' },
        { status: 400 }
      )
    }

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/canceled`,
      client_reference_id: userId, // Store user ID to update DB after payment
      customer_email: userEmail,
      allow_promotion_codes: allowPromoCode, // Enable promo code field if requested
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      metadata: {
        userId: userId,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
