//Global Group sub routing
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const group = require('../controllers/global_group.ctrl');

    //add global groups
    router.post('/',
        addon.authenticate(),
        [
            check('user').not().isEmpty(),
            check('group_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            group.addGroups(req, res);
        }
    );
    //update global GROUPS 
    router.put('/updateGroup',
        addon.authenticate(),
        [
            check('user').not().isEmpty(),
            check('group_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            group.updateGroup(req, res);
        }
    );
    //update Role to GROUPS 
    router.put('/updateRoleGroup',
        addon.authenticate(),
        [
            check('user').not().isEmpty(),
            check('role_id').not().isEmpty(),
            check('group_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            group.updateGroupsRole(req, res);
        }
    );

    //delete group
    router.delete('/',
        addon.authenticate(),
        [
            check('group_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            group.deleteGroups(req, res);
        }
    );

    //all active GROUPS to InquestPro
    router.get('/activeList',
        addon.authenticate(),
        (req, res, next) => {
            group.activeGroupList(req, res);
        }
    );

    //GET group by ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('group_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            group.getGroupById(req, res);
        }
    );

    return router;
}