class Service {

    constructor () {
        this.model = null
    }

    index = function(req, res) {

        res.json();
        this.model.all(function(error, data) {
           /**
            * @info difference between text/html and application/json responses
            */
           res.json(data);
        });
    };

    show = function(req, res) {
        this.model.get({
            resource_uuid : req.params.uuid
        }, function(error, data) {
            res.json(data);
        });
    };

    store = function(req, res) {
        this.model.store(req.body, function(error, stored_model) {
            if (!error) {
                return res.json(stored_model);
            }

            res.json({
                error: 1,
                code: 'model_could_not_be_stored',
                description: error
            });
        });
    };

    deleteOne = function(req, res) {
        this.model.deleteOne({
            resource_uuid: req.params.uuid
        }, function(error, data) {
            res.json(data);
        });
    };

    deleteMany = function(req, res) {
        this.model.deleteMany(req.body.filters, function(error, data) {
            res.send(data);
        });
    };

    update = function(req, res) {
        let params = req.params;
        let find = {"_id" : params.id};
        let data = req.body;

        this.model.update(find, data, function(error, updated_model){
            if(!error) {
                res.send(updated_model);
            } else {
                res.send({
                   error: 1,
                   description: error
                });
            }
        });
    }
}

module.exports =  Service;