// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';

// --------------------------------------------------------------------------------

// @desc    Get all restaurants
// @route   GET
// @access  Admin
export const getRestaurants = expressAsyncHandler(async (req, res) => {
  const restaurants = await restaurantModel.find({}).select('name');
  const totalRestaurants = await restaurantModel.countDocuments({});

  res.status(200).json({
    data: restaurants,
    total: totalRestaurants,
  });
});

// @desc    Get single restaurant
// @route   GET
// @access  Admin
export const getRestaurant = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurant = await restaurantModel.findById(id);
  res.status(200).json({ data: restaurant });
});

// @desc    Create a new restaurant
// @route   POST
// @access  Admin
export const createRestaurant = expressAsyncHandler(async (req, res) => {
  const { name, address, city, state, country, zip, phone, email, website } =
    req.body;
  const restaurant = await restaurantModel.create({
    name,
    address,
    city,
    state,
    country,
    zip,
    phone,
    email,
    website,
  });
  res.status(200).json({
    message: 'Restaurant created successfully',
    success: true,
    data: restaurant,
  });
});

// @desc    Update a restaurant
// @route   PUT
// @access  Admin
export const updateRestaurant = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, country, zip, phone, email, website } =
    req.body;
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404).json({
      message: 'Restaurant not found',
      success: false,
    });
  }
  restaurant.name = name;
  restaurant.address = address;
  restaurant.city = city;
  restaurant.state = state;
  restaurant.country = country;
  restaurant.zip = zip;
  restaurant.phone = phone;
  restaurant.email = email;
  restaurant.website = website;

  const updatedRestaurant = await restaurant.save();

  res.status(200).json({
    message: 'Restaurant updated successfully',
    success: true,
  });
});

// @desc    Delete a restaurant
// @route   DELETE
// @access  Admin
export const deleteRestaurant = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404).json({
      message: 'Restaurant not found',
      success: false,
    });
  }
  // Soft Delete
  restaurant.isDeleted = true;
  await restaurant.save();
  res.status(200).json({
    message: 'Restaurant deleted successfully',
    success: true,
  });
});

// @desc    Restore a restaurant
// @route   PUT
// @access  Admin
export const restoreRestaurant = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404).json({
      message: 'Restaurant not found',
      success: false,
    });
  }
  // Soft Delete
  restaurant.isDeleted = false;
  await restaurant.save();
  res.status(200).json({
    message: 'Restaurant restored successfully',
    success: true,
  });
});

// @desc    Get all deleted restaurants
// @route   GET
// @access  Admin
export const getDeletedRestaurants = expressAsyncHandler(async (req, res) => {
  const restaurants = await restaurantModel.find({ isDeleted: true });
  res.status(200).json({ data: restaurants });
});
