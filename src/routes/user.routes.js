//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const user = require('../controllers/user.ctrl');


    //GET USER ACCESS
    router.get('/access',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            user.getUserAccess(req, res);
        }
    );

        //USER ACCESS to InquestPro
    router.post('/groupAccess',
        addon.authenticate(),
        [
            check('groups').not().isEmpty(),
            check('acct_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            user.addGroupAccess(req, res);
        }
    );

    return router;
}