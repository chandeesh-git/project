//CUSTOM FIELD CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const customFieldConfig = require('../controllers/custom_field_config.ctrl');
    //custom field config create api 
    router.post('/',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('cfc_name').not().isEmpty(),
            check('cfc_type').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFieldConfig.addCustomFieldConfig(req, res);
        }
    );
    //Custom Field update to InquestPro
    router.put('/',
        addon.authenticate(),
        [
            check('cfield_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFieldConfig.editCustomFieldConfig(req, res);
        }
    );

    //List All Custom Field Config 
    router.get('/allList',
        addon.authenticate(),
        check('project_id').not().isEmpty(),
        check('domain_id').not().isEmpty(),
        check('cfc_type').not().isEmpty(),
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFieldConfig.getAllCustomFieldList(req, res);
        }
    );

    //Get Custom Field Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('cfield_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFieldConfig.getCustomFieldgById(req, res);
        }
    );

    //Delete Custom Field Config by ID 
    router.delete('/',
        addon.authenticate(),
        [
            check('cfield_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFieldConfig.deleteCustomFieldConfig(req, res);
        }
    );
    return router;
}