//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const userRole = require('../controllers/global_user_role.ctrl');

    //post USER ROLES 
    router.post('/',
        addon.authenticate(),
        [
            check('user_name').not().isEmpty(),
            check('role_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            userRole.createUserRole(req, res);
        }
    );
    //USER ROLES update
    router.put('/',
        addon.authenticate(),
        [
            check('id').not().isEmpty(),
            check('user').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            userRole.editUserRoles(req, res);
        }
    );

    //global user role delete
    router.delete('/',
        addon.authenticate(),
        [
            check('id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            userRole.deleteUserRole(req, res)
        }
    );

    //global user role list
    router.get('/listActive',
        addon.authenticate(),
        (req, res, next) => {
            userRole.getUserRolesList(req, res)
        }
    );

    return router;
}