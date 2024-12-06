const mongoose = require('mongoose');
const { string, number } = require('zod');

const db = mongoose.connect("mongodb://mongo:password@localhost:27017/mydb?authSource=admin")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    },
    firstname: {
        type: String,
        required: true,
        minlength: 5
    },
    lastname: {
        type: String,
        minlength: 5,
        required: false

    }
})

const AccountSchema = new mongoose.Schema({
    UserId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    balance:{
        type: Number,
        require: true
    }

})

const User = mongoose.model("User",UserSchema);
const Account = mongoose.model("Account",AccountSchema)

module.exports = {
    User,
    Account
};