import React from 'react';
import UploadEnergyData from './components/UploadEnergyData';
import MonthlyEnergyDataList from './components/MonthlyEnergyDataList';

const App = () => {
    return (
        <div>
            <h1>Energy Tracker</h1>
            <UploadEnergyData />
            <MonthlyEnergyDataList />
        </div>
    );
};

export default App;
