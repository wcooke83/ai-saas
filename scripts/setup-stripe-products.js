/**
 * Stripe Product Setup Script
 * Creates Pro plan products and prices in Stripe
 * 
 * Usage: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-products.js
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupProducts() {
  try {
    console.log('Setting up Stripe products and prices...\n');

    // Create Pro Monthly Product and Price
    console.log('Creating Pro Monthly...');
    const monthlyProduct = await stripe.products.create({
      name: 'Pro Plan - Monthly',
      description: 'Pro subscription with monthly billing',
      metadata: {
        plan_slug: 'pro',
        billing_interval: 'monthly',
      },
    });

    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 2900, // $29.00 in cents - adjust as needed
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_slug: 'pro',
        billing_interval: 'monthly',
      },
    });

    console.log('✓ Monthly Product:', monthlyProduct.id);
    console.log('✓ Monthly Price ID:', monthlyPrice.id);
    console.log('');

    // Create Pro Yearly Product and Price
    console.log('Creating Pro Yearly...');
    const yearlyProduct = await stripe.products.create({
      name: 'Pro Plan - Yearly',
      description: 'Pro subscription with yearly billing (2 months free)',
      metadata: {
        plan_slug: 'pro',
        billing_interval: 'yearly',
      },
    });

    const yearlyPrice = await stripe.prices.create({
      product: yearlyProduct.id,
      unit_amount: 29000, // $290.00 in cents - adjust as needed (2 months free)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan_slug: 'pro',
        billing_interval: 'yearly',
      },
    });

    console.log('✓ Yearly Product:', yearlyProduct.id);
    console.log('✓ Yearly Price ID:', yearlyPrice.id);
    console.log('');

    console.log('=== SETUP COMPLETE ===');
    console.log('\nAdd these to your /admin/plans Pro plan:');
    console.log('Monthly Price ID:', monthlyPrice.id);
    console.log('Yearly Price ID:', yearlyPrice.id);
    console.log('\nTo update prices, run:');
    console.log(`UPDATE subscription_plans SET stripe_price_id_monthly = '${monthlyPrice.id}', stripe_price_id_yearly = '${yearlyPrice.id}' WHERE slug = 'pro';`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY environment variable required');
  console.error('Usage: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-products.js');
  process.exit(1);
}

setupProducts();
