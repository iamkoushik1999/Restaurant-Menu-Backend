// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import restaurantModel from '../models/restaurantModel.js';
import categoryModel from '../models/categoryModel.js';
import menuModel from '../models/menuModel.js';

// --------------------------------------------------------------------------------

// @desc    Get a restaurant's public menu by slug (the page a scanned QR code opens)
// @route   GET /api/v1/public/menu/:slug
// @access  Public
export const getPublicMenu = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;

  const restaurant = await restaurantModel
    .findOne({ slug, isActive: true })
    .select('name slug logo address city state country phone email website');

  if (!restaurant) {
    res.status(404);
    throw new Error('Menu not found');
  }

  const [categories, menuItems] = await Promise.all([
    categoryModel.find({ restaurant: restaurant._id }).sort({ standing: 1 }),
    menuModel
      .find({ restaurant: restaurant._id, isAvailable: true })
      .sort({ createdAt: 1 }),
  ]);

  const menu = categories.map((category) => ({
    _id: category._id,
    name: category.name,
    items: menuItems.filter(
      (item) => item.category.toString() === category._id.toString()
    ),
  })).filter((category) => category.items.length > 0);

  res.status(200).json({
    success: true,
    data: {
      restaurant,
      menu,
    },
  });
});
