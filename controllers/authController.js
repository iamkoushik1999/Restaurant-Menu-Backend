// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantOwnerModel from '../models/restaurantOwnerModel.js';
import restaurantModel from '../models/restaurantModel.js';
// Helper
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../helper/authHelper.js';
import { hashPassword } from '../helper/passwordHelper.js';
// Utils
import { generateUniqueSlug } from '../utils/generateSlug.js';

// --------------------------------------------------------------------------

const sanitizeOwner = (owner) => ({
  _id: owner._id,
  fullName: owner.fullName,
  email: owner.email,
  phoneNumber: owner.phoneNumber,
  role: owner.role,
});

// @desc    Sign up a new restaurant owner + their restaurant
// @route   POST /api/v1/auth/register
// @access  Public
export const register = expressAsyncHandler(async (req, res) => {
  const {
    fname,
    lname,
    email,
    password,
    confirmPassword,
    phoneNumber,
    restaurantName,
    address,
    city,
    state,
    country,
    zip,
    restaurantPhone,
    restaurantEmail,
    website,
  } = req.body;

  if (
    !fname ||
    !lname ||
    !email ||
    !password ||
    !phoneNumber ||
    !restaurantName ||
    !address ||
    !city ||
    !state ||
    !country ||
    !zip ||
    !restaurantPhone
  ) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const ownerExists = await restaurantOwnerModel.findOne({
    email: normalizedEmail,
  });
  if (ownerExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const owner = await restaurantOwnerModel.create({
    fname,
    lname,
    fullName: `${fname} ${lname}`,
    email: normalizedEmail,
    password: await hashPassword(password),
    phoneNumber,
  });

  let restaurant;
  try {
    const slug = await generateUniqueSlug(restaurantName);
    restaurant = await restaurantModel.create({
      owner: owner._id,
      name: restaurantName,
      slug,
      address,
      city,
      state,
      country,
      zip,
      phone: restaurantPhone,
      email: restaurantEmail,
      website,
    });
  } catch (error) {
    // Roll back the owner account if restaurant creation fails
    await restaurantOwnerModel.findByIdAndDelete(owner._id);
    throw error;
  }

  const accessToken = generateAccessToken(owner, 'owner');
  const refreshToken = generateRefreshToken(owner, 'owner');

  res.status(201).json({
    message: 'Account created successfully',
    success: true,
    data: {
      owner: sanitizeOwner(owner),
      restaurant,
    },
    accessToken,
    refreshToken,
  });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const owner = await restaurantOwnerModel
    .findOne({ email: email.toLowerCase().trim() })
    .select('+password');

  if (!owner) {
    res.status(404);
    throw new Error('No account found with this email');
  }

  const checkPassword = await owner.comparePassword(password);
  if (!checkPassword) {
    res.status(400);
    throw new Error('Invalid email or password');
  }

  if (!owner.status || owner.isDeleted) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  const accessToken = generateAccessToken(owner, 'owner');
  const refreshToken = generateRefreshToken(owner, 'owner');

  res.status(200).json({
    message: 'Logged in successfully',
    success: true,
    data: sanitizeOwner(owner),
    accessToken,
    refreshToken,
  });
});

// @desc    Change password (logged-in owner)
// @route   PUT /api/v1/auth/password
// @access  Private
export const changePassword = expressAsyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('New passwords do not match');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const owner = await restaurantOwnerModel
    .findById(req.user._id)
    .select('+password');

  const isMatch = await owner.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  owner.password = await hashPassword(newPassword);
  await owner.save();

  res.status(200).json({
    message: 'Password changed successfully',
    success: true,
  });
});

// @desc    My Profile
// @route   GET /api/v1/auth/profile
// @access  Private
export const myProfile = expressAsyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeOwner(req.user),
  });
});

// @desc    Generate a new access token from a refresh token
// @route   POST /api/v1/auth/accesstoken
// @access  Public
export const generateAccessFromRefresh = expressAsyncHandler(
  async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Refresh token is required.');
    }

    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (error) {
      res.status(403);
      throw new Error('Please login again');
    }

    const owner = await restaurantOwnerModel.findOne({ _id: decoded.id });
    if (!owner) {
      res.status(403);
      throw new Error('Please login again');
    }

    const accessToken = generateAccessToken(owner, 'owner');

    res.status(200).json({
      message: 'Access token generated',
      success: true,
      accessToken,
    });
  }
);
