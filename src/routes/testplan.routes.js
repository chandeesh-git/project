//TESTPLAN SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const testplan = require('../controllers/testplan.ctrl');

    //Create a testplan
    router.post('/', 
        addon.authenticate(), 
        (req, res, next) => {
        	testplan.add(req, res);
        }
    );

    //testplan details view by ID
    router.get('/id', 
        addon.authenticate(), 
        [   
            check('testplan_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testplan.testplanDetailById(req, res);
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
            testplan.list(req, res);
        }
    );

    router.delete('/', 
        addon.authenticate(), 
        [   
            check('project_id').not().isEmpty(),
            check('testplan_id').not().isEmpty(),
            check('domain_id').not().isEmpty(),

        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testplan.delete(req, res);
        }
    );

    router.put('/', 
        addon.authenticate(), 
        (req, res, next) => {
            testplan.update(req, res);
        }
    );

    router.get('/cycleList', 
        addon.authenticate(), 
        [   
            check('acct_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            testplan.cycleList(req, res);
        }
    );
      //testplan history api
      router.get('/history', 
      addon.authenticate(), 
      [   
          check('testplan_id').not().isEmpty(),
          check('project_id').not().isEmpty(),
          check('domain_id').not().isEmpty(),
      ],
      (req, res, next) => {
          validator(req, res, next)
      },
      (req, res, next) => {
          testplan.history(req, res);
      }
  );
    return router;
}