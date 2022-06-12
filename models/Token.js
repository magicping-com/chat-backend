const mongoose = require("mongoose");


const TokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    created_on: {
      type: Date,
      default: Date.now,
    },
    expired: {
      type: Boolean,
      default: false
    },
    socket_id: {
      type: String
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Token", TokenSchema);