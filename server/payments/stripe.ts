
import Stripe from 'stripe';

/**
 * STRIPE SERVER-SIDE INTEGRATION
 * This module handles all interactions with the Stripe API.
 * Requirements: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in environment variables.
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia', // Utilizing the latest stable API version
});

const DOMAIN = process.env.APP_URL || 'https://lucisin.com';

export const stripeService = {
  /**
   * Creates a secure Stripe Checkout session for various transaction types.
   */
  async createCheckoutSession(params: {
    userId: string;
    type: 'deposit' | 'subscription' | 'unlock';
    amount?: number; // In cents for Stripe
    planId?: string;
    postId?: string;
    currency?: string;
  }) {
    const { userId, type, amount, planId, postId, currency = 'usd' } = params;

    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let mode: Stripe.Checkout.SessionCreateParams.Mode = 'payment';
    let metadata: any = { userId, type };

    if (type === 'subscription') {
      mode = 'subscription';
      metadata.planId = planId;
      line_items = [{
        price: planId, // Assuming planId is a Stripe Price ID
        quantity: 1,
      }];
    } else if (type === 'deposit') {
      metadata.amount = amount;
      line_items = [{
        price_data: {
          currency,
          product_data: {
            name: 'LucisinCoin (LSC) Deposit',
            description: `Adding ${amount ? amount / 100 : 0} LSC to your vault.`,
          },
          unit_amount: amount || 0,
        },
        quantity: 1,
      }];
    } else if (type === 'unlock') {
      metadata.postId = postId;
      line_items = [{
        price_data: {
          currency,
          product_data: {
            name: 'Exclusive Content Access',
            description: `One-time unlock for node signal ${postId}.`,
          },
          unit_amount: amount || 0,
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode,
      metadata,
      success_url: `${DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${DOMAIN}/payment/cancel`,
      customer_email: undefined, // Optionally pass user email if available
    });

    return { sessionId: session.id, url: session.url };
  },

  /**
   * Processes incoming Stripe webhooks to update user state after successful payments.
   */
  async handleWebhook(payload: string, sig: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, type, planId, postId, amount } = session.metadata || {};

      console.log(`[Stripe Webhook] Received successful ${type} for user ${userId}`);

      // Protocol implementation:
      switch (type) {
        case 'subscription':
          // await db.users.update(userId, { isPremium: true, subscriptionId: session.subscription });
          break;
        case 'deposit':
          // await db.wallet.addBalance(userId, Number(amount) / 100);
          break;
        case 'unlock':
          // await db.posts.grantAccess(userId, postId);
          break;
      }
    }

    return { received: true };
  }
};
