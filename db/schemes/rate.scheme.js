const mongoose = require('mongoose');
const { Schema } = mongoose;

const RateSchema = new Schema({
    key : { type: String, required: true },
    createdAt: Schema.Types.Date,
    updatedAt: Schema.Types.Date,
    rateCount: Number,
    rateFeedback: String,
    otherFeedback: String
});

RateSchema.index({ key: 1, type: -1 }); 

const RateModel = mongoose.model('Rate', RateSchema)

module.exports = RateModel