const mongoose = require('mongoose');
const Waste = require('./models/Waste');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecosynergy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Function to generate random userId (for demonstration purposes)
function generateRandomUserId() {
    const userIds = [
        '5ff4d5b8b483035b362b71b2',
        '5ff4d5b8b483035b362b71b3',
        '5ff4d5b8b483035b362b71b4'
        // Add more userIds if needed
    ];
    return userIds[Math.floor(Math.random() * userIds.length)];
}

// Function to generate random waste amounts
function generateRandomWasteAmounts() {
    return {
        organic: Math.floor(Math.random() * 10) + 1,
        plastic: Math.floor(Math.random() * 10) + 1,
        paper: Math.floor(Math.random() * 10) + 1,
        metal: Math.floor(Math.random() * 10) + 1,
        glass: Math.floor(Math.random() * 10) + 1,
    };
}

// Function to calculate carbon footprint based on waste amounts
function calculateCarbonFootprint(wasteAmounts) {
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
    Object.keys(wasteAmounts).forEach(key => {
        totalCarbonFootprint += wasteAmounts[key] * conversionFactors[key];
    });

    return totalCarbonFootprint;
}

// Function to generate a random date (within the last 30 days)
function generateRandomDate() {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = new Date();
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

// Function to generate 500 random waste entries
async function generateData() {
    try {
        // Clear existing data
        await Waste.deleteMany();

        // Generate and insert 500 random data entries with calculated carbon footprint
        const data = [];
        for (let i = 0; i < 500; i++) {
            const wasteAmounts = generateRandomWasteAmounts();
            const carbonFootprint = calculateCarbonFootprint(wasteAmounts);
            const newEntry = {
                userId: generateRandomUserId(),
                date: generateRandomDate(),
                ...wasteAmounts,
                carbonFootprint: carbonFootprint.toFixed(2) // Store carbon footprint rounded to 2 decimal places
            };
            data.push(newEntry);
        }

        await Waste.insertMany(data);
        console.log('Generated 500 data entries successfully');
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect();
    }
}

generateData();
