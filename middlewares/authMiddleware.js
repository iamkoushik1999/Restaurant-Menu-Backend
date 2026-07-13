// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantOwnerModel from '../models/restaurantOwnerModel.js';
// Helper
import { verifyToken } from '../helper/authHelper.js';

// --------------------------------------------------------------------------

// Verifies the bearer access token and attaches the logged-in owner to req.user
export const isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    res.status(401);
    throw new Error(
      error.name === 'TokenExpiredError' ? 'Session expired, please login again' : 'Not authorized'
    );
  }

  const user = await restaurantOwnerModel.findOne({
    _id: decoded.id,
    isDeleted: false,
  });

  if (!user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  req.user = user;
  next();
});
