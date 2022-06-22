const express = require('express')
const router = express.Router()
const passport = require('passport')
const { UserLogin } = require('./../models/User')

router.get('/google/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback/',
    passport.authenticate('google', { failureRedirect: '/' }),
    async function (req, res) {
        console.log("user name:", req.user._json.name)
        console.log("user email:", req.user._json.email)
        console.log("users count", await UserLogin.count({}))

        // create first user if there are no users in the db
        if (await UserLogin.count({}) == 0) {
            const user = new UserLogin({
                email: req.user._json.email,
                name: req.user._json.name,
                is_active: true
            })
            await user.save()
        }

        // create user if the is not in the system already
        if (await UserLogin.exists({ email: req.user._json.email })) {
            res.redirect('/app/')
        } else if (await UserLogin.exists({ email: req.user._json.email, is_active: false })) {
            // if user is not active, logout the request and show him that his account is not active.
            req.logout()
            res.render('user/auth_blocked.html')
        } else {
            res.redirect('/')
        }
    }
)

router.get('/logout/', async function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

module.exports = router

// const crypto = require("crypto");
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Token = require("../models/Token");


// router.post('/', async (req, res) => {
//     console.log("auth.js");
//     console.log(req.body);
//     let user = await User.findOne({ user_id: req.body.user_id });

//     if (!user) {
//         res.status(404);
//         res.json({ message: 'invalid user' });
//     }

//     await Token.updateMany({ user_id: req.body.user_id }, { expired: true });

//     const token = new Token({
//         user_id: req.body.user_id,
//         token: crypto.randomBytes(20).toString('hex')
//     });

//     try {
//         const savedToken = await token.save();
//         res.json({ 'token': savedToken.token });
//     } catch (error) {
//         res.json({ message: error });
//     }
// });

// module.exports = router;