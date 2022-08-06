const mongoose = require('mongoose');
const crypto = require('crypto')
const { Schema } = mongoose;

const AdminSchema = new Schema({
    email: String,
    password: String,
    type:Number,
    active: Number,
    createdAt: Schema.Types.Date,
    updatedAt: Schema.Types.Date,
    
});

AdminSchema.index({ email: 1, type: -1 }); 
AdminSchema.methods.comparePassword = function(password) {
    return this.password == crypto.createHash('md5').update(password).digest("hex")
};
const AdminModel = mongoose.model('Admin', AdminSchema)

module.exports = AdminModel