const mongoose = require("mongoose");

const channelUser = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true
    },
    socket_id: {
      type: String,
      required: true
    }
  }
);

const ChannelSchema = new mongoose.Schema(
  {
    channel_name: {
      type: String,
      unique: true,
      required: true
    },
    users: [
      channelUser
    ],
    is_public: {
      type: Boolean,
      required: true,
    },
    created_on: {
      type: Date,
      default: Date.now,
    }
  }
);


module.exports = mongoose.model("Channel", ChannelSchema);