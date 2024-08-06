const express = require('express');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const groceryRouter = require('./routes/groceryRoutes');
const UserRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controller/errorController');
const cors = require('cors');
const app = express();
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const path = require('path');
const authController = require('./controller/authController');
const bookingController = require('./controller/bookingController');
const webhook = require('./controller/webhook');



app.use(helmet());
app.use(xss());
app.use(mongoSanitize());


app.use(cors({ 
    origin: 'https://ecommerce-freshcart-hzag.onrender.com/',
    credentials: true,
    sameSite: 'Strict',
}));
app.use(cookieParser());
app.use(hpp({
    whitelist: [
        'price',
        'quantity',
        'ratingsQuantity',
        'ratingsAverage'
    ]
}));

// const endpointSecret = "whsec_ae6c5c1d6b1f30bdd6aa8702385cc1480d666df3ec4e816b9f16c55d0e6a7a61";

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

app.use(express.json({
    limit: '10kb'
}));

const limitter = rateLimiter({
    max: 100,
    window: 60*60*1000,
    message: 'Too many requests this IP, please try again later!'
});
app.use('/uploads/images', express.static(path.join('uploads', 'images')))
app.use('/uploads/items', express.static(path.join('uploads', 'items')))

app.use('/api', limitter);
app.use('/api/v1/freshcart/', groceryRouter);
app.use('/api/v1/freshcart/user', UserRouter);

// payment & order
app.post('/api/v1/freshcart/create-checkout-session', authController.protect, bookingController.createSession)
app.post('/api/v1/freshcart/webhook', webhook) // api/webhook



app.all('*', (req, res, next) => {
    next(new AppError(`Could not find the ${req.originalUrl} route`, 404));
})
app.use(globalErrorHandler); 
module.exports = app;