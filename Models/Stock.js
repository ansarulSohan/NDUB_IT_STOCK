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
      },
      deliveredTo: {
        type: String,
        required: function(){
          return !!this.stockOut;
        }
      },
      hash: {
        type: String,
        required: true
      },
      previousHash: {
        type: String,
        required: true
      },
      nonce: {
        type: Number,
        default: 0
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
})

const Stock = mongoose.model('Stock', stockSchema);

module.exports = { Stock }