//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const statusConfig = require('../controllers/status_config_ctrl');

    //USER ROLES to InquestPro
    router.post('/status',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('sc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            statusConfig.addTest(req, res);
        }
    );

    //All Configuration status
    router.get('/statusList',
        addon.authenticate(),
        (req, res, next) => {
            statusConfig.listStatus(req, res)
        }
    );

    //update GROUPS 
    router.put('/status',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('config_status_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            statusConfig.updateConfigStatus(req, res);
        }
    );

     //USER ROLES to InquestPro
     router.delete('/status',
     addon.authenticate(),
     [
         check('config_status_id').not().isEmpty()
     ],
     (req, res, next) => {
         validator(req, res, next)
     },
     (req, res, next) => {
        statusConfig.deleteConfigStatus(req, res)
     }
 );

 //Get Config Status By ID 
 router.get('/status/id',
 addon.authenticate(),
 [
     check('config_status_id').not().isEmpty()
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