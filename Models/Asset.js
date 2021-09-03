const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetNo: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  assignedTo: {
    type: String,
    required: true
  },
  roomNo: {
    type: Number,
    required: true
  }
});

const Asset = mongoose.model('Asset', assetSchema);


module.exports = {Asset};