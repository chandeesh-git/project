//PROJECT-SETTINGS SUB-ROUTING ROUTES
var router = require('express').Router();
module.exports = function (app, addon) {
    const projectSettings = require('../src/controllers/project-settings');

    //ENABLE/DISABLE InquestPro for a project
    // router.post('/', addon.authenticate(), function(req, res) {
    // 	projectSettings.setProjectSetting(req, res);
    // });

    return router;
}