const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const Student = require("../models/StudentModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
      scope:["profile","email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await Student.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);
        const newUser = await Student.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          year: null,
          college: null,
          reg_no: null,
          coins: 0,
          outsider: false,
        });
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Student.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
