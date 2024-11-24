const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Client } = require('@opensearch-project/opensearch');
const dotenv = require('dotenv');
// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();

const router = express.Router();

const os_node = process.env.OPENSEARCH_NODE;
const os_usr = process.env.OPENSEARCH_USERNAME;
const os_pswd = process.env.OPENSEARCH_PASSWORD;
const os_index = process.env.OPENSEARCH_INDEX;
const user_index = process.env.USER_INDEX
const target_domain = process.env.JWT_TARGET_DOMAIN;

const access_token_expiration = process.env.JWT_ACCESS_TOKEN_EXPIRATION;
const refresh_token_expiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION;

if (!os_node) {
  throw new Error('Missing OpenSearch node configuration');
}

const client = new Client({
  node: os_node,
  auth: {
    username: os_usr,
    password: os_pswd,
  },
  ssl: {
    rejectUnauthorized: false, // Use this only if you encounter SSL certificate issues
  },
});

const FRONTEND_URL = process.env.REACT_FRONTEND_URL;
const BACKEND_URL = process.env.REACT_DATABASE_BACKEND_URL;

// Function to retrieve the role from the "user_dev" index
const getUserRole = async (user_id) => {
  const openid = encodeURIComponent(user_id);

  const response = await fetch(`${BACKEND_URL}/api/users/${openid}/role`);

  if (!response.ok) {
    return 10;
  }

  const result = await response.json();
  return result.role;
};


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
  return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: access_token_expiration });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: refresh_token_expiration });
};

router.get('/login', function (req, res, next) {
  console.log('-----------------------------');
  console.log('/Start login handler');
  next();
}, passport.authenticate('oidc', {
  scope: "openid profile email org.cilogon.userinfo",
  initialidp: "urn:mace:incommon:uiuc.edu"
}));

router.get('/cilogon-callback', async (req, res, next) => {
  passport.authenticate('oidc', async (err, user, info) => {
    if (err) {
      console.log('-----------------------------');
      console.log("Error: ", new Date());
      console.log("User: ", user);
      console.log(err);
      return res.redirect(`/error`);
    }
    if (!user) {
      return res.redirect(`/nouser`);
    }
    req.logIn(user, async function (err) {
      if (err) {
        console.log('-----------------------------');
        console.log("Error login: ", new Date());
        console.log("User: ", user);
        console.log(err);
        return res.redirect(`/errorlogin`);
      }

      // Retrieve user role from OpenSearch
      const role = await getUserRole(user.sub);
      console.log('user: ', user.sub, ' role: ', role);

      // Generate JWT token with role
      const userPayload = { id: user.sub, role };

      // Generate tokens
      const accessToken = generateAccessToken(userPayload);
      const refreshToken = generateRefreshToken(userPayload);

      // Save refresh token in OpenSearch
      await storeRefreshToken(client, refreshToken, user.sub);

      // Set the tokens in cookies
      res.cookie(process.env.JWT_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', domain: target_domain, path: '/' });
      res.cookie(process.env.JWT_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', domain: target_domain, path: '/' });
      res.cookie('IGPAU', true, { path: "/" });

      res.redirect(`${FRONTEND_URL}/user-profile`);
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  res.clearCookie(process.env.JWT_ACCESS_TOKEN_NAME, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', domain: target_domain, path: '/' });
  res.clearCookie(process.env.JWT_REFRESH_TOKEN_NAME, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', domain: target_domain, path: '/' });
  res.clearCookie('IGPAU', true, { path: "/" });

  req.session.destroy(function (err) {
    res.redirect("back")
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

    res.end(user_info);
  } else {
    const no_user_info = JSON.stringify({
      userInfo: null
    });

    console.log('No users');
    res.end(JSON.stringify(no_user_info));
  }
});

router.get("/error", (req, res) => {
  res.send("<p>We couldn't authenticate you due to an issue from CILogon</p>");
});

router.get("/nouser", (req, res) => {
  res.send("<p>We couldn't proceed because CILogon didn't return a valid user.</p>");
});

router.get("/errorlogin", (req, res) => {
  res.send("<p>We are having trouble logging you in.</p>");
});

module.exports = router;

