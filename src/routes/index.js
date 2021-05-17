module.exports = function(app, addon) {
    //Default route
    app.get('/', function(req, res) {
        res.format({
            'text/html': function() {
                res.redirect('/atlassian-connect.json');
            },
            'application/json': function() {
                res.redirect('/atlassian-connect.json');
            }
        });
      }
    );

    //Project Routes
    app.use('/project', require('./project.routes.js')(app, addon));

    //Issues Routes
    app.use('/issues', require('./issues.routes.js')(app, addon));

    //Testcases Routes
    app.use('/testcase', require('./testcase.routes.js')(app, addon));

    //Folder Routes
    app.use('/folder', require('./folder.routes.js')(app, addon));

    //TestPlan Routes
    app.use('/testplan', require('./testplan.routes.js')(app, addon));

    //User Routes
    app.use('/user', require('./user.routes.js')(app, addon));

    //Role Routes
    app.use('/role', require('./role.routes.js')(app, addon));

    //Group Routes
    app.use('/group', require('./group.routes.js')(app, addon));

    //TestCycle Routes
    app.use('/testcycle', require('./testcycle.routes.js')(app, addon));

    //TestExecution Routes
    app.use('/testexecution', require('./testexecution.routes.js')(app, addon));

    //User Role Routes
    app.use('/userRole', require('./user-role.routes.js')(app, addon));

    //User Group Routes
    app.use('/userGroup', require('./user-group.routes.js')(app, addon));

    //Evironment Config
    app.use('/environment', require('./environment_config.routes.js')(app, addon));

    //Label Config
    app.use('/label', require('./label_config.routes.js')(app, addon));

    //Dataset Config
    app.use('/dataset', require('./dataset_config.routes.js')(app, addon));

    //Status Config
    app.use('/configuration', require('./status_config_routes')(app, addon));

    //Field Type 
    app.use('/fieldType', require('./field_type.routes.js')(app, addon));

    //Custom Field Config
    app.use('/customField', require('./custom_field_config.routes.js')(app, addon));

    //Priority Config
    app.use('/priority', require('./priority_config.routes.js')(app, addon));

    //Component Config
    app.use('/component', require('./component_config.routes.js')(app, addon));

    //Global Env config
    app.use('/globalEnv', require('./global_environment_config.routes.js')(app, addon));

    //Global dataset config
    app.use('/globalDataset', require('./global_dataset_config.routes.js')(app, addon));

    //Global label config
    app.use('/globalLabel', require('./global_label_config.routes.js')(app, addon));

    //Global priority config
    app.use('/globalPriority', require('./global_priority_config.routes.js')(app, addon));

    //Global status config
    app.use('/globalStatus', require('./global_status_config.routes.js')(app, addon));

    //Global custom field config
    app.use('/globalCustomField', require('./global_custom_field.routes.js')(app, addon));

    //Global component config
    app.use('/globalComponent', require('./global_component_config.routes.js')(app, addon));

    /**  App setting Global  */

    //Global Role
    app.use('/globalRole', require('./global_role.routes.js')(app, addon));

    //Global Group
    app.use('/globalGroup', require('./global_group.routes.js')(app, addon));

    //Global User Group
    app.use('/globalUserGroup', require('./global_user_group.routes.js')(app, addon));

    //Global User Role
    app.use('/globalUserRole', require('./global_user_role.routes.js')(app, addon));

    //Global Issue Type
    app.use('/globalIssueType', require('./global_issue_type.routes.js')(app, addon));

    //Report Routes
    app.use('/report', require('./report.routes.js')(app, addon));

    //Custom Filter Routes
    app.use('/customFilter', require('./custom_filter.routes.js')(app, addon));

};