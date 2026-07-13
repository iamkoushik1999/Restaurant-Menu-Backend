// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';
import categoryModel from '../models/categoryModel.js';
import menuModel from '../models/menuModel.js';
// Utils
import { generateCategoryStanding } from '../utils/generateNumber.js';

// --------------------------------------------------------------------------------

const getOwnedRestaurant = async (ownerId) => {
  const restaurant = await restaurantModel.findOne({ owner: ownerId });
  if (!restaurant) {
    const error = new Error('No restaurant found for this account');
    error.statusCode = 404;
    throw error;
  }
  return restaurant;
};

// @desc    Get all categories for the logged-in owner's restaurant
// @route   GET /api/v1/category/mine
// @access  Private
export const getAllCategories = expressAsyncHandler(async (req, res) => {
  const restaurant = await getOwnedRestaurant(req.user._id);

  const categories = await categoryModel
    .find({ restaurant: restaurant._id })
    .sort({ standing: 1 });

  res.status(200).json({
    success: true,
    data: categories,
  });
});

// @desc    Create a new category
// @route   POST /api/v1/category
// @access  Private
export const createCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const restaurant = await getOwnedRestaurant(req.user._id);

  const category = await categoryModel.create({
    restaurant: restaurant._id,
    name,
    standing: await generateCategoryStanding(restaurant._id),
  });

  res.status(201).json({
    message: 'Category created successfully',
    success: true,
    data: category,
  });
});

// @desc    Update a category (name and/or standing/display order)
// @route   PUT /api/v1/category/:id
// @access  Private
export const updateCategory = expressAsyncHandler(async (req, res) => {
  const restaurant = await getOwnedRestaurant(req.user._id);
  const { id } = req.params;
  const { name, standing } = req.body;

  const category = await categoryModel.findOne({
    _id: id,
    restaurant: restaurant._id,
  });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (name) {
    category.name = name;
    await category.save();
  }

  if (standing) {
    let allCategories = await categoryModel
      .find({ restaurant: restaurant._id })
      .sort({ standing: 1 });

    allCategories = allCategories.filter((c) => c._id.toString() !== id);
    allCategories.splice(standing - 1, 0, { _id: id });

    const bulkUpdates = allCategories.map((c, index) => ({
      updateOne: {
        filter: { _id: c._id },
        update: { $set: { standing: index + 1 } },
      },
    }));

    if (bulkUpdates.length > 0) {
      await categoryModel.bulkWrite(bulkUpdates);
    }
  }

  const updated = await categoryModel.findById(id);

  res.status(200).json({
    message: 'Category updated successfully',
    success: true,
    data: updated,
  });
});

// @desc    Delete a category (and its menu items)
// @route   DELETE /api/v1/category/:id
// @access  Private
export const deleteCategory = expressAsyncHandler(async (req, res) => {
  const restaurant = await getOwnedRestaurant(req.user._id);
  const { id } = req.params;

  const category = await categoryModel.findOne({
    _id: id,
    restaurant: restaurant._id,
  });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await categoryModel.findByIdAndDelete(id);
  await menuModel.deleteMany({ category: id });

  const remaining = await categoryModel
    .find({ restaurant: restaurant._id })
    .sort({ standing: 1 });

  const bulkUpdates = remaining.map((c, index) => ({
    updateOne: {
      filter: { _id: c._id },
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
