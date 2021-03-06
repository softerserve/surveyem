const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
})

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true
		},
		async (accessToken, refreshToken, profile, done) => {
			const existingUser = await User.findOne({ googleID: profile.id });
			if (existingUser) { 
				// User already exists so don't add new user record
				return done(null, existingUser);
			} 
			console.log('access token', accessToken);
			console.log('refresh token', refreshToken);
			console.log('profile:', profile);
			const user = await new User({ googleID: profile.id }).save();
			done(null, user);
		}
	)
);