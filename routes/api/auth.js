const Joi = require('joi');
const { User } = require('../../Models/User');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.status(200).send(token);


  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }

});



function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(250).required(),
    password: Joi.string().required()
  });

  return schema.validate(user);
}


module.exports = router;