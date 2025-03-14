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
    role: {
      type: String,
      default: 'owner',
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

const restaurantOwnerModel = mongoose.model('Owner', restaurantOwnerSchema);
export default restaurantOwnerModel;
