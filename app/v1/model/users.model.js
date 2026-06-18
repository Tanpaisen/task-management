const mongoose = require('mongoose');
const generate = require('../../../helper/generate');

const userShema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deleteAt: Date,
}, {
    timestamps: true
});
const User = mongoose.model('User', userShema, 'users');

module.exports = User;