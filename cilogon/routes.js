const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Client } = require('@opensearch-project/opensearch');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const os_node = process.env.OPENSEARCH_NODE;
const os_usr = process.env.OPENSEARCH_USERNAME;
const os_pswd = process.env.OPENSEARCH_PASSWORD;
const os_index = process.env.OPENSEARCH_INDEX;
const user_index = process.env.USER_INDEX
const target_domain = process.env.JWT_TARGET_DOMAIN;

console.log('OpenSearch Node:', os_node);
console.log('OpenSearch Username:', os_usr);
console.log('OpenSearch Password:', os_pswd);
console.log('OpenSearch Index:', os_index);
console.log('User Index: ', user_index);
console.log('Target JWT backend domain: ', target_domain);

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

// Function to retrieve the role from the "user_dev" index
const getUserRole = async (user_id) => {
  const openid = decodeURIComponent(user_id);

  try {
    const response = await client.search({
      index: user_index,
      body: {
        query: {
          term: {
            openid: openid
          }
        }
      }
    });

    if (response.body.hits.total.value === 0) {
      console.error('User not found');
      return null;
    }else{
      return response.body.hits.hits[0]._source.role;
    }
  } catch (error) {
    console.error('Error retrieving user role:', error);
    return null;
  }
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
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7m' });
};

router.get('/login', function (req, res, next) {
  console.log('-----------------------------');
  console.log('/Start login handler');
  next();
}, passport.authenticate('oidc', { scope: "openid profile email org.cilogon.userinfo",
initialidp: "urn:mace:incommon:uiuc.edu" }));

router.get('/cilogon-callback', async (req, res, next) => {
  passport.authenticate('oidc', async (err, user, info) => {
    if (err) {
      console.log(err);
      return res.redirect(`/error`);
    }
    if (!user){
      return res.redirect(`/nouser`);
    }
    req.logIn(user, async function (err) {
      if (err) {
        return res.redirect(`/errorlogin`);
      }

      // Retrieve user role from OpenSearch
      const role = await getUserRole(user.sub) || 'untrusted_user'; // Default to 'user' if role not found
      console.log('user role: ', role);

      // Generate JWT token with role
      const userPayload = { id: user.sub, role };

      // Generate tokens
      const accessToken = generateAccessToken(userPayload);
      const refreshToken = generateRefreshToken(userPayload);

      // Save refresh token in OpenSearch
      await storeRefreshToken(client, refreshToken, user.sub);

      // Set the tokens in cookies
      res.cookie('jwt', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite: 'Strict', domain: target_domain, path: '/'});
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', domain: target_domain, path: '/' });
      
      console.log("Setting cookies to: ", target_domain);

      res.redirect(`${FRONTEND_URL}/user-profile`);
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite: 'None', domain: target_domain, path: '/'});
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite: 'None', domain: target_domain, path: '/'});
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

