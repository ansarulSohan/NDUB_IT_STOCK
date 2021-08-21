const router = require('express').Router();
const { Category, validateCatagory } = require('../../Models/Category');
const _ = require('lodash');
const mongoose = require('mongoose');

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
		const count = await Category.countDocuments({ ...searchParameter });
		let categories = await Category.find({ ...searchParameter }).sort({ name: sort }).limit(pageSize).skip((pageNumber - 1) * pageSize);
		if (_.isEmpty(categories)) return res.status(404).json({
			errors: [
				{
					message: 'Catagory Not Found'
				}
			]
		});
		res.status(200).json({ categories, count, pageNumber, pages: Math.ceil(count / pageSize) });
	} catch (error) {
		console.log(_.pick(error, ['name', 'message']));
		res.status(400).send(_.pick(error, ['name', 'message']));
	}
});


router.get('/:id', async (req, res) => {
	try {
		const isValidId = mongoose.isValidObjectId(req.params.id);
		if (!isValidId) return res.status(400).json({
			errors: [
				{
					msg: "id is not valid"
				}
			]
		});
		const category = await Category.findOne({_id: req.params.id});
		if (!category) return res.status(404).send('Category not found');
		res.status(200).send(category);
	} catch (error) {
		console.error(_.pick(error, ['name', 'message']));
		res.status(400).send(_.pick(error, ['name', 'message']));
	}
});


router.post('/', async (req, res) => {
	const result = validateCatagory(req.body);
	if (result.error) return res.json(result.error.details[0].message);
	try {
		let category = new Category(req.body);
		category = await category.save();
		res.status(200).json(category);
	} catch (error) {
		console.error(_.pick(error, ['name', message]));
		res.status(400).send(_.pick(error, ['name', message]));
	}

});


module.exports = router;