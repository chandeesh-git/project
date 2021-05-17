//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const role = require('../controllers/role.ctrl');

    //USER ROLES to InquestPro
    router.post('/',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('role_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.addRole(req, res);
        }
    );

    //USER ROLES to InquestPro
    router.put('/',
        addon.authenticate(),
        [
            check('roleUpdate').not().isEmpty(),
            check('acct_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.updateRoles(req, res);
        }
    );

    //USER ROLES to InquestPro
    router.delete('/',
        addon.authenticate(),
        [
            check('role_id').not().isEmpty(),
            check('acct_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.deleteRoles(req, res)
        }
    );

    router.post('/access',
        addon.authenticate(),
        [
            check('roles').not().isEmpty(),
            check('acct_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            role.addRoleAccess(req, res);
        }
    );

    //USER ROLES to InquestPro
    router.get('/list',
        addon.authenticate(),
        (req, res, next) => {
            role.getRoles(req, res)
        }
    );

    router.get('/permissions',
        addon.authenticate(),
        (req, res, next) => {
            role.getPermissionsView(req, res)
        }
    );

    router.get('/manageRole',
        addon.authenticate(),
        (req, res, next) => {
            role.getManageRoleView(req, res)
        }
    );
    //GET role by ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('role_id').not().isEmpty(),
            check('acct_id').not().isEmpty()
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