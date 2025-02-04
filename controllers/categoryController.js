// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';
import categoryModel from '../models/categoryModel.js';

// --------------------------------------------------------------------------------

// @desc    Get all categories
// @route   GET
// @access  Public
export const getAllCategories = expressAsyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error('No restaurant found');
  }
  const categories = await categoryModel
    .find({ restaurant: restaurantId })
    .sort({ standing: 1 });

  res.status(200).json({
    data: categories,
  });
});

// @desc    Create a new category
// @route   POST
// @access  Admin
export const createCategory = expressAsyncHandler(async (req, res) => {
  const { restaurantId, name } = req.body;
  if (!restaurantId) {
    res.status(400);
    throw new Error('Please select the restaurant');
  }

  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error('No restautant found');
  }

  // Get the last category to find the last sequence number
  const lastCategory = await categoryModel.findOne().sort({ createdAt: -1 });

  // Extract the last number and increment it, or start from 0
  const lastNumber = lastCategory ? parseInt(lastCategory?.standing) : 0;
  const nextNumber = lastNumber + 1;

  const category = await categoryModel.create({
    restaurant: restaurantId,
    name,
    standing: nextNumber,
  });

  res.status(200).json({
    message: 'Category created successfully',
    success: true,
    data: category,
  });
});

// @desc    Update a category
// @route   PUT
// @access  Admin
export const updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { standing, restaurantId } = req.body;
  const category = await categoryModel.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('No category found');
  }
  // category.name = name;
  // category.standing = standing;

  if (standing) {
    // Fetch all category in the same restaurant, sorted by standing
    let allCategory = await categoryModel
      .find({ restaurant: restaurantId })
      .sort({ standing: 1 });

    // Remove the current categories from the array
    allCategory = allCategory.filter(
      (category) => category._id.toString() !== id
    );

    // Insert the updated category at the new standing
    allCategory.splice(standing - 1, 0, { _id: id });

    // Assign new standings sequentially
    const bulkUpdates = allCategory.map((category, index) => ({
      updateOne: {
        filter: { _id: category._id },
        update: { $set: { standing: index + 1 } },
      },
    }));

    if (bulkUpdates.length > 0) {
      await categoryModel.bulkWrite(bulkUpdates);
    }
  } else {
    await categoryModel.findOneAndUpdate(
      {
        _id: id,
        restaurant: restaurantId,
      },
      req.body,
      {
        new: true,
      }
    );
  }

  res.status(200).json({
    message: 'Category updated successfully',
    success: true,
  });
});

// @desc    Delete a category
// @route   DELETE
// @access  Admin
export const deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { restaurantId } = req.body;
  const category = await categoryModel.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('No category found');
  }

  await category.remove();

  // Fetch remaining categories and reorder standings
  const allCategory = await categoryModel
    .find({ restaurant: restaurantId })
    .sort({ standing: 1 });

  const bulkUpdates = allCategory.map((category, index) => ({
    updateOne: {
      filter: { _id: category._id },
      update: { $set: { standing: index + 1 } },
    },
  }));

  if (bulkUpdates.length > 0) {
    await categoryModel.bulkWrite(bulkUpdates);
  }

  res.status(200).json({
    message: 'Category deleted successfully',
    success: true,
  });
});
