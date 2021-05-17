//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const {check, validationResult} = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const project = require('../controllers/project.ctrl');

    //ENABLE/DISABLE InquestPro project view
    router.get('/initialView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================initialView==================")
            console.log("==================================")
            project.getInitialView(req, res);
        }
    );

    //ENABLE/DISABLE InquestPro project view
    router.get('/issueView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================issueView==================")
            console.log("==================================")
            project.getIssueView(req, res);
        }
    );

    //ENABLE/DISABLE InquestPro project view
    router.get('/projectView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================projectView==================")
            console.log("==================================")
            project.getProjectView(req, res);
        }
    );

    //ENABLE/DISABLE InquestPro project view
    router.get('/globalprojectView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================projectView==================")
            console.log("==================================")
            project.getGlobalProjectView(req, res);
        }
    );

    //Configuration view
    router.get('/configurationView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================configurationView==================")
            console.log("==================================")
            project.getConfigurationView(req, res);
        }
    );

    //Configuration view
    router.get('/globalsettingView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================globalsettingView==================")
            console.log("==================================")
            project.getGlobalsettingView(req, res);
        }
    );

    //Test Cases view
    router.get('/testCasesView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================testCasesView==================")
            console.log("==================================")
            project.getTestCasesView(req, res);
        }
    );

    //Test Cycle view
    router.get('/testCycleView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================testCycleView==================")
            console.log("==================================")
            project.getTestCycleView(req, res);
        }
    );

    //Test Plan view
    router.get('/testPlanView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================testPlanView==================")
            console.log("==================================")
            project.getTestPlanView(req, res);
        }
    );

    //Report view
    router.get('/reportView', 
        addon.checkValidToken(),
        (req, res)=> {
            console.log("==================================")
            console.log("================reportView==================")
            console.log("==================================")
            project.getReportView(req, res);
        }
    );

    router.get('/inquestPro',
        addon.authenticate(),
        (req, res, next) => {
            project.getMainPage(req, res);
        }
    );

    //ENABLE/DISABLE InquestPro Project Creation
    router.post('/',
        (req, res, next) => {
            if(req.body.project)
                req.body['project_id'] = req.body.project.id;
            next()
        }, 
       addon.checkValidToken(),
        [
            check('project_id').not().isEmpty(),
            check('acct_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
        	project.createProject(req, res);
        }
    )

    //ENABLE/DISABLE InquestPro Project delete
    router.post('/deleted', 
        addon.authenticate(),
        (req, res, next) => {
            validator(req, res, next)
        }, 
        (req, res, next) => {
        project.deleteProject(req, res);
        }
    );

    //ENABLE/DISABLE InquestPro Project update
    router.put('/', 
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        }, 
        (req, res, next) => {
            project.updateProject(req, res);
        }
    );

    //USER ROLES to InquestPro
    router.get('/list',
        addon.authenticate(),
        (req, res, next) => {
            project.listProjects(req, res)
        }
    );
    //GET project by ID to InquestPro
    router.get('/id',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            project.getProjectById(req, res);
        }
    );
    //GET project by ID to InquestPro for other uers
    router.get('/idOtherUser',
        addon.authenticate(),
        [
            check('project_id').not().isEmpty(),
            check('acct_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            project.getProjectByIdUser(req, res);
        }
    );
     //Get the Region list of inquestPro
     router.get('/regionList',
     //addon.authenticate(),
     (req, res, next) => {
         project.regionList(req, res)
     }
 );
    return router;

}


// Backup
// function(req, res) {
//     var httpClient = addon.httpClient(req);
//         httpClient.get({
//             "headers": {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//         "url": "rest/api/2/user?accountId=557058:cf4361ff-0597-4de5-8880-9ddee2506699&expand=groups,applicationRoles"
//     },
//     function(err, response, body) {
//         if (err) { 
//             console.log(response.statusCode + ": " + err);
//             res.send("Error: " + response.statusCode + ": " + err);
//         }
//         else {
//             console.log(response.statusCode, body);
//             req.query['user_list'] = body;
//             project.getProjectView(req, res);
//         }
//     })
// }

