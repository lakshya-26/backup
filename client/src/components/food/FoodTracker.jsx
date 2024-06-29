import React, { useState, useEffect } from 'react';
import FoodInputForm from './FoodInputForm';
import axios from 'axios';

const FoodTracker = () => {
  const [meals, setMeals] = useState({
    breakfast: null,
    lunch: null,
    eveningSnack: null,
    dinner: null,
  });
  const [dailyCarbonFootprint, setDailyCarbonFootprint] = useState(0);
  const [foodLogs, setFoodLogs] = useState([]);
  const [historicalFootprints, setHistoricalFootprints] = useState([]);

  useEffect(() => {
    // Fetch daily food logs on component mount
    const fetchDailyLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/food/logs'); // Adjust endpoint as needed
        const logs = response.data;
        setFoodLogs(logs);

        const calculatedMeals = {};
        let totalFootprint = 0;

        logs.forEach(log => {
          calculatedMeals[log.meal] = log.carbonFootprint;
          totalFootprint += log.carbonFootprint;
        });

        setMeals(calculatedMeals);
        setDailyCarbonFootprint(totalFootprint);
      } catch (error) {
        console.error('Error fetching daily logs:', error);
      }
    };

    // Fetch historical carbon footprints
    const fetchHistoricalFootprints = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/food/daily-footprints'); // Adjust endpoint as needed
        setHistoricalFootprints(response.data);
      } catch (error) {
        console.error('Error fetching historical footprints:', error);
      }
    };

    fetchDailyLogs();
    fetchHistoricalFootprints();

    // Timer to reset meals and daily carbon footprint at midnight
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // Save the current day's footprint before resetting
        const saveDailyFootprint = async () => {
          try {
            await axios.post('http://localhost:3000/api/v1/food/daily-footprints', {
              userId: userId, // Pass the appropriate user ID
              date: new Date().toISOString().split('T')[0], // Current date
              totalCarbonFootprint: dailyCarbonFootprint,
            });

            setMeals({ breakfast: null, lunch: null, eveningSnack: null, dinner: null });
            setDailyCarbonFootprint(0);
            setFoodLogs([]);

            // Fetch updated historical footprints
            fetchHistoricalFootprints();
          } catch (error) {
            console.error('Error saving daily footprint:', error);
          }
        };

        saveDailyFootprint();
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  const handleMealSubmit = async (meal, carbonFootprint) => {
    try {
      // Send food log to backend
      const response = await axios.post('http://localhost:3000/api/v1/food/log', { meal, carbonFootprint });
      console.log(response.data); // Optional: Handle success message or update state

      // Update state with logged meal and carbon footprint
      const updatedMeals = { ...meals, [meal]: carbonFootprint };
      const updatedDailyFootprint = dailyCarbonFootprint + carbonFootprint;

      setMeals(updatedMeals);
      setDailyCarbonFootprint(updatedDailyFootprint);
      setFoodLogs(prevLogs => [...prevLogs, { meal, carbonFootprint }]);
    } catch (error) {
      console.error('Error logging meal:', error);
      // Optional: Handle error messages or notify user
    }
  };

  return (
    <div>
      <h1>Food Consumption Tracker</h1>
      <FoodInputForm onMealSubmit={handleMealSubmit} meals={meals} />
      <div>
        <h2>Daily Carbon Footprint</h2>
        <p>Total: {dailyCarbonFootprint.toFixed(2)} kg CO2e</p>
        <h3>Meal Breakdown:</h3>
        <ul>
          {foodLogs.map((log, index) => (
            <li key={index}>
              {log.meal.charAt(0).toUpperCase() + log.meal.slice(1)}: {log.carbonFootprint.toFixed(2)} kg CO2e
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Historical Carbon Footprints</h2>
        <ul>
          {historicalFootprints.map((footprint, index) => (
            <li key={index}>
              Date: {footprint.date}, Total: {footprint.totalCarbonFootprint.toFixed(2)} kg CO2e
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FoodTracker;
