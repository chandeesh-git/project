//STATUS SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const report = require('../controllers/report.ctrl');

    //Get the test cycle execution report list
    router.get('/list',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.list(req, res);
        }
    );

    //Get the test cycle filter list based on env and dates 
    router.get('/testCycleList',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.testCycleList(req, res);
        }
    );

    //Get the test cycle execution report detail 
    router.get('/detail',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.detail(req, res);
        }
    );

    //Get the test cycle execution -issue priority count of different component
    router.get('/defectDistribution',
        //addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.defectDistribution(req, res);
        }
    );

    //Get the 
    router.get('/testcaseReport',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.testcaseReport(req, res);
        }
    );

    //Get the activity  logs for live statistics
    router.get('/activityLogs',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.activityLogs(req, res);
        }
    );

    //Get the execution status for live statistics
    router.get('/executionStatus',
       // addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.executionStatus(req, res);
        }
    );

    //Get the test cycle execution report list
    router.get('/exportExecutionList',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.exportExecutionList(req, res);
        }
    );

    //Get the report csv export of test execution status in test cycle 
    router.get('/exportExecutionStatus',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.exportExecutionStatus(req, res);
        }
    );

    //Get the report csv export of test execution detail in test cycle 
    router.get('/exportExecutionDetail',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
            check('testcycle_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.exportExecutionDetail(req, res);
        }
    );

    //Get the report csv export of test execution detail in test cycle 
    router.get('/exportTraceabilityReport',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.exportTraceabilityReport(req, res);
        }
    );

    //Get the report csv export of test execution live statistics
    router.get('/exportLiveStatistics',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.exportLiveStatistics(req, res);
        }
    );

    //Get the report csv export of most failed and executed test case 
    router.get('/exportMostExecuted',
         addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            report.exportMostExecuted(req, res);
        }
    );


    return router;
}