// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantOwnerModel from '../models/restaurantOwnerModel.js';
// Helper
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../helper/authHelper.js';

// --------------------------------------------------------------------------

// POST
// Login
export const login = expressAsyncHandler(async (req, res) => {
  const { role } = req.query;
  if (!role) {
    res.status(400);
    throw new Error('Select who will login');
  }
  if (role !== 'owner') {
    res.status(400);
    throw new Error('Select between owner');
  }
  if (role === 'owner') {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Required fields are missing(email, password)');
    }
    const restaurantOwnerData = await restaurantOwnerModel.findOne({ email });
    if (!restaurantOwnerData) {
      res.status(404);
      throw new Error('restaurantOwner not found');
    }

    const { password: pass, ...restaurantOwner } = restaurantOwnerData._doc;

    const checkPassword = await restaurantOwnerData.comparePassword(password);
    if (!checkPassword) {
      res.status(400);
      throw new Error('Invalid restaurantOwner credential');
    }

    const accessToken = generateAccessToken(restaurantOwner, 'owner');
    const refreshToken = generateRefreshToken(restaurantOwner, 'owner');

    if (restaurantOwner) {
      res.status(200).json({
        message: restaurantOwner.isVerified
          ? 'Logged in successfully'
          : 'Change Password',
        success: true,
        data: restaurantOwner?.isVerified
          ? {
              fullName: restaurantOwner?.fullName,
              role: restaurantOwner?.role,
              isVerified: restaurantOwner?.isVerified,
            }
          : {
              isVerified: restaurantOwner?.isVerified,
            },
        accessToken: restaurantOwner?.isVerified ? accessToken : undefined,
        refreshToken: restaurantOwner?.isVerified ? refreshToken : undefined,
      });
    } else {
      res.status(400);
      throw new Error('invalid user');
    }
  }
});

// PUT
// Change First Time Password
export const changeFirstPassword = expressAsyncHandler(async (req, res) => {
  const { role } = req.query;
  if (!role) {
    res.status(400);
    throw new Error('Select who will login');
  }
  if (role !== 'owner') {
    res.status(400);
    throw new Error('Select between owner');
  }
  if (role === 'owner') {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('Please enter the email');
    }
    if (!newPassword || !confirmPassword) {
      res.status(400);
      throw new Error('Please enter all the field');
    }

    // Check confirm password
    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error('New password doesnot match old password');
    }

    const restaurantOwner = await restaurantOwnerModel
      .findOne({ email: email })
      .select('password isVerified');

    restaurantOwner.password = newPassword;
    restaurantOwner.isVerified = true;
    await restaurantOwner.save();

    res.status(200).json({
      message: 'Password changed successfully',
      success: true,
    });
  }
});

// GET
// My Profile
export const myProfile = expressAsyncHandler(async (req, res) => {
  // console.log(req.user);
  const { id, role } = req.user;
  // Super Admin
  switch (role) {
    case 'owner': {
      const restaurantOwner = await restaurantOwnerModel.findOne({ _id: id });
      if (!restaurantOwner) {
        res.status(404);
        throw new Error('Restaurant Owner not found');
      }
      res.status(200).json({
        success: true,
        data: restaurantOwner,
      });
      break;
    }

    default: {
      res.status(404);
      throw new Error('User not found');
    }
  }
});

// POST
// GENERATE ACCESS TOKEN from REFRESH TOKEN
export const generateAccessFromRefresh = expressAsyncHandler(
  async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Refresh token is required.');
    }

    try {
      // Verify the refresh token
      const decoded = verifyToken(refreshToken);

      let accessToken;

      // Generate access token based on role
      switch (decoded.role) {
        case 'owner': {
          const restaurantOwner = await restaurantOwnerModel.findOne({
            _id: decoded.id,
          });
          if (!restaurantOwner) {
            res.status(403);
            throw new Error('Invalid refresh token.');
          }
          accessToken = generateAccessToken(restaurantOwner, 'owner');
          break;
        }

        default:
          res.status(403);
          throw new Error('Invalid role.');
      }

      // Send the new access token
      res.status(200).json({
        message: 'Access token generated',
        success: true,
        accessToken: accessToken,
      });
    } catch (error) {
      // Handle expired refresh token
      if (error.name === 'TokenExpiredError') {
        res.status(403);
        throw new Error('Please login again');
      } else {
        res.status(403);
        throw new Error('Please login again');
      }
    }
  }
);
