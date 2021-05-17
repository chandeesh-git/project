//GLOBAL USER-GROUP SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');

module.exports = function (app, addon) {
    const userGroup = require('../controllers/global_user_group.ctrl'); 
    //post USER GROUP 
    router.post('/',
        addon.authenticate(),
        [
            check('user_name').not().isEmpty(),
            check('group_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            userGroup.addUsersToGroup(req, res);
        }
    );

    //USER GROUP update to InquestPro
    router.put('/',
       addon.authenticate(),
       [
           check('user').not().isEmpty(),
           check('id').not().isEmpty(),
       ],
       (req, res, next) => {
           validator(req, res, next)
       },
       (req, res, next) => {
        userGroup.editUserGroup(req, res);
       }
   );

    // delete USER to GROUP 
    router.delete('/',
        addon.authenticate(),
        [
            check('group_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            userGroup.deleteUserGroup(req, res)
        }
    );

    //Active USER GROUP list
    router.get('/listActive',
        addon.authenticate(),
        (req, res, next) => {
            userGroup.userGroupActiveList(req, res)
        }
    );

    return router;
}