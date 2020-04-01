const router = global.router;
const checkBodyAndQuery = global.checkBodyAndQuery;
const check = global.check;
const validationResult = global.validationResult;

let DealsController = require('../controllers/DealsController');
let DealsControllerInstance = new DealsController();

router.get('/', function (req, res) {
    res.json({ working : true});
});

router.patch('/deal/', function(req, res) {
    DealsControllerInstance.patch(req, res);
});

module.exports = router;