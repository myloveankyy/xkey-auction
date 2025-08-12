const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: [true, 'Please add a vehicle name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    // --- Key Specification Fields ---
    age: {
      type: String,
    },
    condition: {
      type: String,
    },
    tyre: {
      type: String,
    },
    mileage: { // <-- ADDED
      type: String, 
    },
    engine: { // <-- ADDED
      type: String,
    },
    transmission: { // <-- ADDED
      type: String,
    },
    fuelType: { // <-- ADDED
      type: String,
    },
    seating: { // <-- ADDED
      type: String,
    },
    // --- Pricing ---
    originalPrice: {
      type: Number,
      required: [true, 'Please add the original price'],
    },
    xKeyPrice: {
      type: Number,
      required: [true, 'Please add the xKey price'],
    },
    // --- Descriptions & Details ---
    shortDescription: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    pros: {
      type: [String], // Already correct for multiple points
    },
    cons: {
      type: [String], // Already correct for multiple points
    },
    // --- Images ---
    thumbnail: {
      type: String,
      required: [true, 'Please add a thumbnail image path'],
    },
    gallery: {
      type: [String],
    },
    // --- Kept for potential future use ---
    reviews: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;