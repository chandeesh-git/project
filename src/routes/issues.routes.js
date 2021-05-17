//ISSUE SUB-ROUTING ROUTES
var router = require('express').Router();
module.exports = function (app, addon) {
    const issue = require('../controllers/issue.ctrl');

    //ENABLE/DISABLE InquestPro project view
    router.post('/created', addon.authenticate(), function(req, res) {
        console.log("issue created");
    	issue.created(req, res);
    });

    router.post('/deleted', addon.authenticate(), function(req, res) {
    	console.log("issue deleted");
    	issue.deleted(req, res);
    })
    return router;
}