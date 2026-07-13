import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    standing: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const categoryModel = mongoose.model('Category', categorySchema);

export default categoryModel;
