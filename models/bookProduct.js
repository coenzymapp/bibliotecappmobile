const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookProductSchema = Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    file: String,
    genre: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    contactPhone: {
        type: Number,
    },
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User'},
    is_exchanged: Boolean,
    is_eliminated: Boolean,
    purpose: String,
    price: {
        type: Number,
    },
    
})
module.exports = mongoose.model('BookProduct', BookProductSchema);