const stripe = require("../config/stripe.js");

exports.createSession = async (req, res) => {
    const products = req.body.items;
    const user = req.user;
    console.log(user, user._id.toString())
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        customer_email: user.email,
        metadata: {
          userId: user._id.toString()
        },
        line_items: products.map((product) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.product.name,
              images: [`${req.protocol}://${req.get('host')}/uploads/items/${product.product.image}`],
              metadata: {
                productId: product.product._id
              }
            },
            unit_amount: Math.round(product.product.finalPrice * 100), // Convert to cents and round
          },
          quantity: product.quantity,
        })),
        mode: 'payment',
        success_url: 'https://ecommerce-freshcart-hzag.onrender.com/success',
        cancel_url: 'https://ecommerce-freshcart-hzag.onrender.com/cancel',

      });
    res.json({id: session.id})      

}
