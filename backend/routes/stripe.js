const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');

// Create Stripe Checkout Session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { products } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((item) => ({
        price_data: {
          currency: 'php',
          product_data: {
            name: item.name || 'Product', // ✅ fallback if name is missing
          },
          unit_amount: Math.round(item.price * 100), // ✅ per item
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      success_url: 'http://localhost:5173/orders',
      cancel_url: 'http://localhost:5173/checkout',
    });

   res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ message: 'Stripe checkout failed' });
  }
});

// connect to stripe
// POST /api/stripe/connect
router.post("/connect", auth, async (req, res) => {
  try {
    const user = req.user;

    // ✅ Create Express account for PH with `transfers` only
    const account = await stripe.accounts.create({
      type: "express",
      country: "PH",
      email: user.email,
      capabilities: {
        transfers: { requested: true }, // ✅ only transfers
      },
      business_type: "individual",
      tos_acceptance: {
        service_agreement: "recipient", // ✅ required in PH for transfers
      },
    });

    // ✅ Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:5173/affiliate/withdraw",
      return_url: "http://localhost:5173/affiliate/withdraw",
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (err) {
    console.error("Stripe Connect Error:", err);
    res.status(500).json({ message: "Stripe Connect onboarding failed." });
  }
});



// POST /api/stripe/affiliate/payout
router.post("/affiliate/payout", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = req.user;

    if (!user.stripeAccountId) {
      return res.status(400).json({ message: "Stripe account not linked." });
    }

    // Amount in cents
    const payout = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: "php",
      destination: user.stripeAccountId,
    });

    res.json({ message: "Payout initiated!", payout });
  } catch (err) {
    console.error("Stripe Payout Error:", err);
    res.status(500).json({ message: "Payout failed." });
  }
});





module.exports = router;
