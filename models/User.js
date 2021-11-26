const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    user_id: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", UserSchema);