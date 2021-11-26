const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");


router.post('/', async (req, res) => {
    console.log("auth.js");
    console.log(req.body);
    let user = await User.findOne({user_id: req.body.user_id});
    
    if(!user){
        res.status(404);
        res.json({message: "invalid user"});
    }

    await Token.updateMany({ user_id: req.body.user_id }, { expired: true });
    
    const token = new Token({
        user_id: req.body.user_id,
        token: crypto.randomBytes(20).toString('hex')
    });

    try {
        const savedToken = await token.save();
        res.json({'token':savedToken.token});
    } catch (error) {
        res.json({message: error});
    }
    
});

module.exports = router;