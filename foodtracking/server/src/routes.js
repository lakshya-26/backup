const express = require('express');
const Food = require('./models/food.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
