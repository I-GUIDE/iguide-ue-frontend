const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Client } = require("@opensearch-project/opensearch");
const multer = require("multer");
const { createReadStream, unlinkSync, existsSync } = require("fs");
const { WebClient } = require("@slack/web-api");
const path = require("path");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { logger } = require("./logger.js");
const { addUser, checkUser } = require("./user_management.js");

dotenv.config();

const router = express.Router();

const os_node = process.env.OPENSEARCH_NODE;
const os_usr = process.env.OPENSEARCH_USERNAME;
const os_pswd = process.env.OPENSEARCH_PASSWORD;
const os_index = process.env.OPENSEARCH_INDEX;
const user_index = process.env.USER_INDEX;
const target_domain = process.env.JWT_TARGET_DOMAIN;

const access_token_expiration = process.env.JWT_ACCESS_TOKEN_EXPIRATION;
const refresh_token_expiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION;

const cookie_suffix = process.env.COOKIE_SUFFIX;
const jwt_access_token_name = "jwt-access-token-" + cookie_suffix;
const jwt_refresh_token_name = "jwt-refresh-token-" + cookie_suffix;
const jwt_tokens_exist_name = "iguide-jwt-tokens-exist-" + cookie_suffix;

const slack_channel_id = process.env.SLACK_CHANNEL_ID;
const slack_api_token = process.env.SLACK_API_TOKEN;

const recaptcha_secret_key = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

const web = new WebClient(slack_api_token);

const redirect_whitelist_filename = "./redirect-whitelist.json";

let redirect_whitelist = []
// If the JSON file exists, use the whitelist
if (existsSync(redirect_whitelist_filename)) {
  redirect_whitelist = require(redirect_whitelist_filename);
}

if (!os_node) {
  throw new Error("Missing OpenSearch node configuration");
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

// Get validated redirect full URL
function getValidatedRedirectFullURL(redirectDomainId, redirectPath, defaultRedirectURL = FRONTEND_URL) {
  // No redirectPath? redirect to defaultRedirectURL
  // No redirectDomainId? Use FRONTEND_URL (used by redirect within the platform)
  // Invalid redirectDoaminId? Use defaultRedirectURL

  // Fail-safe
  let redirectDomain = defaultRedirectURL;

  // If the redirectDomainId exists, find the domain
  if (redirectDomainId) {
    // Search the domain object from the whitelist
    const domainObject = redirect_whitelist.find(domain => domain.id === redirectDomainId);
    // If found, set redirect domain as what's found, otherwise redirect to the default
    if (domainObject) {
      redirectDomain = domainObject.domain;
    } else {
      logger.warn({
        type: "Invalid domain id",
        message: redirectDomainId
      });
      return defaultRedirectURL;
    }
  } else {
    // Otherwise, the redirectDomain will use the frontend URL
    redirectDomain = FRONTEND_URL;
  }

  // Check if redirectPath is a string, if not, return default URL
  if (!redirectPath || typeof redirectPath !== "string") {
    return defaultRedirectURL;
  }

  // Decode the path
  const decodedRedirectPath = decodeURIComponent(redirectPath);

  // Verify if the path is an absolute path, if not, use the default URL
  if (decodedRedirectPath.startsWith("/")) {
    return redirectDomain + decodedRedirectPath;
  } else {
    return defaultRedirectURL;
  }
}

// Function to retrieve the role from the "user_dev" index
async function getUserRole(userOpenId) {
  const encodedOpenId = encodeURIComponent(userOpenId);

  try {
    const response = await fetch(`${BACKEND_URL}/api/users/${encodedOpenId}/role`);
    if (!response.ok) {
      logger.error({
        type: "Couldn't fetch user role",
        user: {
          id: userOpenId,
        }
      });
      return 10;
    }
    const result = await response.json();
    return result.role;
  } catch (err) {
    logger.error({
      type: "Fetch user role failed",
      message: err,
      user: {
        id: userOpenId,
      }
    });
    return "ERROR";
  }
}

// Store refresh token in OpenSearch
async function storeRefreshToken(client, token, userOpenId) {
  await client.index({
    index: os_index,
    body: {
      token,
      userOpenId,
      created_at: new Date(),
    },
    refresh: 'wait_for',
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: access_token_expiration,
  });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: refresh_token_expiration,
  });
}

router.get(
  "/login",
  function (req, res, next) {
    const redirectDomainId = req.query["redirect-domain-id"];
    const redirectPath = req.query["redirect-path"];
    const redirectFullURL = getValidatedRedirectFullURL(redirectDomainId, redirectPath, `${FRONTEND_URL}/user-profile`);

    // Save the redirectFullURL to session
    req.session.redirectFullURL = redirectFullURL;

    next();
  },
  passport.authenticate("oidc", {
    scope: "openid profile email org.cilogon.userinfo",
    initialidp: "urn:mace:incommon:uiuc.edu",
  })
);

router.get("/cilogon-callback", async (req, res, next) => {
  // Retrieve the redirectURL from session, and then destory the session variable
  const redirectFullURL = req.session.redirectFullURL || `${FRONTEND_URL}/user-profile`;
  delete req.session.redirectFullURL;

  passport.authenticate("oidc", async (err, user, info) => {
    if (err) {
      logger.error({
        type: "CILogon callback error",
        message: err,
        user: user
      });
      return res.redirect(`/error/cilogon`);
    }
    if (!user) {
      return res.redirect(`/error/nouser`);
    }
    req.logIn(user, async function (err) {
      if (err) {
        logger.error({
          type: "req.logIn() error",
          message: err,
          user: user
        });
        return res.redirect(`/error/other`);
      }

      const openId = user.sub;
      const email = user.email;

      // Set user role as undefined, unless it is retrieved from the database
      let role = undefined;

      try {
        // Verify if a user exists
        const userExistsInDB = await checkUser(openId);
        // If the user doesn't exist, add user
        if (!userExistsInDB) {
          const response = await addUser(
            openId,
            user.given_name,
            user.family_name,
            email,
            user.idp_name
          );
          // Retrieve user role from the response of the endpoint
          role = response.role;
        } else {
          // Retrieve user role from OpenSearch, if the user exists
          role = await getUserRole(openId);
        }
      } catch (error) {
        logger.error({
          type: "Error during operations with user database",
          message: error,
          user: user
        });
      }

      // If role doesn't exist or returns ERROR, redirect users to the database error page
      if (!role || role === "ERROR") {
        return res.redirect(`/error/database`);
      }

      // Generate JWT token with role
      const userPayload = { id: openId, role: role, email: email };

      // Generate tokens
      const accessToken = generateAccessToken(userPayload);
      const refreshToken = generateRefreshToken(userPayload);

      // Save refresh token in OpenSearch
      await storeRefreshToken(client, refreshToken, user.sub);

      // Set the tokens in cookies
      res.cookie(jwt_access_token_name, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: target_domain,
        path: "/",
      });
      res.cookie(jwt_refresh_token_name, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: target_domain,
        path: "/",
      });
      res.cookie(jwt_tokens_exist_name, true, { path: "/" });
      res.redirect(redirectFullURL);
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  const redirectDomainId = req.query["redirect-domain-id"];
  const redirectPath = req.query["redirect-path"];
  const redirectFullURL = getValidatedRedirectFullURL(redirectDomainId, redirectPath);

  res.clearCookie(jwt_access_token_name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    domain: target_domain,
    path: "/",
  });
  res.clearCookie(jwt_refresh_token_name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    domain: target_domain,
    path: "/",
  });
  res.clearCookie(jwt_tokens_exist_name, { path: "/" });

  req.session.destroy(function (err) {
    res.redirect(redirectFullURL);
  });
});

router.get("/", (req, res) => {
  res.send(`<h2>Welcome to the homepage of I-GUIDE Platform authentication server.</h2>
    <p>You may login <a href='/login'>here</a> or go back to <a href="${FRONTEND_URL}">I-GUIDE Platform homepage</a>.</p>
    <p>You may also visit our <a href="${FRONTEND_URL}/contact-us">help page</a> if you have any questions.</p>`);
});

router.get("/auth-validation", function (req, res) {
  res.header("Content-Type", "application/json");
  if (req.isAuthenticated()) {
    res.end(JSON.stringify({ isAuthenticated: true }));
  } else {
    res.end(JSON.stringify({ isAuthenticated: false }));
  }
});

router.get("/userinfo", (req, res) => {
  res.header("Content-Type", "application/json");
  if (req.session.passport) {
    const sub = req.session.passport.user.sub
      ? req.session.passport.user.sub
      : null;
    const given_name = req.session.passport.user.given_name
      ? req.session.passport.user.given_name
      : null;
    const family_name = req.session.passport.user.family_name
      ? req.session.passport.user.family_name
      : null;
    const idp_name = req.session.passport.user.idp_name
      ? req.session.passport.user.idp_name
      : null;
    const email = req.session.passport.user.email
      ? req.session.passport.user.email
      : null;
    const iss = req.session.passport.user.iss
      ? req.session.passport.user.iss
      : null;

    const user_info = JSON.stringify({
      userInfo: {
        sub: sub,
        given_name: given_name,
        family_name: family_name,
        idp_name: idp_name,
        email: email,
        iss: iss,
      },
    });

    res.end(user_info);
  } else {
    const no_user_info = JSON.stringify({
      userInfo: null,
    });

    res.end(JSON.stringify(no_user_info));
  }
});

router.post('/recaptcha-verification', async (req, res) => {
  const recaptchaToken = req.body;
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptcha_secret_key}&response=${recaptchaToken?.recaptchaToken}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
    })
    if (!response.ok) {
      res.send()
    }

    const result = await response.json();
    res.send(result)
  } catch (err) {
    logger.warn({
      type: "reCAPTCHA failed",
      message: err
    });
  }
})

router.get("/error/cilogon", (req, res) => {
  res.send(`<h2>We ran into an issue during the authentication.</h2>
    <p><b>What happened</b>: We couldn't authenticate you due to an issue from CILogon.</p>
    <p><b>What to do</b>: For assistance or to report this issue, please click <a href="${FRONTEND_URL}/contact-us" target="_blank">here</a>
    or visit ${FRONTEND_URL}/contact-us to access our help page. We're here to help and look forward to resolving this matter for you.</p>`);
});

router.get("/error/nouser", (req, res) => {
  res.send(`<h2>We ran into an issue during the authentication.</h2>
    <p><b>What happened</b>: We couldn't authenticate you because CILogon didn't return us valid user information.</p>
    <p><b>What to do</b>: For assistance or to report this issue, please click <a href="${FRONTEND_URL}/contact-us" target="_blank">here</a>
    or visit ${FRONTEND_URL}/contact-us to access our help page. We're here to help and look forward to resolving this matter for you.</p>`);
});

router.get("/error/other", (req, res) => {
  res.send(`<h2>We ran into an issue during the authentication.</h2>
    <p><b>What happened</b>: We couldn't authenticate you because of an unknown issue.</p>
    <p><b>What to do</b>: For assistance or to report this issue, please click <a href="${FRONTEND_URL}/contact-us" target="_blank">here</a>
    or visit ${FRONTEND_URL}/contact-us to access our help page. We're here to help and look forward to resolving this matter for you.</p>`);
});

router.get("/error/database", (req, res) => {
  res.send(`<h2>We ran into an issue during the authentication.</h2>
    <p><b>What happened</b>: We couldn't authenticate you because our user database is currently unavailable.</p>
    <p><b>What to do</b>: For assistance or to report this issue, please click <a href="${FRONTEND_URL}/contact-us" target="_blank">here</a>
    or visit ${FRONTEND_URL}/contact-us to access our help page. We're here to help and look forward to resolving this matter for you.</p>`);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./uploads/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});

const multi_upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("files", 5);

router.post("/upload-to-slack", async (req, res) => {
  multi_upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      logger.error({
        type: "upload-to-slack MulterError",
        message: err
      });
      res
        .status(500)
        .send({ error: { message: `Multer uploading error: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      // An unknown error occurred when uploading.
      if (err.name == "ExtensionError") {
        logger.error({
          type: "upload-to-slack ExtensionError",
          message: err
        });
        res
          .status(413)
          .send({ error: { message: err.message } })
          .end();
      } else {
        logger.error({
          type: "upload-to-slack unknown error",
          message: err
        });
        res
          .status(500)
          .send({
            error: { message: `unknown uploading error: ${err.message}` },
          })
          .end();
      }
      return;
    }

    // Everything went fine.
    let files = req.files;
    let file_uploads = [];
    files.map((file) =>
      file_uploads.push({
        file: createReadStream(`./uploads/${file.filename}`),
        filename: file.filename,
      })
    );

    try {
      const contactDetails = JSON.parse(req.body.contactDetails);

      const result = await web.filesUploadV2({
        channel_id: slack_channel_id,
        initial_comment: `*${contactDetails.contactCategory}*\n_Name:_ ${contactDetails.contactName}\n_Email:_ ${contactDetails.contactEmail}\n_Message:_\n${contactDetails.contactMessage}`,
        file_uploads,
      });

      files.map((file) => {
        unlinkSync(`./uploads/${file.filename}`);
      });

      if (result.ok) {
        return res.status(200).json({ data: "upload successful" });
      }

      return res.status(500).json({ error: "Failed to process" });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
});

module.exports = router;
