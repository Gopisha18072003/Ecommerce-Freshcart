const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const {promisify} = require('util'); 
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const groceryItems = require("../models/groceryModel");
const Email = require("../utils/email");
dotenv.config({path:'./config.env' });

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

const signToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn});
};

const createSendToken = (user, statusCode, res) => {
  
  const accessToken = signToken(user._id, process.env.JWT_ACCESS_EXPIRES_IN); 
  const refreshToken = signToken(user._id, process.env.JWT_REFRESH_EXPIRES_IN); 

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: 'None',
    secure: true, // Ensure secure cookies in production
  };

  // remove the password field from the output only
  user.password = undefined;
  res
  .cookie("jwt", refreshToken, cookieOptions)
  .status(statusCode)
  .json({
    status: 'success',
    data: {
      user,
      accessToken
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const customer = {name: req.body.name, email: req.body.email}

  await new Email(customer).sendWelcome()

  // // id is payload
  createSendToken(newUser, 201, res);
});

exports.logOut = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() - 1000
    ),
    httpOnly: true
  }

  res.cookie('jwt', 'logout', cookieOptions);
  res.status(200).json({status: 'success'});
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide an email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return res.status(401).json({ status: 'fail', message: 'No refresh token' });

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ status: 'fail', message: 'Invalid refresh token' });

    const newAccessToken = signToken(decoded.id, process.env.JWT_ACCESS_EXPIRES_IN);
    res.status(200).json({ status: 'success', accessToken: newAccessToken });
  });
})

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.Authorization &&
    req.headers.Authorization.startsWith('Bearer')
  ) {
    token = req.headers.Authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Upload user profile image
exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded!', 400));
  }

  const userId = req.user.id; 
  const imagePath = req.file.location; // Use `req.file.location` to get the S3 file URL

  const user = await User.findByIdAndUpdate(
    userId,
    { image: imagePath }, // Store the S3 URL in the database
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('User not found!', 404));
  }

  res.status(200).json({ 
    status: 'success', 
    data: {
      image: imagePath  // Return the S3 URL in the response
    }
  });
});

// Upload product image
exports.uploadProductImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded!', 400));
  }

  const productId = req.params.id; 
  const imagePath = req.file.location; // Use `req.file.location` to get the S3 file URL

  const product = await groceryItems.findByIdAndUpdate(
    productId,
    { image: imagePath }, // Store the S3 URL in the database
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new AppError('Product not found!', 404));
  }

  res.status(200).json({ 
    status: 'success', 
    data: {
      image: imagePath // Return the S3 URL in the response
    }
  });
});




exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403),
        );
      }
      next();
    };
  };


exports.forgotPassword  = catchAsync (async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) return res.status(500).json({
      status:"fail",
      message: "No user found with this email"
    })

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    const resetURL = `https://ecommerce-freshcart-hzag.onrender.com/resetPassword/${resetToken}`;

    try {
        await new Email({name: 'User Dummy', email: user.email}, resetURL).sendPasswordReset()
    } catch(err) {`2  `
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        console.log(err);
        return next(new AppError('There was an error sending the email. Please try again later.', 500));
    }   

    res.status(200).json({
        status: 'success',
        message: 'Email sent!'
    });
});

exports.resetPassword = catchAsync( async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

    if(!user) return next(new AppError('Token is invalid or has expired.', 400));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!await user.isPasswordCorrect(req.body.currentPassword, user.password)) return next(new AppError('Incorrect password.'));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendToken( user, 200, res);
})
  
