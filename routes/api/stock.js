const { SHA256 } = require('crypto-js');
const auth = require('../../middlewares/auth');
const authAdmin = require('../../middlewares/authAdmin');
const { validateStock, Stock } = require('../../Models/Stock');

const router = require('express').Router();


router.get('/', async (req, res) => {
  try {
    
  } catch (error) {
    
  }
});

router.post('/', auth, authAdmin, async(req, res) => {
  const { error } = validateStock(req.body);
  if(error) return res.send(400).json(error.details);
  const stockItem = new Stock({
    ...req.body,
  history: []
  });

  const stockHistory = {
    stockIn: 0,
    stockOut: 0,
    signedBy: req.user._id,
    previousHash: SHA256('Genesis'),
    nonce: 0,
    hash: SHA256(this.stockIn.toString() + this.stockOut.toString() + this.signedBy + this.previousHash + this.nonce)
  }

  console.log(stockHistory);
});



module.exports = router;