const express = require('express');
const router = express.Router();
const Waste = require('../models/Waste');
const mongoose = require('mongoose');

// Function to calculate carbon footprint
const calculateCarbonFootprint = ({ organic, plastic, paper, metal, glass }) => {
    // Define your conversion factors (example values)
    const conversionFactors = {
        organic: 0.5,   // Example conversion factor for organic waste (hypothetical value)
        plastic: 2.0,   // Example conversion factor for plastic waste (hypothetical value)
        paper: 1.0,     // Example conversion factor for paper waste (hypothetical value)
        metal: 3.0,     // Example conversion factor for metal waste (hypothetical value)
        glass: 0.2      // Example conversion factor for glass waste (hypothetical value)
    };

    // Calculate total carbon footprint
    let totalCarbonFootprint = 0;
    Object.keys({ organic, plastic, paper, metal, glass }).forEach(key => {
        totalCarbonFootprint += parseFloat({ organic, plastic, paper, metal, glass }[key]) * conversionFactors[key];
    });

    return totalCarbonFootprint;
};

// Create a new waste log
router.post('/', async (req, res) => {
    try {
        const { date, organic, plastic, paper, metal, glass } = req.body;
        const carbonFootprint = calculateCarbonFootprint({ organic, plastic, paper, metal, glass });

        const wasteLog = new Waste({
            date,
            organic,
            plastic,
            paper,
            metal,
            glass,
            carbonFootprint  // Store calculated carbon footprint
        });

        await wasteLog.save();
        res.status(201).send(wasteLog); // Return the saved object on successful creation
    } catch (error) {
        res.status(400).send({ error: 'Error creating waste log', details: error.message }); // Handle validation or save errors
    }
});

// Get all waste logs
router.get('/', async (req, res) => {
    try {
        const wasteLogs = await Waste.find({});
        res.send(wasteLogs);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching waste logs', details: error.message });
    }
});

// Get a waste log by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid waste log ID' });
    }

    try {
        const wasteLog = await Waste.findById(id);
        if (!wasteLog) {
            return res.status(404).send({ error: 'Waste log not found' }); // If no waste log found with the ID
        }
        res.send(wasteLog);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching waste log', details: error.message });
    }
});

// Update a waste log by ID
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['organic', 'plastic', 'paper', 'metal', 'glass'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid waste log ID' });
    }

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' }); // If invalid updates are attempted
    }

    try {
        const wasteLog = await Waste.findById(id);
        if (!wasteLog) {
            return res.status(404).send({ error: 'Waste log not found' }); // If no waste log found with the ID
        }

        updates.forEach(update => wasteLog[update] = req.body[update]);
        await wasteLog.save();
        res.send(wasteLog);
    } catch (error) {
        res.status(400).send({ error: 'Error updating waste log', details: error.message }); // Handle validation or save errors
    }
});

// Delete a waste log by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid waste log ID' });
    }

    try {
        const wasteLog = await Waste.findByIdAndDelete(id);
        if (!wasteLog) {
            return res.status(404).send({ error: 'Waste log not found' }); // If no waste log found with the ID
        }
        res.send(wasteLog);
    } catch (error) {
        res.status(500).send({ error: 'Error deleting waste log', details: error.message });
    }
});

module.exports = router;
