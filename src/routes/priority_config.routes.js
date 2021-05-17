//PRIORITY CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const priorityConfig = require('../controllers/priority_config.ctrl');
    //priority config create api 
    router.post('/',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('pc_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            priorityConfig.addPriorityConfig(req, res);
        }
    );

    //List All priority Config 
    router.get('/allList',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('priority_type').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            priorityConfig.getAllPriorityList(req, res);
        }
    );

    //Get priority Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('priority_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            priorityConfig.getPriorityConfigById(req, res);
        }
    );

    //priority update to InquestPro
    router.put('/',
        addon.authenticate(),
        [
            check('priority_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            priorityConfig.editPriorityConfig(req, res);
        }
    );
    //Delete priority Config by ID 
    router.delete('/',
        addon.authenticate(),
        [
            check('priority_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            priorityConfig.deletePriorityConfig(req, res);
        }
    );
    return router;
}