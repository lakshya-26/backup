const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');



const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let trips = {};

function calculateDistance(start, end) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (end.latitude - start.latitude) * (Math.PI / 180);
  const dLon = (end.longitude - start.longitude) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.latitude * (Math.PI / 180)) *
    Math.cos(end.latitude * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}


app.post('/api/start-tracking', (req, res) => {
  const { mode, model, mileage, startLocation } = req.body;

  if (!mode || !startLocation) {
    return res.status(400).json({ error: 'Mode and start location are required' });
  }

  const tripId = uuidv4();
  trips[tripId] = {
    mode,
    model,
    mileage,
    startLocation,
    endLocation: null,
    distance: null,
    fuelConsumed: null,
    carbonFootprint: null,
  };

  res.json({ tripId });
});


app.post('/api/end-tracking', (req, res) => {
  const { tripId, endLocation } = req.body;

  if (!tripId || !endLocation || !trips[tripId]) {
    return res.status(400).json({ error: 'Invalid trip ID or end location' });
  }

  const trip = trips[tripId];
  trip.endLocation = endLocation;
  trip.distance = calculateDistance(trip.startLocation, trip.endLocation);

  if (trip.mode === 'car' || trip.mode === 'bike') {
    const mileage = parseFloat(trip.mileage);
    if (!isNaN(mileage) && mileage > 0) {
      trip.fuelConsumed = trip.distance / mileage;
      trip.carbonFootprint = trip.fuelConsumed * 2.31; // Assuming 2.31 kg CO2 per liter of gasoline
    } else {
      return res.status(400).json({ error: 'Invalid mileage provided' });
    }
  } else {
    trip.fuelConsumed = 0;
    trip.carbonFootprint = 0;
  }

  res.json({ tripDetails: trip });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
