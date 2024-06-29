const express = require('express');
const router = express.Router();
const multer = require('multer');
const tesseract = require('tesseract.js');
const EnergyData = require('../models/EnergyData');

const upload = multer({ dest: 'uploads/' });

// Get all energy data
router.get('/', async (req, res) => {
    try {
        const data = await EnergyData.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new energy data via image upload
router.post('/upload', upload.single('image'), async (req, res) => {
    const { month, year } = req.body;

    try {
        // Perform OCR on the uploaded image
        const { data: { text } } = await tesseract.recognize(req.file.path);
        console.log('OCR Result:', text);
        const currentUsage = parseFloat(text.match(/\d+/)[0]); // Extract the first number from the text

        // Find the latest entry
        const latestEntry = await EnergyData.findOne().sort({ year: -1, month: -1 });

        let difference = 0;
        let generated = 0;
        if (latestEntry) {
            // Calculate the difference in usage and set generated value
            difference = currentUsage - latestEntry.usage;
            generated = latestEntry.generated;
        } else {
            generated = 0; // Assuming default generated value if no previous entry exists
        }

        const newData = new EnergyData({
            month,
            year,
            usage: currentUsage,
            generated,
            difference,
        });

        const data = await newData.save();
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
