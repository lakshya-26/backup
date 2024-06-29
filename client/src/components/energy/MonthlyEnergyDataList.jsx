import React, { useEffect, useState } from 'react';
import { fetchEnergyData } from './api.jsx';

const MonthlyEnergyDataList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchEnergyData();
        setData(result);
      } catch (error) {
        alert('Error fetching data');
      }
    };
    getData();
  }, []);

  return (
    <div>
      <h2>Monthly Energy Data</h2>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            {item.month}/{item.year}: Usage - {item.usage} kWh, Generated - {item.generated} kWh, Difference - {item.difference} kWh
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyEnergyDataList;
