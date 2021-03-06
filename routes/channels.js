const express = require("express");
const router = express.Router();
const Channel = require("../models/Channel");
// const checkCredentials = require('./../middleware/checkCredentials');

// Get all channels
router.get('/', async (req, res) => {
    const channels = await Channel.find({}).select({ "_id": 0, "name": 1, "is_public": 1, "created_on": 1 });
    res.json(channels);
});

// Create new channel
router.post('/', async (req, res) => {
    console.log(req.body);

    const channel = new Channel({
        name: req.body.name,
        is_public: req.body.public
    });

    try {
        const savedChannel = await channel.save();
        res.json(savedChannel);
    } catch (error) {
        res.status(409);
        res.json({ message: error });
    }

});

module.exports = router;