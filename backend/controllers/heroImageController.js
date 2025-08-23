const asyncHandler = require('express-async-handler');
const HeroImage = require('../models/heroImageModel');
const fs = require('fs');
const path = require('path');

// @desc    Get all hero images
// @route   GET /api/hero-images
// @access  Public
const getHeroImages = asyncHandler(async (req, res) => {
  const images = await HeroImage.find().sort({ createdAt: -1 });
  res.status(200).json(images);
});

// @desc    Create a new hero image
// @route   POST /api/hero-images
// @access  Private (Admin)
const createHeroImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded.');
  }

  // Use path.join for cross-platform compatibility and replace backslashes for URL
  const url = path.join('/uploads/images', req.file.filename).replace(/\\/g, '/');

  const heroImage = await HeroImage.create({ url });

  if (heroImage) {
    res.status(201).json(heroImage);
  } else {
    res.status(400);
    throw new Error('Invalid hero image data, could not save to database.');
  }
});

// @desc    Delete a hero image
// @route   DELETE /api/hero-images/:id
// @access  Private (Admin)
const deleteHeroImage = asyncHandler(async (req, res) => {
  const heroImage = await HeroImage.findById(req.params.id);

  if (!heroImage) {
    res.status(404);
    throw new Error('Hero image not found.');
  }

  // Construct the correct file path by removing the leading slash from the URL
  // and joining it with the project's root directory.
  const filePath = path.join(__dirname, '..', heroImage.url.substring(1));

  fs.unlink(filePath, async (err) => {
    if (err) {
      console.error(`Attempted to delete file but failed: ${filePath}`, err);
    }
    
    await heroImage.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Hero image deleted successfully.' });
  });
});

module.exports = {
  getHeroImages,
  createHeroImage,
  deleteHeroImage,
};