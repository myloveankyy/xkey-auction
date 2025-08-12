// backend/controllers/vehicleController.js

const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/vehicleModel');
const fs = require('fs'); // --- ADDED: Node.js File System module
const path = require('path'); // --- ADDED: Node.js Path module

// @desc    Get all vehicles
const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
  res.status(200).json(vehicles);
});

// @desc    Add a new vehicle
const createVehicle = asyncHandler(async (req, res) => {
  const { vehicleName, category, originalPrice, xKeyPrice, pros, cons } = req.body;

  if (!req.files || !req.files.thumbnail) {
    res.status(400);
    throw new Error('Thumbnail image is required');
  }

  const thumbnailPath = req.files.thumbnail[0].path.replace(/\\/g, "/");
  const galleryPaths = req.files.gallery
    ? req.files.gallery.map((file) => file.path.replace(/\\/g, "/"))
    : [];

  if (!vehicleName || !category || !originalPrice || !xKeyPrice) {
    res.status(400);
    throw new Error('Please provide all required text fields');
  }

  const prosArray = pros ? pros.split('\n').map(p => p.trim()).filter(p => p) : [];
  const consArray = cons ? cons.split('\n').map(c => c.trim()).filter(c => c) : [];

  const vehicle = await Vehicle.create({
    ...req.body,
    pros: prosArray,
    cons: consArray,
    thumbnail: thumbnailPath,
    gallery: galleryPaths,
  });

  res.status(201).json(vehicle);
});

// @desc    Get a single vehicle by ID
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  res.status(200).json(vehicle);
});

// @desc    Update a vehicle by ID
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  const { pros, cons, ...otherUpdates } = req.body;
  Object.assign(vehicle, otherUpdates);

  if (pros !== undefined) {
    vehicle.pros = pros ? pros.split('\n').map(p => p.trim()).filter(p => p) : [];
  }
  if (cons !== undefined) {
    vehicle.cons = cons ? cons.split('\n').map(c => c.trim()).filter(c => c) : [];
  }

  if (req.files && req.files.thumbnail) {
    vehicle.thumbnail = req.files.thumbnail[0].path.replace(/\\/g, "/");
  }
  if (req.files && req.files.gallery) {
    const newGalleryPaths = req.files.gallery.map((file) => file.path.replace(/\\/g, "/"));
    vehicle.gallery.push(...newGalleryPaths);
  }

  const updatedVehicle = await vehicle.save();
  res.status(200).json(updatedVehicle);
});

// @desc    Delete a vehicle by ID
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  // --- MODIFIED: Added logic to delete associated image files ---
  const uploadsDir = path.resolve(__dirname, '..'); // Get the 'backend' directory path

  // 1. Delete the thumbnail image
  if (vehicle.thumbnail) {
    const thumbnailFilePath = path.join(uploadsDir, vehicle.thumbnail);
    if (fs.existsSync(thumbnailFilePath)) {
      fs.unlink(thumbnailFilePath, (err) => {
        if (err) console.error("Error deleting thumbnail file:", err);
      });
    }
  }

  // 2. Delete the gallery images
  if (vehicle.gallery && vehicle.gallery.length > 0) {
    vehicle.gallery.forEach(imagePath => {
      const galleryFilePath = path.join(uploadsDir, imagePath);
      if (fs.existsSync(galleryFilePath)) {
        fs.unlink(galleryFilePath, (err) => {
          if (err) console.error(`Error deleting gallery file ${imagePath}:`, err);
        });
      }
    });
  }
  // ----------------------------------------------------------------

  await vehicle.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Vehicle deleted successfully' });
});

module.exports = {
  getVehicles,
  createVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};