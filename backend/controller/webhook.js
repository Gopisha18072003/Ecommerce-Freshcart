const stripe = require("../config/stripe");
const orders = require("../models/orderModel");
const Email = require("../utils/email");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function getLineItems(lineItems) {
    let ProductItems = []
    if(lineItems?.data?.length) {
        for(const item of lineItems.data) {
            const product = await stripe.products.retrieve(item.price.product)
            const productId = product.metadata.productId
            const productData = {
                productId,
                name: product.name,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.images
            }

            ProductItems.push(productData)

        }
    }
    return ProductItems
}

const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const payloadString = JSON.stringify(req.body)
  let event;
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: endpointSecret,
  })

  try {
    event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const productDetails = await getLineItems(lineItems)

      const orderDetails = {
        productDetails: productDetails,
        email: session.customer_email,
        userId: session.metadata.userId,
        paymentDetails: {
            paymentId: session.payment_intent,
            payment_method_types: session.payment_method_types,
            payment_status: session.payment_status,
    
        },
        totalAmount: session.amount_total/100

      }
      const customer = {name: "User dummy", email: session.customer_email}
      const order = new orders(orderDetails)
      const saveOrder = await order.save()
      await new Email(customer).sendInvoice(saveOrder)
   
      await new Email({name: "Admin dummy", email: process.env.ADMIN_EMAIL}).sendAdminInvoice(saveOrder)
      
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send()
};

module.exports = webhook
