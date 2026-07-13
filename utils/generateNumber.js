// Models
import categoryModel from '../models/categoryModel.js';

// ------------------------------------------------------------------------

// Generate the next standing (display order) for a category within a restaurant
export const generateCategoryStanding = async (restaurantId) => {
  const lastCategory = await categoryModel
    .findOne({ restaurant: restaurantId })
    .sort({ standing: -1 });

  const lastNumber = lastCategory ? lastCategory.standing : 0;
  return lastNumber + 1;
};
