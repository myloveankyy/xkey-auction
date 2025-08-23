const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/vehicleModel');
const fs = require('fs');
const path = require('path');

// --- createVehicle function is updated to handle the new exShowroomPrice field ---
const createVehicle = asyncHandler(async (req, res) => {
  const user = req.user;
  const vehicleData = req.body;
  const files = req.files;

  let status, sellerType, listingType;

  if (user.role === 'admin') {
    sellerType = 'xKey';
    status = 'listed';
    listingType = 'listing';
  } else {
    listingType = vehicleData.listingType;
    if (!listingType || (listingType !== 'listing' && listingType !== 'instant_sell')) {
      res.status(400); 
      throw new Error('A valid listing type is required.');
    }
    sellerType = 'user';
    status = listingType === 'listing' ? 'pending_approval' : 'pending_valuation';
  }

  if (!vehicleData.vehicleName || !vehicleData.sellingPrice || !vehicleData.longDescription || !files || !files.thumbnail) {
    res.status(400); throw new Error('Please provide all required vehicle information and a thumbnail.');
  }

  const getRelativePath = (fullPath) => {
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const uploadsIndex = normalizedPath.indexOf('uploads');
    return uploadsIndex === -1 ? normalizedPath : normalizedPath.substring(uploadsIndex);
  };

  const thumbnailPath = getRelativePath(files.thumbnail[0].path);
  const galleryPaths = files.gallery ? files.gallery.map(file => getRelativePath(file.path)) : [];

  const vehiclePayload = {
    ...vehicleData,
    exShowroomPrice: vehicleData.exShowroomPrice || null, // --- THIS IS THE KEY UPDATE ---
    seller: user._id,
    sellerType,
    listingType,
    status,
    thumbnail: thumbnailPath,
    gallery: galleryPaths,
    pros: vehicleData.pros ? vehicleData.pros.split('\n').filter(p => p.trim() !== '') : [],
    cons: vehicleData.cons ? vehicleData.cons.split('\n').filter(c => c.trim() !== '') : [],
  };

  const vehicle = await Vehicle.create(vehiclePayload);

  res.status(201).json(vehicle);
});


// --- REMAINDER OF THE FILE IS UNCHANGED ---
const getPublicVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ status: 'listed' }).populate('seller', 'name').sort({ createdAt: -1 });
  res.status(200).json(vehicles);
});
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('seller', 'name email');
  if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
  res.status(200).json(vehicle);
});
const getMyListings = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(vehicles);
});
const deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
    if (req.user.role !== 'admin' && vehicle.seller.toString() !== req.user.id) {
        res.status(401); throw new Error('User not authorized');
    }
    await vehicle.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Vehicle deleted successfully' });
});
const getAllVehiclesAsAdmin = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({}).populate('seller', 'name email').sort({ createdAt: -1 });
  res.status(200).json(vehicles);
});
const approveListing = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle && vehicle.status === 'pending_approval') {
        vehicle.status = 'listed';
        const updatedVehicle = await vehicle.save();
        res.status(200).json(updatedVehicle);
    } else {
        res.status(404); throw new Error('Vehicle not found or not pending approval.');
    }
});
const rejectListing = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle && vehicle.status === 'pending_approval') {
        vehicle.status = 'rejected';
        vehicle.rejectionReason = reason || 'No reason provided.';
        const updatedVehicle = await vehicle.save();
        res.status(200).json(updatedVehicle);
    } else {
        res.status(404); throw new Error('Vehicle not found or not pending approval.');
    }
});
const submitNegotiationOffer = asyncHandler(async (req, res) => {
    const { amount, message } = req.body;
    if (!amount) { res.status(400); throw new Error('Offer amount is required.'); }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) { res.status(404); throw new Error('Vehicle not found.'); }
    const user = req.user;
    const isOwner = vehicle.seller.toString() === user.id;
    let offerBy;
    if (user.role === 'admin') { offerBy = 'admin'; } else if (isOwner) { offerBy = 'seller'; } else { res.status(401); throw new Error('User not authorized to negotiate.'); }
    const lastOffer = vehicle.valuationHistory[vehicle.valuationHistory.length - 1];
    if (lastOffer && lastOffer.offerBy === offerBy) { res.status(400); throw new Error(`Cannot submit an offer. Waiting for a response.`); }
    vehicle.valuationHistory.push({ offerBy, amount, message });
    vehicle.status = 'negotiating';
    const updatedVehicle = await vehicle.save();
    res.status(200).json(updatedVehicle);
});
const acceptOffer = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) { res.status(404); throw new Error('Vehicle not found.'); }
    const lastOffer = vehicle.valuationHistory[vehicle.valuationHistory.length - 1];
    if (!lastOffer) { res.status(400); throw new Error('No offer available to accept.'); }
    const user = req.user;
    const isOwner = vehicle.seller.toString() === user.id;
    if ((user.role === 'admin' && lastOffer.offerBy === 'seller') || (isOwner && lastOffer.offerBy === 'admin')) {
        vehicle.status = 'sold';
        vehicle.sellingPrice = lastOffer.amount; // Use sellingPrice to align with model
    } else {
        res.status(401); throw new Error('Not authorized to accept this offer.');
    }
    const updatedVehicle = await vehicle.save();
    res.status(200).json(updatedVehicle);
});

module.exports = { getPublicVehicles, createVehicle, getVehicleById, deleteVehicle, getMyListings, getAllVehiclesAsAdmin, approveListing, rejectListing, submitNegotiationOffer, acceptOffer };