const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerBy: {
    type: String,
    required: true,
    enum: ['seller', 'admin'],
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String, 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const vehicleSchema = new mongoose.Schema(
  {
    // --- User & Listing Type ---
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    sellerType: {
      type: String,
      required: true,
      enum: ['xKey', 'user'],
    },
    listingType: {
      type: String,
      required: true,
      enum: ['listing', 'instant_sell'],
    },

    // --- Expanded Status Enum ---
    status: {
      type: String,
      required: true,
      enum: [
        'pending_approval',
        'listed',
        'rejected',
        'pending_valuation',
        'negotiating',
        'sold',
      ],
      default: 'pending_approval',
    },
    
    // --- Core Vehicle Details (WITH NEW PRICE FIELD) ---
    vehicleName: {
      type: String,
      required: [true, 'Please add a vehicle name'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    // --- NEW FIELD ADDED HERE ---
    exShowroomPrice: {
      type: Number, // This is the Original / Ex-Showroom price. It's optional.
    },
    // This is the seller's initial asking price
    sellingPrice: {
      type: Number,
      required: [true, 'Please add the asking price'],
    },
    age: {
      type: String,
      required: [true, 'Please add the vehicle age'],
    },
    condition: {
      type: String,
      required: [true, 'Please specify the vehicle condition'],
    },
    tyreCondition: {
      type: String,
      required: [true, 'Please specify the tyre condition'],
    },
    mileage: {
      type: String,
      required: [true, 'Please add the mileage'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please specify the fuel type'],
    },
    seatingCapacity: {
      type: String,
      required: [true, 'Please add the seating capacity'],
    },
    longDescription: {
      type: String,
      required: [true, 'Please add a detailed description'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Please add a thumbnail image path'],
    },
    gallery: { 
      type: [String],
      default: [],
    },

    // --- Negotiation & Admin Feedback ---
    valuationHistory: [offerSchema],
    rejectionReason: {
      type: String,
    },
    
    // --- Optional Details ---
    engine: { type: String },
    transmission: { type: String },
    shortDescription: { type: String },
    pros: { type: [String] },
    cons: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;