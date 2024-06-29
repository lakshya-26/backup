import React, { useState } from 'react';
import axios from 'axios';

const TransportationTracker = () => {
  const [mode, setMode] = useState('');
  const [model, setModel] = useState('');
  const [mileage, setMileage] = useState('');
  const [startLocation, setStartLocation] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);

  const startTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setStartLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        axios.post('http://localhost:3000/api/v1/transport/start-tracking', {
          mode,
          model,
          mileage,
          startLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }, { withCredentials: true })
        .then(response => {
          setTripId(response.data.data.tripId);
          alert('Trip started');
        })
        .catch(error => {
          console.error('Error starting trip:', error);
          alert('Error starting trip');
        });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const endTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setEndLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        axios.post('http://localhost:3000/api/v1/transport/end-tracking', {
          tripId,
          endLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }, { withCredentials: true })
        .then(response => {
          setTripDetails(response.data.data);
          alert('Trip ended');
        })
        .catch(error => {
          console.error('Error ending trip:', error);
          alert('Error ending trip');
        });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <h1>Transportation Tracker</h1>
      <div>
        <label>
          Mode of Transport:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="">Select Mode</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="bicycle">Bicycle</option>
            <option value="walking">Walking</option>
          </select>
        </label>
      </div>
      {mode === 'car' || mode === 'bike' ? (
        <div>
          <label>
            Vehicle Model:
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </label>
          <label>
            Mileage (km/l):
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </label>
        </div>
      ) : null}
      <button onClick={startTracking} disabled={!mode || (mode !== 'bicycle' && mode !== 'walking' && (!model || !mileage))}>
        Start Tracking
      </button>
      {tripId && (
        <button onClick={endTracking}>
          End Tracking
        </button>
      )}
      {tripDetails && (
        <div>
          <h2>Trip Details</h2>
          <p>Mode: {tripDetails.mode}</p>
          <p>Model: {tripDetails.model}</p>
          <p>Mileage: {tripDetails.mileage}</p>
          <p>Distance: {tripDetails.distance.toFixed(2)} km</p>
          <p>Fuel Consumed: {tripDetails.fuelConsumed.toFixed(2)} liters</p>
          <p>Carbon Footprint: {tripDetails.carbonFootprint.toFixed(2)} kg CO2e</p>
        </div>
      )}
    </div>
  );
};

export default TransportationTracker;
