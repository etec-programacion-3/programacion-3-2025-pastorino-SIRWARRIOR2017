require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar usuario por googleId
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          // Verificar si el usuario está bloqueado
          if (user.isBlocked) {
            return done(null, false, {
              message: 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
              reason: user.blockedReason
            });
          }
          // Usuario ya existe, devolver usuario
          return done(null, user);
        }

        // Verificar si existe un usuario con el mismo email
        user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          // Verificar si el usuario está bloqueado
          if (user.isBlocked) {
            return done(null, false, {
              message: 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
              reason: user.blockedReason
            });
          }
          // Usuario existe con ese email, vincular cuenta de Google
          user.googleId = profile.id;
          user.picture = profile.photos[0]?.value;
          user.isVerified = true;
          await user.save();
          return done(null, user);
        }

        // Crear nuevo usuario
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0]?.value,
          isVerified: true,
          role: 'customer',
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Error en Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
