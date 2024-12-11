const express = require('express');
const cors = require('cors');

const { saveItinerary, saveActivities, loadItineraryWithActivities, deleteActivity, deleteItinerary } = require('./db');

require('dotenv').config();

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/getDirections', async (req, res) => {
    const body = req.body;
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/${body.transportation}/geojson`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': process.env.ORS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coordinates: body.coordinates,
            geometry: 'true',
        })
    });

    const data = await response.json();
    res.json({ data });

});

app.post('/optimize', async (req, res) => {
    const body = req.body;
    const response = await fetch(`https://api.openrouteservice.org/optimization`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': process.env.ORS_API_KEY,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    res.json({ data });
})

app.get('/loadItinerary', async (req, res) => {
    const body = req.body
    const id = JSON.parse(body)
    try {
        const result = await loadItinerary(id)
        res.set('Content-Type: application/json')
        res.send(result)
        return
    } catch (error) {
        res.sendStatus(404)
        return
    }
})

app.post('/saveItinerary', async (req, res) => {
  const body = req.body
  try {
    await saveItinerary(body)
    res.sendStatus(200)
    return
  } catch (error) {
    console.log(error);
    res.sendStatus(404)
    return
  }
})

app.get('/loadCompleteItinerary/:id', async (req, res) => {
  const id = req.params.id
  try {
    const out = await loadItineraryWithActivities(id)
    res.json(out)
  } catch (error) {
    res.sendStatus(404)
  }
})

app.post('/saveActivities', async (req, res) => {
    console.log(req);
  const body = req.body
  console.log("body", body);
  // WARNING: I do not know how the fetch method is structured so this may blow up
//   const data = JSON.parse(body)
  try {
    await saveActivities(body)
    res.sendStatus(200)
    return
  } catch (error) {
    res.sendStatus(404)
    return
  }
})

app.delete('/deleteActivity/:id', async (req, res) => {
  const activityId = req.params.id;

  try {
    const deleted = await deleteActivity(activityId);
    if(deleted) {
      res.status(200).json({ message: 'Activity deleted successfully' });
    } else {
      res.status(404).json({ message: 'Activity not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the activity.'})
  }
})

app.delete('/deleteItinerary/:id', async (req, res) => {
  const itineraryId = req.params.id;

  try {
    const deleted = await deleteItinerary(itineraryId);
    if(deleted) {
      res.status(200).json({ message: 'Itinerary deleted successfully' });
    } else {
      res.status(404).json({ message: 'Itinerary not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the itinerary.'})
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
