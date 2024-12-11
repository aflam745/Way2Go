const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const dotenv = require("dotenv");
const User = require("../server/db.js");

// Load environment variables from a .env file
dotenv.config();

// Google OAuth Strategy
// This strategy is used to authenticate users using their Google account.
// It requires a client ID and a client secret, which can be obtained by
// creating a new project in the Google Developers Console.
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ where: { googleId: profile.id } });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
        });
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

module.exports = passport