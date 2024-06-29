const multer = require('multer');
const tesseract = require('tesseract.js');
const EnergyData = require('../models/energyData.models.js');
import asyncHandler from "../utils/asyncHandler.js";


const upload = multer({ dest: 'uploads/' });

const getEnergyData = asyncHandler(async (req, res) => {
    try {
      const data = await EnergyData.find({ user: req.user.id });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

const logEnergydata = asyncHandler(async (req, res) => {
    const { month, year } = req.body;
  
    try {
      // Perform OCR on the uploaded image
      const { data: { text } } = await tesseract.recognize(req.file.path);
      console.log('OCR Result:', text);
      const currentUsage = parseFloat(text.match(/\d+/)[0]); // Extract the first number from the text
  
      // Find the latest entry for this user
      const latestEntry = await EnergyData.findOne({ user: req.user.id }).sort({ year: -1, month: -1 });
  
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
        user: req.user.id,
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
  

export {getEnergyData, logEnergydata};