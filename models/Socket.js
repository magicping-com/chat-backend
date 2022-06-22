const mongoose = require("mongoose");

const Socket = mongoose.model("Socket", new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        user_info: {},
        token: {
            type: String,
            required: true,
        },
        created_on: {
            type: Date,
            default: Date.now,
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
        },
        channel_name: {
            type: String,
            required: true
        },
        socket_id: {
            type: String,
            unique: true
        },
        connected: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
));

module.exports = { Socket };
