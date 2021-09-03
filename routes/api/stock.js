const { SHA256 } = require('crypto-js');
const auth = require('../../middlewares/auth');
const authAdmin = require('../../middlewares/authAdmin');
const { validateStock, Stock } = require('../../Models/Stock');

const router = require('express').Router();


router.get('/', async (req, res) => {
  try {
    const stock = await Stock.find({}).populate('category', ['name']).populate('history.signedBy', ['name']);
    res.status(200).send(stock);
  } catch (error) {
    console.log(error)
  }
});

router.post('/', auth, authAdmin, async (req, res) => {
  const { error } = validateStock(req.body);
  if (error) return res.send(400).json(error.details);
  const stockItem = new Stock({
    ...req.body,
    history: []
  });

  const stockHistory = {
    stockIn: 0,
    stockOut: 0,
    signedBy: req.user._id,
    previousHash: SHA256('Genesis').toString(),
    nonce: 0
  }


  stockHistory.hash = SHA256(stockHistory.stockIn + stockHistory.stockOut + stockHistory.signedBy + stockHistory.previousHash + stockHistory.nonce).toString();

  stockItem.history.push(stockHistory);

  try {
    const savedItem = await stockItem.save();
    res.status(200).send(stockItem);
  } catch (error) {
    console.log(error);
  }

});


router.put('/:id', auth, async (req, res) => {
  try {
    let stock = await Stock.findById(req.params.id);
    const stockHistory = {
      stockIn: req.body.stockIn,
      stockOut: 0,
      invoiceNo: req.body.invoiceNo,
      signedBy: req.user._id,
      previousHash: SHA256('Genesis').toString(),
      nonce: 0
    }
    stockHistory.hash = SHA256(stockHistory.stockIn + stockHistory.stockOut + stockHistory.signedBy + stockHistory.previousHash + stockHistory.nonce).toString();
    stock.history.push(stockHistory);
    stock = await stock.save();
    res.send(stock);
  } catch (error) {
    res.send(error);
  }
})

const calculatehash = (object) => {

}

module.exports = router;