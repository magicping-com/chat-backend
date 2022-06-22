const mongoose = require("mongoose");
const { Schema } = mongoose;

const Channel = mongoose.model('Channel', new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    users: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true }
    ],
    is_public: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
));


module.exports = { Channel };