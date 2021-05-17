//TESTCYCLE SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const testcycle = require('../controllers/testcycle.ctrl');

    //Create a testcase
    router.post('/',
        addon.authenticate(),
        (req, res, next) => {
            testcycle.add(req, res);
        }
    );

    //Get Testcycle by ID 
    router.get('/id',
        addon.authenticate(),
        [
            check('testcycle_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.testcycleDetailById(req, res);
        }
    );

    router.get('/listTestcase',
        //addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.listTestcase(req, res);
        }
    );

    router.delete('/',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.delete(req, res);
        }
    );

    router.put('/',
        addon.authenticate(),
        (req, res, next) => {
            testcycle.update(req, res);
        }
    );

    router.post('/testcases',
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
            testcycle.addTestCases(req, res);
        }
    );

    //Clone test cycle
    router.post('/clone',
        addon.authenticate(),
        [
            check('user').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.cloneTestCycle(req, res);
        }
    );

    //Get Test Plan List API 
    router.get('/planList',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.planList(req, res);
        }
    );

    //Get Test cycle history API
    router.get('/history',
        addon.authenticate(),
        [
            check('testcycle_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.history(req, res);
        }
    );

    //Import test cycle data
    router.post('/importData',
        addon.authenticate(),
        (req, res, next) => {
            testcycle.importTestcycle(req, res);
        }
    );

    //  testcycle Export File
    router.post('/exportFile',
        //addon.authenticate(), 
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.exportFile(req, res);
        }
    );

    // version data
    router.get('/versionDetail',
        //addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty(),
            check('version').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcycle.versionDetail(req, res);
        }
    );
    return router;
}