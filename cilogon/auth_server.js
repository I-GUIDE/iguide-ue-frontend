const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('passport')
const authRoute = require('./routes')
const http = require("http");
const https = require('https');
const router = require("express").Router();
const fs = require('fs');
require('dotenv').config();
const { Issuer, Strategy } = require('openid-client');

const credentials = {
  key: fs.readFileSync('credentials/privkey.pem'),
  cert: fs.readFileSync('credentials/fullchain.pem')
};

const app = express();

// React frontend URL
const FRONTEND_URL = process.env.REACT_FRONTEND_URL;
// CILogon discovery endpoint (https://www.cilogon.org/oidc)
const DISCOVERY_URL = process.env.REACT_APP_AUTH_DISCOVERY_URL;
// CILogon client ID (provided during the CILogon registration)
const CLIENT_ID = process.env.REACT_APP_IDENTITY_CLIENT_ID;
// CILogon client secret (provided during the CILogon registration)
const CLIENT_SECRET = process.env.REACT_APP_IDENTITY_CLIENT_SECRET;
// Redirect URL (specified during the CILogon registration)
const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;

app.use(cors({ credentials: true, origin: FRONTEND_URL }));

app.use(cookieParser());
app.use(express.urlencoded({
  extended: true,
}));


app.use(express.json({ limit: '15mb' }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoute)

passport.serializeUser(function (user, done) {
  console.log('-----------------------------');
  console.log('serialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log('-----------------------------');
  console.log('deserialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});

Issuer.discover(DISCOVERY_URL).then(function (oidcIssuer) {
  var client = new oidcIssuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [REDIRECT_URL],
    response_types: ['code'],
    scope: 'openid profile email org.cilogon.userinfo',
  });

  passport.use(
    'oidc',
    new Strategy({ client, passReqToCallback: true, loadUserInfo: true, }, (req, tokenSet, userinfo, done) => {
      console.log("tokenSet", tokenSet);
      console.log("userinfo", userinfo);
      req.session.tokenSet = tokenSet;
      req.session.userinfo = userinfo;
      return done(null, tokenSet.claims());
    })
  );
});

// const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// httpServer.listen(80, () => {
//   console.log(`Http Server Running on port 80`)
// });

httpsServer.listen(8443, () => {
  console.log(`Https Server Running on port 8443`)
});
