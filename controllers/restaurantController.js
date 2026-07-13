// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';
// Utils
import { uploadBufferToCloudinary, deleteCloudinaryImage } from '../utils/uploadImage.js';

// --------------------------------------------------------------------------------

// @desc    Get the logged-in owner's restaurant
// @route   GET /api/v1/restaurant/mine
// @access  Private
export const myRestaurant = expressAsyncHandler(async (req, res) => {
  const restaurant = await restaurantModel.findOne({ owner: req.user._id });
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.status(200).json({ success: true, data: restaurant });
});

// @desc    Update the logged-in owner's restaurant (optionally with a new logo)
// @route   PUT /api/v1/restaurant/mine
// @access  Private
export const updateMyRestaurant = expressAsyncHandler(async (req, res) => {
  const restaurant = await restaurantModel.findOne({ owner: req.user._id });
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const {
    name,
    address,
    city,
    state,
    country,
    zip,
    phone,
    email,
    website,
  } = req.body;

  restaurant.name = name || restaurant.name;
  restaurant.address = address || restaurant.address;
  restaurant.city = city || restaurant.city;
  restaurant.state = state || restaurant.state;
  restaurant.country = country || restaurant.country;
  restaurant.zip = zip || restaurant.zip;
  restaurant.phone = phone || restaurant.phone;
  restaurant.email = email ?? restaurant.email;
  restaurant.website = website ?? restaurant.website;

  if (req.file) {
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      'restaurant-menu/logos'
    );
    await deleteCloudinaryImage(restaurant.logoPublicId);
    restaurant.logo = result.secure_url;
    restaurant.logoPublicId = result.public_id;
  }

  await restaurant.save();

  res.status(200).json({
    message: 'Restaurant updated successfully',
    success: true,
    data: restaurant,
  });
});
