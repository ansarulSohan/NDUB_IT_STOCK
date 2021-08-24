const { User, validateUser } = require('../../Models/User');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

router.get('/', async (req, res) => {
  const pageSize = Number(req.query.page) || 10;
  const pageNumber = Number(req.query.page) || 1;

  const sort = req.query.sort === 'desc' ? req.query.sort : 'asc';

  const searchParameter = {}

  req.query.name ? searchParameter.name = {
    $regex: req.query.name,
    $option: 'i'
  } : {};
  try {
    const user = await User.find().select('_id name email isAdmin');
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User Not Found!');
    res.status(200).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
  } catch (error) {
    res.status(200).send(error.message);
  }
});


router.post('/', async (req, res) => {
  try {
    const result = await validateUser(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists. ');

    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: password,
      isAdmin: req.body.isAdmin
    });

    user = await user.save();
    const token = user.generateAuthToken();

    res.status(200).header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});



module.exports = router;