// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';
import categoryModel from '../models/categoryModel.js';
import menuModel from '../models/menuModel.js';
// Utils
import { uploadBufferToCloudinary, deleteCloudinaryImage } from '../utils/uploadImage.js';

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

// @desc    Get all menu items for the logged-in owner's restaurant
// @route   GET /api/v1/menu/mine
// @access  Private
export const getAllMenus = expressAsyncHandler(async (req, res) => {
  const restaurant = await getOwnedRestaurant(req.user._id);
  const menus = await menuModel
    .find({ restaurant: restaurant._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: menus,
    total: menus.length,
  });
});

// @desc    Create a new menu item
// @route   POST /api/v1/menu
// @access  Private
export const createMenu = expressAsyncHandler(async (req, res) => {
  const { categoryId, name, price, description, isVegetarian, halfAvailable, halfPrice } =
    req.body;

  if (!categoryId || !name || !price) {
    res.status(400);
    throw new Error('Please provide a category, name and price');
  }

  const vegetarian = isVegetarian === 'true' || isVegetarian === true;
  const halfPortionAvailable = halfAvailable === 'true' || halfAvailable === true;

  if (halfPortionAvailable && !halfPrice) {
    res.status(400);
    throw new Error('Please provide a half portion price');
  }

  const restaurant = await getOwnedRestaurant(req.user._id);

  const category = await categoryModel.findOne({
    _id: categoryId,
    restaurant: restaurant._id,
  });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  let image;
  let imagePublicId;
  if (req.file) {
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      'restaurant-menu/items'
    );
    image = result.secure_url;
    imagePublicId = result.public_id;
  }

  const menu = await menuModel.create({
    restaurant: restaurant._id,
    category: categoryId,
    name,
    price,
    description,
    image,
    imagePublicId,
    isVegetarian: vegetarian,
    type: vegetarian ? 'Veg' : 'NonVeg',
    halfAvailable: halfPortionAvailable,
    halfPrice: halfPortionAvailable ? halfPrice : undefined,
  });

  res.status(201).json({
    message: 'Menu item created successfully',
    success: true,
    data: menu,
  });
});

// @desc    Update a menu item
// @route   PUT /api/v1/menu/:id
// @access  Private
export const updateMenu = expressAsyncHandler(async (req, res) => {
  const restaurant = await getOwnedRestaurant(req.user._id);
  const { id } = req.params;

  const menu = await menuModel.findOne({ _id: id, restaurant: restaurant._id });
  if (!menu) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  const { categoryId, name, price, description, isVegetarian, halfAvailable, halfPrice, isAvailable } =
    req.body;

  if (categoryId) {
    const category = await categoryModel.findOne({
      _id: categoryId,
      restaurant: restaurant._id,
    });
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    menu.category = categoryId;
  }

  if (name) menu.name = name;
  if (price) menu.price = price;
  if (description !== undefined) menu.description = description;

  if (isVegetarian !== undefined) {
    menu.isVegetarian = isVegetarian === 'true' || isVegetarian === true;
    menu.type = menu.isVegetarian ? 'Veg' : 'NonVeg';
  }

  if (halfAvailable !== undefined) {
    menu.halfAvailable = halfAvailable === 'true' || halfAvailable === true;
    menu.halfPrice = menu.halfAvailable ? halfPrice : undefined;
  }

  if (isAvailable !== undefined) {
    menu.isAvailable = isAvailable === 'true' || isAvailable === true;
  }

  if (req.file) {
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      'restaurant-menu/items'
    );
    await deleteCloudinaryImage(menu.imagePublicId);
    menu.image = result.secure_url;
    menu.imagePublicId = result.public_id;
  }

  await menu.save();

  res.status(200).json({
    message: 'Menu item updated successfully',
    success: true,
    data: menu,
  });
});

// @desc    Delete a menu item
// @route   DELETE /api/v1/menu/:id
// @access  Private
export const deleteMenu = expressAsyncHandler(async (req, res) => {
  const restaurant = await getOwnedRestaurant(req.user._id);
  const { id } = req.params;

  const menu = await menuModel.findOne({ _id: id, restaurant: restaurant._id });
  if (!menu) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  await deleteCloudinaryImage(menu.imagePublicId);
  await menuModel.findByIdAndDelete(id);

  res.status(200).json({
    message: 'Menu item deleted successfully',
    success: true,
  });
});
