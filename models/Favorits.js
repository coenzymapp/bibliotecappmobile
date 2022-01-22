const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoritsSchema = Schema({
    
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User'},
    publication: { type: Schema.ObjectId, ref: 'Publication'}
})
module.exports = mongoose.model('Favorit', FavoritsSchema);