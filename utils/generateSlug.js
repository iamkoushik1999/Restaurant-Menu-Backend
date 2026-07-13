import slugify from 'slugify';
import crypto from 'crypto';
import restaurantModel from '../models/restaurantModel.js';

// Generate a unique, URL-safe slug for a restaurant's public menu link
export const generateUniqueSlug = async (name) => {
  const base = slugify(name, { lower: true, strict: true }) || 'restaurant';

  let slug = base;
  let attempts = 0;

  while (await restaurantModel.exists({ slug })) {
    attempts += 1;
    const suffix = crypto.randomBytes(3).toString('hex');
    slug = `${base}-${suffix}`;
    if (attempts > 10) break;
  }

  return slug;
};
