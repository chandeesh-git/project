//ENVIRONMENT CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const environmentConfig = require('../controllers/environment_config.ctrl');
    //environment config create api 
    router.post('/',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('ec_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            environmentConfig.addEnvConfig(req, res);
        }
    );

    //List All Environment Config 
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            environmentConfig.getAllEnvList(req, res);
        }
    );

    //Get Environment Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('env_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            environmentConfig.getEnvConfigById(req, res);
        }
    );

    //Environment update to InquestPro
    router.put('/',
        addon.authenticate(),
        [
            check('env_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            environmentConfig.editEnvConfig(req, res);
        }
    );
 
    //Delete Environment Config by ID 
    router.delete('/',
        addon.authenticate(),
        [
            check('env_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            environmentConfig.deleteEnvConfig(req, res);
        }
    );
    return router;
}