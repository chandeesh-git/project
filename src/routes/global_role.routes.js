//GLOBAL ROLE ROUTING
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const role = require('../controllers/global_role.ctrl');

    //add global role
    router.post('/',
        addon.authenticate(),
        [
            check('user').not().isEmpty(),
            check('role_name').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.addRole(req, res);
        }
    );

    //edit global role
    router.put('/',
        addon.authenticate(),
        [
            check('roleUpdate').not().isEmpty(),
            check('user').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.updateRoles(req, res);
        }
    );

    //delete role
    router.delete('/',
        addon.authenticate(),
        [
            check('role_id').not().isEmpty(),
            check('user').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.deleteRoles(req, res)
        }
    );

    //List all global roles
    router.get('/list',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty(),
            check('user').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.getRoles(req, res)
        }
    );

    //GET role by ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('role_id').not().isEmpty(),
            check('user').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.getRoleById(req, res);
        }
   );

    return router;
}