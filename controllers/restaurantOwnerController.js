// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantOwnerModel from '../models/restaurantOwnerModel.js';
// Helper
import { hashPassword } from '../helper/passwordHelper.js';

// --------------------------------------------------------------------------------

// @desc    Create a new Restaurant Owner
// @route   POST
// @access  Admin
export const addRestaurantOwner = expressAsyncHandler(async (req, res) => {
  const { fname, lname, email, password, phoneNumber } = req.body;
  if (!fname || !lname || !email || !password || !phoneNumber) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const fullName = fname + ' ' + lname;

  // User exists
  const userExists = await restaurantOwnerModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already exists');
  }

  const restaurantOwner = await restaurantOwnerModel.create({
    fname,
    lname,
    fullName,
    email,
    password: await hashPassword(password),
    phoneNumber,
  });

  res.status(200).json({
    message: 'Owner added successfully',
    success: true,
    data: restaurantOwner,
  });
});

// @desc    Get All Restaurant Owner
// @route   POST
// @access  Admin
export const getAllRestaurantOwners = expressAsyncHandler(async (req, res) => {
  const query = {
    ...(req.query.name && {
      fullName: { $regex: req.query.name, $options: 'i' },
    }),
    isDeleted: false,
  };

  const restaurantOwners = await restaurantOwnerModel
    .find(query)
    .select('fullName email phoneNumber');
  const restaurantOwnerCount = await restaurantOwnerModel.countDocuments(query);
  const restaurantOwnerTotal = await restaurantOwnerModel.countDocuments({
    isDeleted: false,
  });

  res.status(200).json({
    data: restaurantOwners,
    count: restaurantOwnerCount,
    total: restaurantOwnerTotal,
  });
});
