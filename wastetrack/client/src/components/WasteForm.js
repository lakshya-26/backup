import React, { useState } from 'react';
import { submitWasteData } from '../api/wasteapi';

const WasteForm = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Initialize with current date in YYYY-MM-DD format
        organic: 0,
        plastic: 0,
        paper: 0,
        metal: 0,
        glass: 0
    });
    const [carbonFootprint, setCarbonFootprint] = useState(0); // State to hold the calculated carbon footprint

    const { date, organic, plastic, paper, metal, glass } = formData;

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'date' ? value : parseFloat(value) });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitWasteData(formData);
            const calculatedCarbonFootprint = calculateCarbonFootprint(formData);
            setCarbonFootprint(calculatedCarbonFootprint); // Update state with calculated carbon footprint
            alert('Data submitted successfully');
        } catch (err) {
            alert('Error submitting data');
        }
    };

    // Function to calculate carbon footprint
    const calculateCarbonFootprint = (data) => {
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
        Object.keys(data).forEach(key => {
            if (key !== 'date') { // Skip 'date' field
                totalCarbonFootprint += data[key] * conversionFactors[key];
            }
        });

        return totalCarbonFootprint;
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={date} onChange={onChange} required />
                </div>
                <div>
                    <label>Organic Waste (kg):</label>
                    <input type="number" name="organic" value={organic} onChange={onChange} required min="0" />
                </div>
                <div>
                    <label>Plastic Waste (kg):</label>
                    <input type="number" name="plastic" value={plastic} onChange={onChange} required min="0" />
                </div>
                <div>
                    <label>Paper Waste (kg):</label>
                    <input type="number" name="paper" value={paper} onChange={onChange} required min="0" />
                </div>
                <div>
                    <label>Metal Waste (kg):</label>
                    <input type="number" name="metal" value={metal} onChange={onChange} required min="0" />
                </div>
                <div>
                    <label>Glass Waste (kg):</label>
                    <input type="number" name="glass" value={glass} onChange={onChange} required min="0" />
                </div>
                <button type="submit">Submit</button>
            </form>

            {/* Display calculated carbon footprint */}
            <div>
                <h2>Calculated Carbon Footprint:</h2>
                <p>{carbonFootprint.toFixed(2)} kg CO2e</p> {/* Display carbon footprint rounded to 2 decimal places */}
            </div>
        </div>
    );
};

export default WasteForm;
