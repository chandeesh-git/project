//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const group = require('../controllers/group.ctrl');

    //USER GROUPS to InquestPro
    router.post('/',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('group_name').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            group.addGroups(req, res);
        }
    );
    //update GROUPS 
    router.put('/updateGroup',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
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
            check('acct_id').not().isEmpty(),
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

    //USER GROUPS to InquestPro
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
    //all GROUPS to InquestPro
    router.get('/allList',
        addon.authenticate(),
        (req, res, next) => {
            group.allGroupList(req, res);
        }
    );

    //USER GROUPS to InquestPro
    router.get('/manageGroup',
        addon.authenticate(),
        (req, res, next) => {
            group.manageGroupView(req, res);
        }
    );

   //all GROUPS with no role assigned to InquestPro
   router.get('/groupListNoRole',
        addon.authenticate(),
        (req, res, next) => {
            group.groupListWithoutRole(req, res);
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