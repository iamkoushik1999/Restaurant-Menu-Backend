import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
      index: true,
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
      trim: true,
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
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
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const menuModel = mongoose.model('Menu', menuSchema);
export default menuModel;
