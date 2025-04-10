// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';
import restaurantOwnerModel from '../models/restaurantOwnerModel.js';

// --------------------------------------------------------------------------------

// @desc    Get all restaurants
// @route   GET
// @access  Admin
export const getRestaurants = expressAsyncHandler(async (req, res) => {
  const query = {
    isDeleted: false,
  };
  const pipeline = [
    {
      $match: query,
    },
    {
      $addFields: {
        owner: {
          $toObjectId: '$owner',
        },
      },
    },
    {
      $lookup: {
        from: 'restaurantowners',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: {
        path: '$owner',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        owner: '$owner.fullName',
        name: 1,
        email: 1,
        phone: 1,
      },
    },
  ];

  const restaurants = await restaurantModel.aggregate(pipeline);
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
  const restaurant = await restaurantModel.findById(id).populate({
    path: 'owner',
    select: 'fullName',
  });
  res.status(200).json({ data: restaurant });
});

// @desc    Create a new restaurant
// @route   POST
// @access  Admin
export const createRestaurant = expressAsyncHandler(async (req, res) => {
  const {
    owner,
    name,
    address,
    city,
    state,
    country,
    zip,
    phone,
    email,
    website,
    lat,
    long,
  } = req.body;

  if (!owner) {
    res.status(400);
    throw new Error('Please select the owner');
  }
  if (
    !name ||
    !address ||
    !city ||
    !state ||
    !country ||
    !zip ||
    !phone ||
    !email ||
    !lat ||
    !long ||
    !website
  ) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  // Check if owner exists
  const restaurantOwner = await restaurantOwnerModel.findById(owner);
  if (!restaurantOwner) {
    res.status(400);
    throw new Error('Owner not found');
  }

  // Check if owner already has a restaurant
  const restaurantExists = await restaurantModel.findOne({ owner: owner });
  if (restaurantExists) {
    res.status(400);
    throw new Error(
      'Owner already has a restaurant, Try creating a new owner with another email'
    );
  }

  const restaurant = await restaurantModel.create({
    owner,
    name,
    address,
    city,
    state,
    country,
    zip,
    phone,
    email,
    website,
    location: {
      type: 'Point',
      coordinates: [long, lat],
    },
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
  const {
    owner,
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
  const restaurant = await restaurantModel.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  if (!owner) {
    res.status(400);
    throw new Error('Please select the owner');
  }

  const restaurantOwner = await restaurantOwnerModel.findById(owner);
  if (!restaurantOwner) {
    res.status(400);
    throw new Error('Owner not found');
  }

  restaurant.owner = owner || restaurant?.owner;
  restaurant.name = name || restaurant?.name;
  restaurant.address = address || restaurant?.address;
  restaurant.city = city || restaurant?.city;
  restaurant.state = state || restaurant?.state;
  restaurant.country = country || restaurant?.country;
  restaurant.zip = zip || restaurant?.zip;
  restaurant.phone = phone || restaurant?.phone;
  restaurant.email = email || restaurant?.email;
  restaurant.website = website || restaurant?.website;

  await restaurant.save();

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
    res.status(404);
    throw new Error('Restaurant not found');
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
    res.status(404);
    throw new Error('Restaurant not found');
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

// --------------------------------------------------------------------------------------

// @desc    Nearby Restaurants
// @route   GET
// @access  Public
export const nearbyRestaurants = expressAsyncHandler(async (req, res) => {
  const { lat, long } = req.query;
  if (!lat || !long) {
    res.status(400);
    throw new Error('Please enter latitude and longitude');
  }

  const restaurants = await restaurantModel.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(long), parseFloat(lat)],
        },
        $maxDistance: 10000,
      },
    },
  });

  const rest = restaurants.map((restaurant) => {
    return {
      id: restaurant._id,
      name: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      country: restaurant.country,
      zip: restaurant.zip,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
    };
  });

  const total = restaurants.length;

  res.status(200).json({
    data: rest,
    total,
  });
});

// @desc    My Restaurants
// @route   GET
// @access  Restaurant Owner
export const myRestaurant = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;

  const restaurant = await restaurantModel.findOne({ owner: id });
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurants not found');
  }

  res.status(200).json({ data: restaurant });
});
