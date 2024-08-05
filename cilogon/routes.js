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
    passport.authenticate('oidc', {
        scope: "openid profile email org.cilogon.userinfo",
        initialidp: "urn:mace:incommon:uiuc.edu"
    })
);

router.get('/cilogon-callback', (req, res, next) => {
    passport.authenticate('oidc', {
        successRedirect: FRONTEND_URL + '/user-profile',
        failureRedirect: '/'
    })(req, res, next)
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect(FRONTEND_URL);
    });
});

router.get("/", (req, res) => {
    res.send("Login failed...")
});

router.get("/auth-validation", function (req, res) {
    res.header("Content-Type", 'application/json');
    if (req.isAuthenticated()) {
        res.end(JSON.stringify({ isAuthenticated: true }))
    } else {
        res.end(JSON.stringify({ isAuthenticated: false }))
    }
})

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
        })

        console.log('req passport', req.session.passport)
        res.end(user_info);
    } else {
        const no_user_info = JSON.stringify({
            userInfo: null
        })

        console.log('No users')
        res.end(JSON.stringify(no_user_info));
    }
});


module.exports = router