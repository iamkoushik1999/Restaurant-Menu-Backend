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
  const categories = await categoryModel.find({ restaurant: restaurantId });

  res.status(200).json({
    data: categories,
  });
});

// @desc    Create a new category
// @route   POST
// @access  Admin
export const createCategory = expressAsyncHandler(async (req, res) => {
  const { restaurantId, name, standing } = req.body;
  if (!restaurantId) {
    res.status(400);
    throw new Error('Please select the restaurant');
  }

  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error('No restautant found');
  }

  const category = await categoryModel.create({
    restaurant: restaurantId,
    name,
    standing: standing ? standing : 10,
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
  const { name, standing } = req.body;
  const category = await categoryModel.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('No category found');
  }
  category.name = name;
  category.standing = standing;
  await category.save();
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
  const category = await categoryModel.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('No category found');
  }

  await category.remove();

  res.status(200).json({
    message: 'Category deleted successfully',
    success: true,
  });
});
