const express = require('express');
const cors = require('cors');
const passport = require('../auth/passport.js');
const session = require("express-session");

const { saveItinerary, saveActivities, loadItineraryWithActivities, deleteActivity, deleteItinerary, User } = require('./db');

require('dotenv').config();
//Next two lines are for user routes
const {body, validationResult} = require('express-validator');
const factoryResponse = require("../auth/middleware.js");

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());
//For Authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

//POST for /register
//! Won't actually use this for now, as Passport handles it for Google OAuth
app.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required.'),
        body('googleId').notEmpty().withMessage('Google ID is required.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, googleId } = req.body;
        try {
            const newUser = await User.create({ username, googleId });
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'Google ID username already exists.' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
);

//GET for logout using Passport
app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      res.json(factoryResponse(500, "Logout failed"));
      return;
    }
    res.json(factoryResponse(200, "Logout successful"));
  });
});

//GETs for Google Authentication
const googleAuthCallback = (req, res) => {
  res.redirect("/");
};
app.get (
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get( 
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthCallback
)

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

app.post('/saveActivites', async (req, res) => {
  const body = req.body
  // WARNING: I do not know how the fetch method is structured so this may blow up
  const data = JSON.parse(body)
  try {
    await saveActivities(data)
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
