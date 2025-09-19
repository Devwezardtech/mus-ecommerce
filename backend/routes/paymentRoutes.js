const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('../middleware/auth'); // if you use token middleware

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

// Optional log to check if secret key is loaded (remove in production)
console.log("PAYMONGO_SECRET_KEY is loaded:", !!PAYMONGO_SECRET_KEY);

const paymongoHeaders = {
  Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
  'Content-Type': 'application/json',
};

// POST /api/payments/create-gcash
router.post('/create-payment', auth, async (req, res) => {
  try {
    const { amount, name, paymentMethod } = req.body;

    
    //  Validate inputs
    if (!amount || !name || !paymentMethod) {
      return res.status(400).json({ message: 'Amount, name and paymentMethod are required' });
    }

      // Validate payment method supported by PayMongo
    const validPaymentMethods = ['gcash', 'grab_pay', 'paymaya', 'card'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

        const checkoutPayload = {
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: `Order for ${name}`,
            line_items: [
              {
                currency: 'PHP',
                amount: Math.round(amount * 100), 
                description: `${paymentMethod.toUpperCase()} Payment`,
                name: 'Order',
                quantity: 1,
              },
            ],
            payment_method_types: [paymentMethod.toLowerCase()],
            success_url: 'http://localhost:5173/user',
            cancel_url: 'http://localhost:5173/checkout',
          },
        },
      }
      
     const response = await axios.post(
      'https://api.paymongo.com/v1/checkout_sessions',
      checkoutPayload,
      { headers: paymongoHeaders }
    );

    const checkoutUrl = response.data.data.attributes.checkout_url;
    res.json({ url: checkoutUrl });
  } catch (error) {
    console.error('GCash Payment Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'GCash payment failed.' });
  }
});

module.exports = router;
