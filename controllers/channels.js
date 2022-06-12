const { Channel } = require("../models/Channel");

async function channels_list(req, res, next) {
    channels = await Channel.find({});

    res.render('channels/list.html', { channels: channels })
}

async function new_channel(req, res, next) {
    if (req.method == "GET") {
        res.render('channels/new.html')
    }
    else if (req.method == "POST") {

        const channel = new Channel({
            channel_name: req.body.channel_name,
            is_public: (req.body.is_public == "yes") ? true : false,
        })

        await channel.save()

        res.redirect('/app/channels/')
    }
    else {
        res.render("404.html")
    }
}

async function channel_detail(req, res, next) {
    if (req.method == "GET") {
        console.log(req.query.id)
        channel = await Channel.findOne({ id: req.query.id })
        res.render('channels/detail.html', { channel: channel })
    }
    else if (req.method == "POST") {

        const channel = new Channel({
            channel_name: req.body.channel_name,
            is_public: (req.body.is_public == "yes") ? true : false,
        })

        await channel.save()

        res.redirect('/app/channels/')
    }
    else {
        res.render("404.html")
    }
}

module.exports = { channels_list, new_channel, channel_detail }
