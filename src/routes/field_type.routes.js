//ENVIRONMENT CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const fieldType = require('../controllers/field_type.ctrl');
    //List All field type
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            fieldType.allFieldTypeList(req, res);
        }
    );

    //Get Field Type By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('field_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            fieldType.getFieldTypeById(req, res);
        }
    );

    return router;
}