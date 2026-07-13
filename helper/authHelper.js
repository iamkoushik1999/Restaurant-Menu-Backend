// Packages
import jwt from 'jsonwebtoken';
// ENV
const { JWT_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES } = process.env;

// --------------------------------------------------------------------------

// Generate Access Token
export const generateAccessToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES || '15d',
    }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES || '365d',
    }
  );
};

// Verify Token
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
