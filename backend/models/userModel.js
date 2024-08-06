const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
    },
    image: {
        type: String,
        default: 'uploads\\images\\dummy.png'
    },
    email: {
        type: String,
        required: [true, 'User must have a email address'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
        lowerCase: true
    },
    phoneNumber: {
        type: Number,
        length: 10
    },
    address: {
        type: String,
        maxLength: 100,
    },
    pincode: {
        type: Number,
        length: 6
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm the password'],
        minLength: 8,
        validate: {
            validator: function(ps) {
                return ps === this.password
            }
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({isActive: {$ne: false}});
    next();
});

userSchema.methods.isPasswordCorrect = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.isPasswordChanged = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedPasswordAt = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return JWTTimestamp < changedPasswordAt;
    }
    return false;
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

userSchema.methods.createPasswordResetToken =  function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10*60*1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;