// Models
import categoryModel from '../models/categoryModel.js';

// ------------------------------------------------------------------------

// Generate Category Standing
export const generateCategoryStanding = async () => {
  // Get the last category to find the last sequence number
  const lastCategory = await categoryModel.findOne().sort({ createdAt: -1 });

  // Extract the last number and increment it, or start from 0
  const lastNumber = lastCategory ? parseInt(lastCategory?.standing) : 0;
  const nextNumber = lastNumber + 1;

  return nextNumber;
};
