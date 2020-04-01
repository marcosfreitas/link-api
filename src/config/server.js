module.exports = async function(app) {

    /**
     * Preparing required modules
     */
    global.express = require('express');
    global.router = express.Router();

    const dotenv = require('dotenv');
    dotenv.config();

    /**
     * validation layer
     */
    const { check, buildCheckFunction, validationResult } = require('express-validator');
    checkBodyAndQuery = buildCheckFunction(['body', 'query']);
    global.validationResult = validationResult;
    global.check = check;

    /**
     * Database
     */
    const server = process.env.MONGO_SERVER;
    const database = process.env.MONGO_DATABASE;
    const user = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;

    global.mongoose = require('mongoose');

    let mongo_options = {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        ssl: true,
        replicaSet: 'linkou-shard-0',
        authSource: 'admin',
        retryWrites: true,
        w: 'majority'
    };

    let mongo_uri = `mongodb://${user}:${password}@${server}/${database}`;

    await mongoose.connect(mongo_uri, mongo_options).then(()=> {
        console.log('conexão com o banco iniciada');
    }).catch((e)=>{
        console.log(e);
        console.log('falhar ao conectar com o banco');
    });

    app = express();

    /**
     * Extras
     */
    app.use(express.urlencoded({
        extended : true
    }));

    app.use(express.json());



    /**
     * Routes
     */
    const api = require('../app/routes/api');

    app.use('/v1', api);

    /**
     * @todo improve layer of capturing and monitoring
     * this is working with error 500
     */
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Whoops! Something went wrong')
    });

    app.listen(process.env.SERVER_PORT, function() {
        console.log('server listening at port ' + process.env.SERVER_PORT);
    });
};