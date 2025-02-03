import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
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
    standing: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const categoryModel = mongoose.model('Category', categorySchema);

export default categoryModel;
