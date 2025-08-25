const express = require('express');
const router = express.Router();
const {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
} = require('../controllers/leadController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import admin middleware

// --- Public Route for creating a lead ---
router.post('/', createLead);

// --- Admin-Only Routes for managing leads ---
// All routes below this will use `protect` and `admin` middleware
router.use(protect, admin);

router.route('/')
  .get(getAllLeads); // GET /api/leads

router.route('/:id')
  .put(updateLeadStatus) // PUT /api/leads/:id
  .delete(deleteLead); // DELETE /api/leads/:id


module.exports = router;