const express = require("express");
const router = express.Router();
const Channel = require("../models/Channel");


router.get('/', async (req, res) => {
    const channels = await Channel.find({}).select({"_id": 0});
    res.json(channels);
});

router.post('/', async (req, res) => {
    console.log(req.body);

    const channel = new Channel({
        channel_name: req.body.name,
        is_public: req.body.public
    });

    try {
        const savedChannel = await channel.save();
        res.json(savedChannel);
    } catch (error) {
        res.status(409);
        res.json({message: error});
    }
    
});

module.exports = router;