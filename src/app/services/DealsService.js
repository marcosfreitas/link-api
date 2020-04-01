/**
 * @todo make model and service request
 */

 let DealModel = require('../models/DealModel');

 const axios = require('axios').default;

 /**
 * Service classes maintain the Business Logic.
 * Services don't know about requests and responses or databases, they just do something.
 * Here, each method do just one or few things related to orchestrate this Service class.
 *
 */

 class DealsService
 {
    constructor () {
        this.model = new DealModel();
    }

    all = function() {
        try {
           return this.model.all(function(error, data) {

                if (error) {
                    return {
                        error : 1,
                        code: 'list_failed',
                        description : error,
                        data: error
                    };
                }

                return {
                    error : 0,
                    code: 'data_found',
                    description: 'dados encontrados',
                    data : data
                };
            });

        } catch (error) {
            console.error(error);
            return {
                error: 1,
                code: 'unexpected_app_status',
                description: "Erro inesperado",
                data: error
            };
        }
    };


    /**
     * Getting filtered deals from Pipedrive
     */
    getWonDealsFromRemote = async function(req, res) {

        try {

            console.log('Buscando dados no pipedrive...');

            let request_url = process.env.PIPEDRIVE_API_URL + '/deals?status=won&start=0&api_token=' + process.env.PIPEDRIVE_API_TOKEN
            const response = await axios.get(request_url);

            return (response.status === 200) ? response.data : [];

        } catch (error) {
            console.error(error);
            return {
                error: 1,
                code: 'unexpected_app_status',
                description: 'Erro inesperado',
                data: []
            };
        }

    }

    /**
     * Saving received deals to our database document
     */
    saveToOurDatabase = function(deals, req, res) {
        try {

            let errors = [];

            for (const key in deals.data) {

                let data = {
                    value: deals.data[key].value,
                    currency: deals.data[key].currency,
                    payload: deals.data[key]
                };

                // dispatching data to be saved
                this.model.store(data, function(error, stored) {
                    if (error) {
                        errors.push({
                            error : 1,
                            code: 'store_failed',
                            description : error
                        });
                    }
                });

            }

            if (errors.length) {
                console.log(errors);
                return {
                    error: 1,
                    code: 'data_not_saved',
                    description: "Alguns itens não puderam ser salvos",
                    data: errors
                };
            }

            console.log('operação finalizada com sucesso');
            return {
                error: 0,
                code: 'data_saved',
                description: 'Operação realizada com sucesso',
                data: []
            };
        } catch (error) {
            console.error(error);
            return {
                error: 1,
                code: 'unexpected_app_status',
                description: "Erro inesperado",
                data: errors
            };
        }
    }

    /**
     * Send all deals to bling
     */
    putAsOrderIntoBling = async function(deals, req, res) {
        try {
            console.log('Salvando dados na bling...');

            let errors = [];

            for (const key in deals.data) {

                let xml = this.mountBlingXML(deals.data[key]);

                let request_url = process.env.BLING_API_URL + '/pedido/json/';

                const response = await axios.post(
                    request_url+'?apikey=' + process.env.BLING_API_TOKEN + '&xml='+xml,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );

                console.log(response.status);
                if ((response.status !== 200 && response.status !== 201) || typeof response.data.retorno.erros !== "undefined") {
                    console.log('Dados não sincronizados com a Bling');
                    errors.push({
                        error: 1,
                        code: 'bling_not_synced',
                        description: 'Erro inesperado',
                        data: response.data.retorno
                    });
                }

            }

            if (errors.length) {
                return {
                    error: 1,
                    code: 'bling_not_synced',
                    description: 'Operação não realizada',
                    data: errors
                };

            }

            console.log('operação finalizada');
            return {
                error: 0,
                code: 'bling_synced',
                description: 'Dados salvos na API da Bling com sucesso',
                data: response.data.pedidos
            };

        } catch (error) {
            console.error(error);
            res.json({
                error: 1,
                code: 'unexpected_app_status',
                description: 'Erro inesperado',
                data: []
            });
        }
    }

    /**
     * Format XML to be sent to Bling API
     */
    mountBlingXML = function(deal) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>';

            xml += `<pedido>
                        <cliente>
                            <nome>${deal.org_name}</nome>
                        </cliente>
                        <numero>${deal.id}</numero>
                        <data>${deal.add_time}</data>
                        <itens>
                            <item>
                                <codigo>00${deal.id}</codigo>
                                <qte>1</qte>
                                <vlr_unit>${deal.value}</vlr_unit>
                            </item>
                        </itens>
                        <obs>Pedido migrado do pipedrive em ${deal.currency}</obs>
                    </pedido>`;

        return xml;

    }
 }


 module.exports = DealsService;