const mongoose = require('mongoose');

const heroImageSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HeroImage', heroImageSchema);