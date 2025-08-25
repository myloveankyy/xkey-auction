const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getVehiclesByStatus,
  getLeadsByStatus,
  getUserRegistrationTrends,    // --- NEW IMPORT ---
  getVehicleSubmissionTrends,   // --- NEW IMPORT ---
  getTopVehiclesByLeads,        // --- NEW IMPORT ---
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// All analytics routes are protected and admin-only
router.use(protect, admin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/vehicles-by-status', getVehiclesByStatus);
router.get('/leads-by-status', getLeadsByStatus);
router.get('/user-registration-trends', getUserRegistrationTrends); // --- NEW ROUTE ---
router.get('/vehicle-submission-trends', getVehicleSubmissionTrends); // --- NEW ROUTE ---
router.get('/top-vehicles-by-leads', getTopVehiclesByLeads); // --- NEW ROUTE ---

module.exports = router;