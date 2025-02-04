// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';
import categoryModel from '../models/categoryModel.js';
import menuModel from '../models/menuModel.js';

// --------------------------------------------------------------------------------

// @desc    Get all menus
// @route   GET
// @access  Public
export const getAllMenus = expressAsyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error('No restaurant found');
  }
  const menus = await menuModel.find({ restaurant: restaurantId });

  const totalMenus = menus.length;

  res.status(200).json({
    data: menus,
    total: totalMenus,
  });
});

// @desc    Create a new menu
// @route   POST
// @access  Admin
export const createMenu = expressAsyncHandler(async (req, res) => {
  const { restaurantId, categoryId, name, price, type } = req.body;
  if (!restaurantId || !categoryId) {
    res.status(400);
    throw new Error('Please select the restaurant and category');
  }

  const restaurant = await restaurantModel.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error('No restautant found');
  }

  const category = await categoryModel.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('No category found');
  }

  const menu = await menuModel.create({
    restaurant: restaurantId,
    category: categoryId,
    name,
    price,
    type,
  });

  res.status(200).json({
    message: 'Menu created successfully',
    success: true,
    data: menu,
  });
});

// @desc    Update a menu
// @route   PUT
// @access  Admin
export const updateMenu = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, type, categoryId } = req.body;
  const menu = await menuModel.findById(id);
  if (!menu) {
    res.status(404);
    throw new Error('No menu found');
  }
  menu.name = name;
  menu.price = price;
  menu.type = type;
  menu.category = categoryId;

  await menu.save();
  res.status(200).json({
    message: 'Menu updated successfully',
    success: true,
    data: menu,
  });
});

// @desc    Delete a menu
// @route   DELETE
// @access  Admin
export const deleteMenu = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const menu = await menuModel.findById(id);
  if (!menu) {
    res.status(404);
    throw new Error('No menu found');
  }

  await menuModel.findByIdAndDelete(id);

  res.status(200).json({
    message: 'Menu deleted successfully',
    success: true,
  });
});
