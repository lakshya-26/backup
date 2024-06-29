import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const FoodInputForm = ({ onMealSubmit, meals }) => {
  const [meal, setMeal] = useState('');
  const [foods, setFoods] = useState([{ name: '', quantity: '' }]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Fetch common food items from backend
    axios.get('http://localhost:3000/api/v1/food/items')
      .then(response => {
        const foodData = response.data;
        const options = foodData.map(food => ({
          label: `${food.name.charAt(0).toUpperCase() + food.name.slice(1)} (1 serving: ${food.servingSize})`,
          value: food.name,
          co2: food.co2,
        }));
        setFoodOptions(options);
      })
      .catch(error => {
        console.error('Error fetching food data:', error);
      });
  }, []);

  const handleFoodChange = (index, selectedOption) => {
    const values = [...foods];
    values[index].name = selectedOption ? selectedOption.value : '';
    values[index].co2 = selectedOption ? selectedOption.co2 : 0;
    setFoods(values);
  };

  const handleQuantityChange = (index, event) => {
    const values = [...foods];
    values[index].quantity = event.target.value;
    setFoods(values);
  };

  const handleAddFood = () => {
    setFoods([...foods, { name: '', quantity: '' }]);
  };

  const validateForm = () => {
    const newErrors = [];
    foods.forEach((food, index) => {
      if (!food.name || !foodOptions.find(option => option.value === food.name)) {
        newErrors[index] = { ...newErrors[index], name: 'Item not found' };
      }
      if (isNaN(food.quantity) || food.quantity <= 0) {
        newErrors[index] = { ...newErrors[index], quantity: 'Invalid quantity' };
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const carbonFootprint = foods.reduce((total, food) => {
        const quantity = parseFloat(food.quantity);
        const co2Equivalent = food.co2;
        total += (quantity / 1000) * co2Equivalent; // Convert g to kg
        return total;
      }, 0);

      onMealSubmit(meal, carbonFootprint);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="meal">Meal</label>
        <select
          id="meal"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          required
        >
          {['breakfast', 'lunch', 'evening snack', 'dinner'].map(mealOption => (
            <option key={mealOption} value={mealOption} disabled={meals[mealOption]}>
              {mealOption}
            </option>
          ))}
        </select>
      </div>
      {foods.map((food, index) => (
        <div key={index}>
          <Select
            options={foodOptions}
            onChange={(selectedOption) => handleFoodChange(index, selectedOption)}
            value={foodOptions.find(option => option.value === food.name)}
            placeholder="Select food item"
          />
          <input
            type="text"
            placeholder="Quantity (g)"
            value={food.quantity}
            onChange={(e) => handleQuantityChange(index, e)}
          />
          {errors[index] && errors[index].name && <span style={{ color: 'red' }}>{errors[index].name}</span>}
          {errors[index] && errors[index].quantity && <span style={{ color: 'red' }}>{errors[index].quantity}</span>}
        </div>
      ))}
      <button type="button" onClick={handleAddFood}>Add Food</button>
      <button type="submit" disabled={foods.some(food => !food.name || !food.quantity)}>Log Meal</button>
    </form>
  );
};

export default FoodInputForm;
