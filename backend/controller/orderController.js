const orders = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");

exports.getMyOrders = catchAsync(async (req, res) => {
    const userId = req.user._id.toString()
    const myOrders = await orders.find({userId});
    res.status(200).json({
        status: 'success',
        data: {orders: myOrders}
    });
    
})

exports.getAllOrders = catchAsync(async (req, res) => {
  try {
      // Expecting date in the format YYYY-MM-DD
      const { date } = req.query;
      let allOrders;

      if (date) {
          const startDate = new Date(date);
          const endDate = new Date(date);
          endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the day

          allOrders = await orders.find({
              createdAt: {
                  $gte: startDate,
                  $lt: endDate
              }
          });
      } else {
          allOrders = await orders.find();
      }

      res.status(200).json({
          status: 'success',
          data: { orders: allOrders }
      });

  } catch (err) {
      console.log(err);
      res.status(500).json({
          status: 'error',
          message: err.message
      });
  }
});

exports.getOrder = catchAsync(async(req, res) => {
    try {
        const { id } = req.params;

            const Order = await orders.findById(id);
              res.status(200).json({
                status: 'success',
                data: {order: Order}
            })
            if(!Order) {
                res.status(500).json({
                    status: 'error',
                    message: 'No product Found'
                  });
            }

    }catch (err) {
        console.log(err)
        res.status(500).json({
          status: 'error',
          message: err.message
        });
      }

})



