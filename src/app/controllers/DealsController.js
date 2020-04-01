/**
 * @todo applies auth layer
 */
let DealsService = require('../services/DealsService');

class DealsController {
    constructor () {
        this.service = new DealsService();
    }

    patch = async function(req, res) {
        try {

            let deals = await this.service.getWonDealsFromRemote(req, res);

            if (!Object.keys(deals).length || !Object.keys(deals.data).length) {
                return res.json({
                    error: 1,
                    code: "empty_data",
                    description: "Nenhuma informação válida obtida"
                });
            }

            if (!deals.success) {
                return res.json({
                    error: 1,
                    code: "invalid_response",
                    description: "Requisição ao PipeDrive falhou"
                });
            }

            let saved = await this.service.saveToOurDatabase(deals, req, res);
            console.log(saved);
            if (!saved.error) {
                saved = await this.service.putAsOrderIntoBling(deals, req, res);
            }

            res.json(saved);

        } catch (error) {
            console.debug(error);
        }
    }
}

module.exports = DealsController;