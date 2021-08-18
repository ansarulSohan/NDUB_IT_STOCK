const router = require('express').Router();
const { Catagory, validateCatagory } = require('../../Models/Catagory');
const _ = require('lodash');

router.get('/', async (req, res) => {

	const pageSize = Number(req.query.page) || 10;
	const pageNumber = Number(req.query.page) || 1;

	const sortParameters = {
		sort: req.query.sort || 'asc',
		sortBy: req.query.sortBy || 'name'
	};

	const searchParameter = {}

	req.query.name ? searchParameter.name = {
		$regex: `/${req.query.name}/`,
		$option: 'i'
	} : {};

	try {
		const count = await Catagory.countDocuments({ ...searchParameter });
		const catagories = await Catagory.find({ ...searchParameter }).limit(pageSize).skip((pageNumber - 1) * pageSize);
		if (!catagories) return res.status(404).json({ message: 'Catagory Not Found' });
		res.status(200).send(_.pick(catagories, ['name']), { count, page, pages: Math.ceil(count / pageSize) });
	} catch (error) {
		console.log(error.message);
		res.status(error.status || 400).send(error.message);
	}
});


router.get('/:id', async (req, res) => {
	try {
		const catagory = await Catagory.findById(req.params.id);
	} catch (error) {
		console.error(_.pick(error, ['name', 'message']));
		res.status(400).send(_.pick(error, ['name', 'message']));
	}
});





module.exports = router