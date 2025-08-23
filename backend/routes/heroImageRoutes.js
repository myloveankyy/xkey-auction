const express = require('express');
const router = express.Router();
const {
  getHeroImages,
  createHeroImage,
  deleteHeroImage,
} = require('../controllers/heroImageController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getHeroImages)
  .post(protect, admin, upload.single('image'), createHeroImage);

router.route('/:id')
  .delete(protect, admin, deleteHeroImage);

module.exports = router;