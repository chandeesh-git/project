//DATASET CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const globalDatasetConfig = require('../controllers/global_dataset_config.ctrl');
    //global dataset config create api 
    router.post('/create',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty(),
            check('dc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalDatasetConfig.addDatasetConfig(req, res);
        }
    );

    //List All global dataset Config 
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            globalDatasetConfig.getAllDatasetList(req, res);
        }
    );

    //Get global dataset Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('global_dataset_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalDatasetConfig.getDatasetConfigById(req, res);
        }
    );

    //global dataset update to InquestPro
    router.put('/edit',
        addon.authenticate(),
        [
            check('global_dataset_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('user').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalDatasetConfig.editDatasetConfig(req, res);
        }
    );

    //Delete global dataset Config by ID 
    router.delete('/delete',
        addon.authenticate(),
        [
            check('global_dataset_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalDatasetConfig.deleteDatasetConfig(req, res);
        }
    );
    return router;
}