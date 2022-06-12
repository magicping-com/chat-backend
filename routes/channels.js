const express = require("express");
const router = express.Router();
const Channel = require("../models/Channel");
// const checkCredentials = require('./../middleware/checkCredentials');

// Get all channels
router.get('/', async (req, res) => {
    const channels = await Channel.find({}).select({ "_id": 0, "channel_name": 1, "is_public": 1, "created_on": 1 });
    res.json(channels);
});

// Create new channel
router.post('/', async (req, res) => {
    console.log(req.body);

    // channel_name_re = re.compile(r'\A[-a-zA-Z0-9*@.]+\Z')


    const channel = new Channel({
        channel_name: req.body.name,
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