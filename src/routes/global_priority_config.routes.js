//PRIORITY CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const globalPriorityConfig = require('../controllers/global_priority_config.ctrl');
    //global priority config create api 
    router.post('/create',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty(),
            check('pc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalPriorityConfig.addPriorityConfig(req, res);
        }
    );

    //List All global priority Config 
    router.get('/allList',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty(),
            check('priority_type').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalPriorityConfig.getAllPriorityList(req, res);
        }
    );

    //Get global priority Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('global_priority_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalPriorityConfig.getPriorityConfigById(req, res);
        }
    );

    //global priority update 
    router.put('/edit',
        addon.authenticate(),
        [
            check('global_priority_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('user').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalPriorityConfig.editPriorityConfig(req, res);
        }
    );
    //Delete global priority Config by ID 
    router.delete('/delete',
        addon.authenticate(),
        [
            check('global_priority_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalPriorityConfig.deletePriorityConfig(req, res);
        }
    );
    return router;
}