const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactPermissionSchema = Schema({
    status: String,
    created_at: String,
    permited_at: String,
    viewed: Boolean,
    user: { type: Schema.ObjectId, ref: 'User'},
    publication: { type: Schema.ObjectId, ref: 'Publication'},
    publisher: { type: Schema.ObjectId, ref: 'User'}
})
module.exports = mongoose.model('ContactPermission', ContactPermissionSchema);