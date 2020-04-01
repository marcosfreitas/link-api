const DealSchema = require('../schemas/DealSchema');

class DealModel {
    constructor () {

        this.model = 'deal';
        this.schema = DealSchema;
        this.repository = mongoose.model(this.model, this.schema);

    }

    all = function(callback) {
        let model = this.repository;
        return model.find({}, callback);
    };

    store = function(data, callback) {
        let document = this.repository(data);
        document.save(callback);
    };
}

module.exports = DealModel;