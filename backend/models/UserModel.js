const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    FullName: {
        type: String,
        // required: true
    },
    Email: {
        type: String,
        // required: true,
        unique: true
    },
    Password: {
        type: String,
        // required: true
    },
    Otp: {
        type: String
    },
    ExpiredOtp: {
        type: String
    },
    JWTToken: {
        type: String
    },
    resetToken: {
        type: String
    }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;