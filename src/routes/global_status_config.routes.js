//STATUS SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const statusConfig = require('../controllers/global_status_config.ctrl');

    //create status
    router.post('/create',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty(),
            check('sc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            statusConfig.addTest(req, res);
        }
    );

    //All global Configuration status
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            statusConfig.listStatus(req, res)
        }
    );

    //update status
    router.put('/update',
        addon.authenticate(),
        [
            check('global_status_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            statusConfig.updateConfigStatus(req, res);
        }
    );

    //delete status
     router.delete('/delete',
     addon.authenticate(),
     [
         check('global_status_id').not().isEmpty()
     ],
     (req, res, next) => {
         validator(req, res, next)
     },
     (req, res, next) => {
        statusConfig.deleteConfigStatus(req, res)
     }
 );

    //Get Config Status By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('global_status_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            statusConfig.getStatusById(req, res);
        }
    );

    return router;
}