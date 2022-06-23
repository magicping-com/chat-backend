const { Channel } = require("../models/Channel");
const { User } = require("../models/User");
const { Socket } = require("../models/Socket");
var crypto = require('crypto');

async function new_channel(req, res, next) {

    const channel = new Channel({
        name: req.body.channel_name,
        is_public: (req.body.is_public == "yes") ? true : false,
    })

    await channel.save()
}

async function new_user(req, res, next) {
    // todo
}

async function authenticate_socket(req, res, next) {

    // check for invalid channel
    const channel = await Channel.findOne({ name: req.body.channel })
    if (!channel) {
        console.log("invalid channel:", req.body.channel)
        res.status(404).json({ message: "invalid channel" })
        return
    }

    // remove if the socket_id exists
    await Socket.findOneAndDelete({ socket_id: req.body.socket_id });

    generated_token = crypto.randomBytes(85).toString('hex');

    console.log(req.body)
    const socket = new Socket({
        user_id: req.body.custom_data.user_id,
        user_info: req.body.custom_data.user_info,
        token: generated_token,
        channel: channel,
        channel_name: channel.name,
        socket_id: req.body.socket_id
    })

    await socket.save()

    res.json({ token: generated_token, custom_data: req.body.custom_data });
    // res.status(404);
    // res.json({ message: "invalid channel" });

}

module.exports = { new_channel, new_user, authenticate_socket }
