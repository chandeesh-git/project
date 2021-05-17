//DATASET CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const datasetConfig = require('../controllers/dataset_config.ctrl');
    //dataset config create api 
    router.post('/',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('dc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            datasetConfig.addDatasetConfig(req, res);
        }
    );

    //List All dataset Config 
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            datasetConfig.getAllDatasetList(req, res);
        }
    );

    //Get dataset Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('dataset_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            datasetConfig.getDatasetConfigById(req, res);
        }
    );

    //dataset update to InquestPro
    router.put('/',
        addon.authenticate(),
        [
            check('dataset_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            datasetConfig.editDatasetConfig(req, res);
        }
    );

    //Delete dataset Config by ID 
    router.delete('/',
        addon.authenticate(),
        [
            check('dataset_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            datasetConfig.deleteDatasetConfig(req, res);
        }
    );
    return router;
}