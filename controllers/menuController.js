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
  const { id } = req.user;

  const restaurant = await restaurantModel.findOne({ owner: id });
  if (!restaurant) {
    res.status(404);
    throw new Error('No restaurant found');
  }
  const menus = await menuModel.find({ restaurant: restaurant._id });

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
  const { id } = req.user;
  const { categoryId, name, price, isVegetarian, halfAvailable, halfPrice } =
    req.body;
  if (!categoryId || !name || !price) {
    res.status(400);
    throw new Error('Please select category, name and price');
  }

  if (halfAvailable && !halfPrice) {
    res.status(400);
    throw new Error('Please provide half price');
  }

  const restaurant = await restaurantModel.findOne({ owner: id });
  if (!restaurant) {
    res.status(404);
    throw new Error('No restaurant found');
  }

  const category = await categoryModel.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('No category found');
  }

  const menu = await menuModel.create({
    restaurant: restaurant._id,
    category: categoryId,
    name,
    price,
    isVegetarian,
    type: isVegetarian ? 'Veg' : 'NonVeg',
    halfAvailable,
    halfPrice,
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
  const { name, price, isVegetarian, categoryId, halfAvailable, halfPrice } =
    req.body;
  const menu = await menuModel.findById(id);
  if (!menu) {
    res.status(404);
    throw new Error('No menu found');
  }
  menu.category = categoryId;
  menu.name = name;
  menu.price = price;
  menu.type = isVegetarian ? 'Veg' : 'NonVeg';
  menu.isVegetarian = isVegetarian;
  menu.halfAvailable = halfAvailable;
  menu.halfPrice = halfPrice;

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
