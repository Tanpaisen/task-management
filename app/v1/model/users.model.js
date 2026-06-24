const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    tokenUser: String,
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