const router = require("express").Router();
const passport = require("passport");
require('dotenv').config();

const FRONTEND_URL = process.env.REACT_FRONTEND_URL;

router.get('/login',
    function (req, res, next) {
        console.log('-----------------------------');
        console.log('/Start login handler');
        next();
    },
    passport.authenticate('oidc', { scope: "openid profile email org.cilogon.userinfo" }
    )
);

router.get('/cilogon-callback', (req, res, next) => {
    passport.authenticate('oidc', {
        successRedirect: FRONTEND_URL + '/user_profile',
        failureRedirect: '/'
    })(req, res, next)
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect(FRONTEND_URL);
    });
});

router.get("/", (req, res) => {
    res.send(" <a href='/login'>Log In with OAuth 2.0 Provider </a>")
});

router.get("/user", (req, res) => {
    res.header("Content-Type", 'application/json');
    res.end(JSON.stringify({ user: req.session }, null, 1));
});


module.exports = router