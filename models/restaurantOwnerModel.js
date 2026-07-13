import mongoose from 'mongoose';
import { comparePassword } from '../helper/passwordHelper.js';

const restaurantOwnerSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'owner',
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

restaurantOwnerSchema.method(
  'comparePassword',
  async function (enteredPassword) {
    return await comparePassword(enteredPassword, this.password);
  }
);

const restaurantOwnerModel = mongoose.model('Owner', restaurantOwnerSchema);
export default restaurantOwnerModel;
