const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        min: 4,
        lowercase: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    city: String,
    tanbatt:{
        type: String,
        required: true
    },
    terms:{
        type: String,
        required: true
    },
    confirmedEmail:{
        type: Boolean
    },
    avatar: String,
    is_restringed:{
        type: Boolean
    },
    is_eliminated:{
        type: Boolean
    }

});
module.exports = mongoose.model('User', userSchema);