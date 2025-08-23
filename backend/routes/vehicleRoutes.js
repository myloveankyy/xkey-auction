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

// --- PUBLIC ROUTES ---
router.get('/', getPublicVehicles); // Gets public vehicles for homepage

// --- SELLER PROTECTED ROUTES ---
// IMPORTANT: Place specific static routes BEFORE general dynamic routes
router.get('/my-listings', protect, getMyListings); // Get all vehicles submitted by the logged-in user
router.post('/', protect, createUploadConfig, createVehicle); // Create a new vehicle listing or instant sell request


// --- PUBLIC DYNAMIC ROUTE ---
// This route must come AFTER /my-listings to avoid 'my-listings' being treated as an ID
router.get('/:id', getVehicleById); // Get details for a single vehicle


// --- ADMIN PROTECTED ROUTES ---
router.get('/admin/all', protect, admin, getAllVehiclesAsAdmin); // Get ALL vehicles for the admin dashboard

router.put('/:id/approve-listing', protect, admin, approveListing); // Approve a pending user listing
router.put('/:id/reject-listing', protect, admin, rejectListing); // Reject a pending user listing


// --- SHARED PROTECTED ROUTES (SELLER & ADMIN) ---
router.delete('/:id', protect, deleteVehicle); // Delete a vehicle (accessible by owner or admin)

// --- NEGOTIATION ROUTES ---
router.post('/:id/negotiate', protect, submitNegotiationOffer); // Submit an offer (admin) or counter-offer (seller)
router.post('/:id/accept-offer', protect, acceptOffer); // Accept the latest offer on the table


module.exports = router;