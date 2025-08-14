const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('passport')
const authRoute = require('./routes')
const http = require("http");
require('dotenv').config({ quiet: true });
const { Issuer, Strategy } = require('openid-client');
const { logger, httpLogger } = require("./logger.js");

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

const USE_HTTP_LOGGER = process.env.USE_HTTP_LOGGER === "true";

const app = express();

// Use Pino HTTP middleware
if (USE_HTTP_LOGGER) {
  app.use(httpLogger);
}

app.use(cors({ credentials: true, origin: FRONTEND_URL }));

app.use(cookieParser());
app.use(express.urlencoded({
  extended: true,
}));

app.set('trust proxy', 1);

app.use(express.json({ limit: '15mb' }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.ENV === 'prod' || process.env.ENV === 'production'
  }
}));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoute)

passport.serializeUser(function (user, done) {
  logger.debug({
    event: "Serializing user",
    user: {
      sub: user?.sub,
      idp_name: user?.["idp_name"],
      email_exists: user?.email && typeof user?.email === "string",
      first_name_exists: user?.["given_name"] && typeof user?.["given_name"] === "string",
      last_name: user?.["family_name"]
    },
  });
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  logger.debug({
    event: "Deserializing user",
    user: {
      sub: user?.sub
    }
  });
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
      req.session.tokenSet = tokenSet;
      req.session.userinfo = userinfo;
      return done(null, tokenSet.claims());
    })
  );
});

const httpServer = http.createServer(app);
httpServer.listen(3000, "0.0.0.0", () => {
  logger.info("Authentication server running on port 3000");
});
