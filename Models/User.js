const Joi = require('joi');
const mongoose = require('mongoose');
const passwordComplexity = require('joi-password-complexity');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 250,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250
  },
  password: {
    type: String,
    required: true,
  }
});

const User = mongoose.model('User', userSchema);

const validateUser = async (user) => {
  const schema = Joi.object({
    name: Joi.string().max(250).min(3).required(),
    email: Joi.string().email().min(5).max(250).required(),
    password: new passwordComplexity({
      min: 6,
      max: 250,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      requirementCount: 3
    }).required(),
  });

  return await schema.validateAsync(user);
}

module.exports = {User, validateUser};