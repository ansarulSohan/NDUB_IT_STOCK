const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 50
	}
});

const Category = mongoose.model('Catagory', categorySchema);

const validateCategory = (category) => {
	const schema = Joi.object({
		name: Joi.string().required().min(1).max(50)
	});

	return schema.validate(category);
}


module.exports = { Category, validateCategory };