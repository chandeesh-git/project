//TESTCASE SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const testcase = require('../controllers/testcase.ctrl');

    //Create a testcase
    router.post('/',
        addon.authenticate(),
        (req, res, next) => {
            testcase.add(req, res);
        }
    );

    router.get('/id',
       // addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.detail(req, res);
        }
    );

    router.get('/list',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.list(req, res);
        }
    );

    router.delete('/',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.delete(req, res);
        }
    );

    router.put('/',
        addon.authenticate(),
        (req, res, next) => {
            testcase.update(req, res);
        }
    );

    //list Owner
    router.get('/listOwner',
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
            testcase.listOwner(req, res);
        }
    );

    //Clone test case
    router.post('/clone',
        addon.authenticate(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.cloneTestCase(req, res);
        }
    );

    //  version list
    router.get('/versionList',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.versionList(req, res);
        }
    );

    //list Owner
    router.get('/search',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('test_type').not().isEmpty(),
            check('user').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.search(req, res);
        }
    );

    //  testcase History
    router.get('/history',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.testcaseHistory(req, res);
        }
    );

    //Import test case data
    router.post('/importData',
        addon.authenticate(),
        (req, res, next) => {
            testcase.importTestcase(req, res);
        }
    );

    //testcase details compare version details/history api
    router.post('/compareVersion',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('user').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.testcaseVersionCompare(req, res);
        }
    );
    //  testcase Export File
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
            testcase.exportFile(req, res);
        }
    );
    //  show logs 
    router.get('/showLogs',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcase_id').not().isEmpty(),
            check('version').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.showLogs(req, res);
        }
    );
    //Bulk test case create 
    router.post('/bulkCreate',
        //addon.authenticate(), 
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            //  check('name').not().isEmpty(),
            check('status').not().isEmpty(),
            check('priority').not().isEmpty(),
            check('owner').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.bulkCreate(req, res);
        }
    );
    //  show logs 
    router.get('/issueDetails',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('issue_id').not().isEmpty(), 
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testcase.issueDetails(req, res);
        }
    );

     //  show Execution list of test case with env and version specific
     router.get('/executionList',
     addon.authenticate(),
     [
         check('project_id').not().isEmpty(),
         check('domain_id').not().isEmpty(),
         check('testcase_id').not().isEmpty(),
     ],
     (req, res, next) => {
         validator(req, res, next)
     },
     (req, res, next) => {
         testcase.executionList(req, res);
     }
 );
    return router;
}