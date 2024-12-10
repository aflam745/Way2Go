const express = require('express');
const cors = require('cors');
const { saveActivities } = require('./db');
const passport = require('../passport.js');
const session = require("express-session");
require('dotenv').config();
//Next two lines are for user routes
const {body, validationRes} = require('express-validator');
const User = require('../models/user.js');

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

app.post('/optimize', async(req, res) => {
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
app.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required.'),
        body('googleId').notEmpty().withMessage('Google ID is required.'),
    ],
    async (req, res) => {
        const errors = validationRes(req);
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

//GET for logout
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
  const data = JSON.parse(body.data)
  try {
    await saveItinerary(data)
    res.sendStatus(200)
    return
  } catch (error) {
    res.sendStatus(404)
    return
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
