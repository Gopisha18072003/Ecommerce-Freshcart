const APIFeatures = require("./../utils/apiFeatures");
const GroceryItems = require("./../models/groceryModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllGroceries = catchAsync(async (req, res, next) => {
        const features = new APIFeatures(GroceryItems.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const groceries = await features.query;
      res.status(200).json({
        status: "Success",
        length: groceries.length,
        data: { groceries },
      });
});



exports.getGrocery = catchAsync(async (req, res, next) => {
    const grocery = await GroceryItems.findById(req.params.id);
    if(grocery == null) {
      return next(new AppError('No item found for this id', 404));
    }
    res.status(200).json({
      status: "Success",
      data: { grocery },
    });
});
 
exports.addGrocery = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return new AppError('No file uploaded!', 400);
  }

  const { name, price, description, discount, isFeatured, parameter, quantity, category} = req.body;
  const pathArray =req.file.path.split('\\')
  const newPath = pathArray[2]
  const data = {
    name,
    price,
    description,
    discount,
    isFeatured: isFeatured === 'true',
    image: newPath,
    parameter,
    quantity,
    category
  }
  const grocery = await GroceryItems.create(data);

  res.status(201).json({
    status: 'Success',
    data: { grocery}
  })
});

exports.deleteGrocery = catchAsync(async (req, res, next) => {
  await GroceryItems.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'Success',
    data: null
  })
})

exports.updateGrocery = catchAsync(async (req, res, next) => {
  const {name, description, price, discount, category, isFeatured} = req.body
  const data = {name, description, price, discount, category, isFeatured};
  const grocery = await GroceryItems.findByIdAndUpdate(req.params.id, data);

  res.status(200).json({
    status: 'Success',
    data: {grocery}
  })
})

exports.getNoOfItemsInCategory = catchAsync(async (req, res, next) => {
  const  aggregationResult = await GroceryItems.aggregate([
    {
      $group: {
        _id: "$category", // Group by the 'category' field
        count: { $sum: 1 } // Sum 1 for each document in the group to get the count
      }
    },
  
  ]);
  const result = {};
  aggregationResult.forEach(item => {
    result[item._id] = item.count;
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
})
