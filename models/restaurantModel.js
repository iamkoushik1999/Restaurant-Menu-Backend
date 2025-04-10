import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      ref: 'RestaurantOwner',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    rating: {
      type: Number,
    },
    website: {
      type: String,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
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

restaurantSchema.index({ location: '2dsphere' });

const restaurantModel = mongoose.model('restaurants', restaurantSchema);
export default restaurantModel;
