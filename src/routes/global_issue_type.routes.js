//Global Issue Type sub routing
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const issueType = require('../controllers/global_issue_type.ctrl');

    //Add Issue type
    router.post('/',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            issueType.addIssueType(req, res);
        }
    );

    //update global issue type
    router.put('/',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            issueType.editIssueType(req, res);
        }
    );
    //GET issue type by ID
    router.get('/id',
        addon.authenticate(),
        [
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            issueType.getIssueTypeById(req, res);
        }
   );
    //GET issue type by ID
    router.get('/list',
       addon.authenticate(),
       [
           check('domain_id').not().isEmpty()
       ],
       (req, res, next) => {
           validator(req, res, next)
       },
       (req, res, next) => {
           issueType.getList(req, res);
       }
  );
    return router;
}