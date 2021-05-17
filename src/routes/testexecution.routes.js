//TESTCYCLE SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const testexecution = require('../controllers/testexecution.ctrl');

    router.post('/',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty(),
            check('testcases').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.add(req, res);
        }
    );
    router.put('/',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('testexecution_id').not().isEmpty(),
            check('update').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next);
        },
        (req, res, next) => {
            testexecution.update(req, res);
        }
    );
    router.get('/list',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty(),
            check('testcase_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.list(req, res);
        }
    );
    router.get('/runDetails',
        // addon.authenticate(), 
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.runDetails(req, res);
        }
    );

    router.get('/runTestList',
        // addon.authenticate(), 
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.runTestList(req, res);
        }
    );

    router.post('/add',
        //addon.authenticate(),
        (req, res, next) => {
            testexecution.addTestExecution(req, res);
        }
    );

    router.put('/update',
        addon.authenticate(),
        (req, res, next) => {
            testexecution.updateTestExecution(req, res);
        }
    );

    //list Testers
    router.get('/listTesters',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('test_type').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.listTesters(req, res);
        }
    );
    router.get('/newExecution',
        // addon.authenticate(), 
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.newExecution(req, res);
        }
    );

    router.get('/testcaseDetails',
        // addon.authenticate(), 
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty(),
            check('version').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.testcaseDetails(req, res);
        }
    );

    router.get('/executionDetailsReport',
        addon.authenticate(), 
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testexecution.issueDetails(req, res);
        }
);

    return router;
}