const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/userController.js');


// <==============================   LOGIN & LOGOUT  ROUTE    ======================================================>
router.route("/login")
    .get(userController.loginForm)

    .post(saveRedirectUrl, 
    passport.authenticate('local', {
        // successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true }),
    userController.login
);

router.get('/logout', userController.logout);

// <==============================   SIGNUP  ROUTE    ======================================================>
router.route("/signup")
    .get(userController.signupForm)

    .post(wrapAsync(userController.signup));

module.exports = router;