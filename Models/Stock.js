const mongoose = require('mongoose');


const stockSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catagory'
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  history: [
    {
      date: {
        type: Date,
        default: Date.now()
      },
      stockIn: {
        type: Number
      },
      stockOut: {
        type: Number
      },
      invoiceNo: {
        type: String,
        required: function() {
          return !!(this.stockIn);
        }
      }
    }
  ]
})