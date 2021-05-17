//CUSTOM FIELD CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const customFieldConfig = require('../controllers/global_custom_field.ctrl');
    //custom field config create api 
    router.post('/create',
        addon.authenticate(),
        [
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
    router.put('/edit',
        addon.authenticate(),
        [
            check('global_cfield_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('user').not().isEmpty(),
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
        [
            check('domain_id').not().isEmpty(),
            check('cfc_type').not().isEmpty()
        ],
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
            check('global_cfield_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFieldConfig.getCustomFieldgById(req, res);
        }
    );

    //Delete Custom Field Config by ID 
    router.delete('/delete',
        addon.authenticate(),
        [
            check('global_cfield_id').not().isEmpty()
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