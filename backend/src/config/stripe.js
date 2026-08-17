const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeSecretKey);

module.exports = stripe;
