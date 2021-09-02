const { User, validateUser } = require('../../Models/User');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const config = require('config');
const auth = require('../../middlewares/auth');
const router = require('express').Router();

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -isAdmin');
    console.log(user);
    res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
  } catch (error) {
    console.error(error.message, error.stack);
    res.status(400).send(error.message);
  }
});

router.get('/', auth, async (req, res) => {
  const pageSize = Number(req.query.page) || 10;
  const pageNumber = Number(req.query.page) || 1;

  const sort = req.query.sort === 'desc' ? req.query.sort : 'asc';

  const searchParameter = {}

  req.query.name ? searchParameter.name = {
    $regex: req.query.name,
    $option: 'i'
  } : {};

  req.query.isAdmin ? searchParameter.isAdmin = req.isAdmin : {};
  try {
    const count = await User.find({ ...searchParameter }).countDocuments({ ...searchParameter });
    const users = await User.find({ ...searchParameter }).select('_id name email isAdmin').sort({ name: sort }).limit(pageSize).skip(pageSize * (pageNumber - 1));
    res.status(200).send({ users, count, pageNumber, pageSize, Pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
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
    if (user) return res.status(400).json({
      errors: [
        {
          message: "User Already exists"
        }
      ]
    });

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