const express = require('express');
const router = express.Router();
const {
  getPublicVehicles,
  createVehicle,
  getVehicleById,
  deleteVehicle,
  getMyListings,
  getAllVehiclesAsAdmin,
  approveListing,
  rejectListing,
  submitNegotiationOffer,
  acceptOffer,
} = require('../controllers/vehicleController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const createUploadConfig = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]);

// --- ISOLATION TEST: ONLY THIS ROUTE IS ACTIVE ---
router.get('/', getPublicVehicles);

// --- SELLER PROTECTED ROUTES ---
// router.get('/my-listings', protect, getMyListings);
// router.post('/', protect, createUploadConfig, createVehicle);

// --- PUBLIC DYNAMIC ROUTE ---
// router.get('/:id', getVehicleById);

// --- ADMIN PROTECTED ROUTES ---
// router.get('/admin/all', protect, admin, getAllVehiclesAsAdmin);
// router.put('/:id/approve-listing', protect, admin, approveListing);
// router.put('/:id/reject-listing', protect, admin, rejectListing);

// --- SHARED PROTECTED ROUTES (SELLER & ADMIN) ---
// router.delete('/:id', protect, deleteVehicle);

// --- NEGOTIATION ROUTES ---
// router.post('/:id/negotiate', protect, submitNegotiationOffer);
// router.post('/:id/accept-offer', protect, acceptOffer);

module.exports = router;