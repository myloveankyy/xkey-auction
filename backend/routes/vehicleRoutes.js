const express = require('express');
const router = express.Router();
const {
  getVehicles,
  createVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <-- ADDED THIS

// GET all vehicles is public
router.get('/', getVehicles);

// GET a single vehicle is public
router.get('/:id', getVehicleById);

// POST (create) a vehicle is protected and uses the upload middleware
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  createVehicle
);

// PUT (update) a vehicle is protected and uses the upload middleware
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  updateVehicle
);

// DELETE a vehicle is protected
router.delete('/:id', protect, deleteVehicle);

module.exports = router;