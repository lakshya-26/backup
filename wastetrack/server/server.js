const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const wasteRoutes = require('./routes/waste');
const schedule = require('node-schedule');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Built-in body parser in express

app.use(cors());
// Connect to the database
connectDB()
    .then(() => {
        console.log('Database connected successfully');

        // Routes
        app.use('/api/waste', wasteRoutes);

        // Schedule data fetch
        const userId = 'USER_ID'; // Replace with actual user ID
        schedule.scheduleJob('0 0 * * *', () => { // Run daily at midnight
            fetchSmartMeterData(userId);
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
