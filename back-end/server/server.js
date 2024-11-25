const express = require('express');
const cors = require('cors');
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
