const mongoose = require("mongoose");
const { Schema } = mongoose;

const SocketSchema = new mongoose.Schema(
  {
    socket_id: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: false,
    },
    device_type: {
      type: String,
      required: true
    },
    device_id: {
      type: String,
      required: false
    },
    registered_on: {
      type: Date,
      default: Date.now
    }
  }
);

const User = mongoose.model('User', Schema({
  user_id: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  sockets: [
    SocketSchema
  ],
  created_on: {
    type: Date,
    default: Date.now
  }
},
  { timestamps: true }
));



const UserLogin = mongoose.model('UserLogin', Schema(
  {
    id: { type: String, required: true },
    user_id: { type: String, required: true },
    isActive: { type: Boolean }

  }, { timestamps: true }
))

// Export model
// module.exports = mongoose.model("User", UserSchema);
// module.exports = mongoose.model('UserLogin', UserLogin)

module.exports = { User, UserLogin }
