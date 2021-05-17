//ENVIRONMENT CONFIG SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const customFilter = require('../controllers/custom_filter.ctrl');

    //Custom Filter Creation
    router.post('/create',
        addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFilter.create(req, res);
        }
    )

    //Custom Filter Update
    router.put('/update',
        addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFilter.update(req, res);
        }
    )

    //Custom Filter Listing
    router.get('/list',
        addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFilter.list(req, res);
        }
    )

    //Custom Filter delete
    router.put('/delete',
        addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFilter.delete(req, res);
        }
    )


    //Custom Filter Detail
    router.get('/detail',
        addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            customFilter.detail(req, res);
        }
    )


    return router;
}