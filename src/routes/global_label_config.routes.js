//LABEL CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const globalLabelConfig = require('../controllers/global_label_config.ctrl');
    //Label config create api 
    router.post('/create',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty(),
            check('lc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalLabelConfig.addLabelConfig(req, res);
        }
    );

    //List All Label Config 
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            globalLabelConfig.getAllLabelList(req, res);
        }
    );

    //Get Label Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('global_label_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalLabelConfig.getLabelConfigById(req, res);
        }
    );

    //Delete Label Config by ID 
    router.delete('/delete',
        addon.authenticate(),
        [
            check('global_label_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalLabelConfig.deleteLabelConfig(req, res);
        }
    );
    return router;
}