//LABEL CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const labelConfig = require('../controllers/label_config.ctrl');
    //Label config create api 
    router.post('/',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('lc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            labelConfig.addLabelConfig(req, res);
        }
    );

    //List All Label Config 
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            labelConfig.getAllLabelList(req, res);
        }
    );

    //Get Label Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('label_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            labelConfig.getLabelConfigById(req, res);
        }
    );

    //Delete Label Config by ID 
    router.delete('/',
        addon.authenticate(),
        [
            check('label_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            labelConfig.deleteLabelConfig(req, res);
        }
    );
    return router;
}