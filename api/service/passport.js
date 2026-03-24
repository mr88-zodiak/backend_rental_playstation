const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/Users");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await Users.query().where("email", email).first();

        if (!user) {
          // Jika belum ada, buat user baru sebagai 'buyer'
          user = await Users.query().insert({
            username: profile.displayName.replace(/\s/g, "").toLowerCase(),
            name: profile.displayName,
            email: email,
            role: "buyer",
            google_id: profile.id, // Simpan ID Google untuk jaga-jaga
            avatar: profile.photos[0].value, // Ambil foto profil Google
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
