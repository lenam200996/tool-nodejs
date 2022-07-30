const mongoose = require('mongoose');
const { Schema } = mongoose;

const secretKeySchema = new Schema({
    key : { type: String, required: true },
    createdAt: Schema.Types.Date,
    updatedAt: Schema.Types.Date,
    type: { type: String, required: true }, // 1m , 3m ,6m, 12m
    status: {
        type: Number,
        default: 0
    }, // 0 1
    expiredTime: Schema.Types.Date,
    lastLogin: {
        type: String
    }

});

secretKeySchema.index({ key: 1, type: -1 }); 

const SecretKeyModel = mongoose.model('SecretKey', secretKeySchema)

module.exports = SecretKeyModel