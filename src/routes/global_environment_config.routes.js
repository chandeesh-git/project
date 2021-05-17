//GLOBAL SETTING ENVIRONMENT CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const globalEnvConfig = require('../controllers/global_environment_config.ctrl');
    //global environment config create api 
    router.post('/create',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty(),
            check('ec_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalEnvConfig.addGlobalEnvConfig(req, res);
        }
    );

    //List All global Environment Config 
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            globalEnvConfig.allGlobalEnvList(req, res);
        }
    );

    //Get global Environment Config By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('global_env_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalEnvConfig.globalEnvConfigId(req, res);
        }
    );

    //Global environment update 
    router.put('/',
        addon.authenticate(),
        [
            check('global_env_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalEnvConfig.editGlobalEnvConfig(req, res);
        }
    );
 
    //Delete Environment Config by ID 
    router.delete('/',
        addon.authenticate(),
        [
            check('global_env_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            globalEnvConfig.deleteGlobalEnvConfig(req, res);
        }
    );
    return router;
}