var validator = require('validator');
const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.get('/', async (req, res) => {
    const users = await User.find({}).select({ "user_id": 1, "_id": 0});
    res.json(users);
});

router.post('/', async (req, res) => {
    console.log(req.body);

    const user = new User({
        user_id: req.body.user_id
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.status(409);
        res.json({message: error});
    }
    
});

module.exports = router;