import streamifier from 'streamifier';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

// Streams an in-memory file buffer (from multer) up to Cloudinary
export const uploadBufferToCloudinary = (buffer, folder) => {
  if (!isCloudinaryConfigured) {
    return Promise.reject(
      new Error(
        'Image upload is not configured yet. Add Cloudinary credentials to the backend .env file.'
      )
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log('Failed to delete Cloudinary image:', error.message);
  }
};
