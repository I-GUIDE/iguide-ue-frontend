const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Client } = require('@opensearch-project/opensearch');
require('dotenv').config();

const os_node = process.env.OPENSEARCH_NODE;
const os_usr = process.env.OPENSEARCH_USERNAME;
const os_pswd = process.env.OPENSEARCH_PASSWORD;
const os_index = process.env.OPENSEARCH_INDEX;

const client = new Client({
  node: os_node, // OpenSearch endpoint
  auth: {
    username: os_usr,
    password: os_pswd,
  },
  ssl: {
    rejectUnauthorized: false, // Use this only if you encounter SSL certificate issues
  },
});

const FRONTEND_URL = process.env.REACT_FRONTEND_URL;

// Store refresh token in OpenSearch
const storeRefreshToken = async (client, token, user_id) => {
  await client.index({
    index: os_index,
    body: {
      token,
      user_id,
      created_at: new Date()
    }
  });
};

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7m' });
};

router.get('/login', function (req, res, next) {
  console.log('-----------------------------');
  console.log('/Start login handler');
  next();
}, passport.authenticate('oidc', { scope: "openid profile email org.cilogon.userinfo" }));

router.get('/cilogon-callback', async (req, res, next) => {
  passport.authenticate('oidc', async (err, user, info) => {
    if (err || !user) {
      return res.redirect(`/`);
    }
    req.logIn(user, async function (err) {
      if (err) {
        return res.redirect(`/`);
      }
      // Generate JWT token with role
      const userPayload = { id: user.sub, role: 'user' }; // Determine role dynamically as needed

      // Generate tokens
      const accessToken = generateAccessToken(userPayload);
      const refreshToken = generateRefreshToken(userPayload);

      // Save refresh token in OpenSearch
      await storeRefreshToken(client, refreshToken, user.sub);

      // Set the tokens in cookies
      res.cookie('jwt', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      res.redirect(`${FRONTEND_URL}/user-profile`);
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  res.clearCookie('jwt');
  res.clearCookie('refreshToken');
  req.session.destroy(function (err) {
    res.redirect(FRONTEND_URL);
  });
});

router.get("/", (req, res) => {
  res.send(" <a href='/login'>Log In with OAuth 2.0 Provider </a>");
});

router.get("/auth-validation", function (req, res) {
  res.header("Content-Type", 'application/json');
  if (req.isAuthenticated()) {
    res.end(JSON.stringify({ isAuthenticated: true }));
  } else {
    res.end(JSON.stringify({ isAuthenticated: false }));
  }
});

router.get("/userinfo", (req, res) => {
  res.header("Content-Type", 'application/json');
  if (req.session.passport) {
    const sub = req.session.passport.user.sub ? req.session.passport.user.sub : null;
    const given_name = req.session.passport.user.given_name ? req.session.passport.user.given_name : null;
    const family_name = req.session.passport.user.family_name ? req.session.passport.user.family_name : null;
    const idp_name = req.session.passport.user.idp_name ? req.session.passport.user.idp_name : null;
    const email = req.session.passport.user.email ? req.session.passport.user.email : null;
    const iss = req.session.passport.user.iss ? req.session.passport.user.iss : null;

    const user_info = JSON.stringify({
      userInfo: {
        "sub": sub,
        "given_name": given_name,
        "family_name": family_name,
        "idp_name": idp_name,
        "email": email,
        "iss": iss,
      }
    });

    console.log('req passport', req.session.passport);
    res.end(user_info);
  } else {
    const no_user_info = JSON.stringify({
      userInfo: null
    });

    console.log('No users');
    res.end(JSON.stringify(no_user_info));
  }
});

module.exports = router;

