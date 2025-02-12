// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantOwnerModel from '../models/restaurantOwnerModel.js';
// Helper
import { verifyToken } from '../helper/authHelper.js';

// --------------------------------------------------------------------------

// User Auth
export const isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(' ')[1];

      //verify the token
      const decoded = verifyToken(token);

      if (decoded.role !== 'owner') {
        res.status(401);
        throw new Error('Not authorized, No Role');
      }

      if (decoded.role === 'owner') {
        //get user from token
        req.user = await restaurantOwnerModel.findOne({ _id: decoded.id });
        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized');
        }
        next();
      }
    } catch (error) {
      res.status(401);
      throw new Error(error.message);
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin or Not
export const authorizeOwner = (req, res, next) => {
  if (req.user.role !== 'owner') {
    res.status(403);
    throw new Error(`You are not allowed to access this resource`);
  }
  next();
};
