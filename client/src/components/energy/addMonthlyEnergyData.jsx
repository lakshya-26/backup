import React, { useState } from 'react';
import { createEnergyData } from './api,jsx';

const AddMonthlyEnergyData = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [usage, setUsage] = useState('');
  const [generated, setGenerated] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEnergyData({ month, year, usage, generated });
      setMonth('');
      setYear('');
      setUsage('');
      setGenerated('');
      alert('Data added successfully');
    } catch (error) {
      alert('Error adding data');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Month:</label>
        <input type="text" value={month} onChange={(e) => setMonth(e.target.value)} required />
      </div>
      <div>
        <label>Year:</label>
        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
      </div>
      <div>
        <label>Usage (kWh):</label>
        <input type="number" value={usage} onChange={(e) => setUsage(e.target.value)} required />
      </div>
      <div>
        <label>Generated (kWh):</label>
        <input type="number" value={generated} onChange={(e) => setGenerated(e.target.value)} required />
      </div>
      <button type="submit">Add Data</button>
    </form>
  );
};

export default AddMonthlyEnergyData;
