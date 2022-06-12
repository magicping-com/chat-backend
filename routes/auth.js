const express = require('express')
const router = express.Router()
const passport = require('passport')
const { UserLogin } = require('./../models/User')

router.get('/google/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback/',
    passport.authenticate('google', { failureRedirect: '/' }),
    async function (req, res) {
        console.log(req.user._json.name)
        // create user if he is not in the system already
        if (await UserLogin.exists({ id: req.user._json.id }) == false) {
            // const user = new UserLogin({
            //     id: req.user._json.id,
            //     email: req.user._json.email,
            //     name: req.user._json.name
            // })
            // await user.save()
            res.redirect('/app/')
        } else if (await UserLogin.exists({ id: req.user._json.id, is_active: false })) {
            // if user is not active, logout the request and show him that his account is not active.
            req.logout()
            res.render('user/auth_blocked.html')
        } else {
            res.redirect('/app/')
        }
    }
)

router.get('/logout/', async function (req, res) {
    req.logout()
    res.redirect('/')
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