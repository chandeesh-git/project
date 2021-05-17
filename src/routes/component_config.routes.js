//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const componentConfig = require('../controllers/component_config.ctrl');

    //create component
    router.post('/create',
        addon.authenticate(),
        [
            check('user').not().isEmpty(),
            check('cp_name').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            componentConfig.createComponent(req, res);
        }
    );

    //List all components
    router.get('/componentList',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            componentConfig.componentLists(req, res)
        }
    );

    //update component 
    router.put('/update',
        addon.authenticate(),
        [
            check('user').not().isEmpty(),
            check('component_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            componentConfig.updateComponent(req, res);
        }
    );

     //delete component
     router.delete('/delete',
        addon.authenticate(),
        [
            check('component_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            componentConfig.deleteComponent(req, res)
        }
    );

    //Get component By ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('component_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            componentConfig.getComponentById(req, res);
        }
    );

    return router;
}