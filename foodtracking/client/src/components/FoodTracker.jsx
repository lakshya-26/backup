import React, { useState, useEffect } from 'react';
import FoodInputForm from './FoodInputForm';

const FoodTracker = () => {
  const [meals, setMeals] = useState({
    breakfast: null,
    lunch: null,
    eveningSnack: null,
    dinner: null,
  });
  const [dailyCarbonFootprint, setDailyCarbonFootprint] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setMeals({ breakfast: null, lunch: null, eveningSnack: null, dinner: null });
        setDailyCarbonFootprint(0);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleMealSubmit = (meal, carbonFootprint) => {
    setMeals(prevMeals => ({ ...prevMeals, [meal]: carbonFootprint }));
    setDailyCarbonFootprint(prevFootprint => prevFootprint + carbonFootprint);
  };

  return (
    <div>
      <h1>Food Consumption Tracker</h1>
      <FoodInputForm onMealSubmit={handleMealSubmit} meals={meals} />
      <div>
        <h2>Daily Carbon Footprint</h2>
        <p>Total: {dailyCarbonFootprint.toFixed(2)} kg CO2e</p>
      </div>
    </div>
  );
};

export default FoodTracker;
