const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = Schema({
    title:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User'},
    publication: { type: Schema.ObjectId, ref: 'Publication'},
    publisher_id: { type: Schema.ObjectId, ref: 'User'},
    reviewed: Boolean
})
module.exports = mongoose.model('Report', ReportSchema);