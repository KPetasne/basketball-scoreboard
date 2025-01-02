require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();

const auth0Strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: '/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
});

passport.use(auth0Strategy);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function(req, res) {
res.redirect('/');
});

app.get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout();
res.redirect('/');
});

app.get('/', (req, res) => {
    res.send(req.user ? `Hello, ${req.user.displayName}` : 'Hello, World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
