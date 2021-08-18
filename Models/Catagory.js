const Joi = require('joi');
const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 50
	}
});

const Catagory = mongoose.model('Catagory', catagorySchema);

const validateCatagory = (catagory) => {
	const schema = Joi.object({
		name: Joi.string().required().min(1).max(50)
	});

	return schema.validate(catagory);
}


module.exports = { Catagory, validateCatagory };