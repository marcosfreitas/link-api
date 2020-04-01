const DealSchema = mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now,
        require: true
    },
    value: {
        type : Number,
        required : true
    },
    currency: {
        type : String,
        required : true
    },
    payload: {
        type: Object,
        require: true
    }
});

module.exports = DealSchema;