import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: String,
      required: true,
      ref: 'Restaurant',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: ['Veg', 'NonVeg'],
    },
    halfAvailable: {
      type: Boolean,
      default: false,
    },
    halfPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const menuModel = mongoose.model('menus', menuSchema);
export default menuModel;
