const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Client } = require("@opensearch-project/opensearch");
const multer = require("multer");
const { createReadStream, unlinkSync } = require("fs");
const { WebClient } = require("@slack/web-api");
const path = require("path");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { logger } = require("./logger.js");

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

const slack_channel_id = process.env.SLACK_CHANNEL_ID;
const slack_api_token = process.env.SLACK_API_TOKEN;

const recaptcha_secret_key = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

const web = new WebClient(slack_api_token);

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

// Function to retrieve the role from the "user_dev" index
const getUserRole = async (userOpenId) => {
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
    return "ERROR"
  }
};

// Store refresh token in OpenSearch
const storeRefreshToken = async (client, token, userOpenId) => {
  await client.index({
    index: os_index,
    body: {
      token,
      userOpenId,
      created_at: new Date(),
    },
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: access_token_expiration,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: refresh_token_expiration,
  });
};

router.get(
  "/login",
  function (req, res, next) {
    next();
  },
  passport.authenticate("oidc", {
    scope: "openid profile email org.cilogon.userinfo",
    initialidp: "urn:mace:incommon:uiuc.edu",
  })
);

router.get("/cilogon-callback", async (req, res, next) => {
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

      // Retrieve user role from OpenSearch
      const role = await getUserRole(user.sub);

      // If role returns ERROR, redirect users to the database error page
      if (role === "ERROR") {
        return res.redirect(`/error/database`);
      }

      // Generate JWT token with role
      const userPayload = { id: user.sub, role: role, email: user.email };

      // Generate tokens
      const accessToken = generateAccessToken(userPayload);
      const refreshToken = generateRefreshToken(userPayload);

      // Save refresh token in OpenSearch
      await storeRefreshToken(client, refreshToken, user.sub);

      // Set the tokens in cookies
      res.cookie(process.env.JWT_ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: target_domain,
        path: "/",
      });
      res.cookie(process.env.JWT_REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain: target_domain,
        path: "/",
      });
      res.cookie("IGPAU", true, { path: "/" });

      res.redirect(`${FRONTEND_URL}/user-profile`);
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  const redirectURI = req.query["redirect-uri"];
  const decodedRedirectURI = decodeURIComponent(redirectURI);

  res.clearCookie(process.env.JWT_ACCESS_TOKEN_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    domain: target_domain,
    path: "/",
  });
  res.clearCookie(process.env.JWT_REFRESH_TOKEN_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    domain: target_domain,
    path: "/",
  });
  res.clearCookie("IGPAU", true, { path: "/" });

  req.session.destroy(function (err) {
    if (redirectURI) {
      res.redirect(`${FRONTEND_URL}${decodedRedirectURI}`);
    } else {
      res.redirect(`${FRONTEND_URL}`);
    }
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
