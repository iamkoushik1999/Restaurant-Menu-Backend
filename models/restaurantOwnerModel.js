import mongoose from 'mongoose';
import {
  comparePassword,
  generateResetToken,
  hashPassword,
} from '../helper/passwordHelper.js';

const restaurantOwnerSchema = mongoose.Schema(
  {
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash Password
restaurantOwnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Match Password
restaurantOwnerSchema.method(
  'comparePassword',
  async function (enteredPassword) {
    return await comparePassword(enteredPassword, this.password);
  }
);

// Reset Password Token
restaurantOwnerSchema.methods.getResetToken = function () {
  const { resetToken, hashedToken, expireTime } = generateResetToken();
  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpire = expireTime;
  return resetToken;
};

const restaurantOwnerModel = mongoose.model(
  'RestaurantOwner',
  restaurantOwnerSchema
);
export default restaurantOwnerModel;
