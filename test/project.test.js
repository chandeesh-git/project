let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/project.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){
/**
 * test create project
 */
var projectID;
var accountID;
var projectId;
var domainID;
    describe('POST /project', function(){
        req = {
           body : ''
        }
        it('It should POST a new project if no duplicate entry available', function(done){
            let res;
            req.body = {
                project_id: 118,
                domain_id: "test.com",
                acct_id: 'r.bhengra@thesynapses.com',
                inquestPro_enabled: 1,
                permission_status: 1,
                story_enabled : 1,
                task_enabled : 1,
                bug_enabled : 1,
                epic_enabled : 1,
                subtask_enabled : 1
            };
            req.query = {
                user_name:"Roshni Bhengra"
            }
            res = {
                json(result) {
                result = result.res
                console.log("result==>",result)
                projectID = result.data.project_id;
                accountID = result.data.acct_id;
                domainID = result.data.domain_id;
                projectId = result.data.id;
                const response = {
                    status:200,
                    message:message.PROJECT_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createProject(req, res);
        })

        it('It should return project already exist duplicate entry available', function(done){
            let res;
            req.body = {
                project_id: projectID,
                domain_id: 'test.com',
                acct_id: 'r.bhengra@thesynapses.com',
                inquestPro_enabled: 1,
                permission_status: 1,
                story_enabled : 1,
                task_enabled : 1,
                bug_enabled : 1,
                epic_enabled : 1,
                subtask_enabled : 1
            };
            req.query = {
                user_name :"Roshni Bhengra"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.PROJECT_EXIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createProject(req, res);
        })

        it('It should return db error entry available', function(done){
            let res;
            req.body = {}
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createProject(req, res);
        })
    })

 /**
 * Test to list Project By ID 
 */
    describe('GET /project by ID', () => {
        it('It should list the project with ID entered', (done) =>{
            let res;
            req.query = {
                project_id: projectID,
                acct_id: accountID,
                domain_id: domainID
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.PROJECT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectById(req, res);
        })
        it('If project ID not found', (done) =>{
            let res;
            req.query = {
                project_id: 120,
                acct_id:'r.bhengra@thesynapses.com',
                domain_id: 'xyz.com'
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.ID_NOT_FOUND,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectById(req, res);
        })

        it('It should response db error if no details foound', (done) =>{
            let res;
            req.query = {}
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectById(req, res);
        })
    })

    /**
     * Test to list Project By ID 
     */
    describe('GET /project by ID other user', () => {
        it('It should list the project with ID entered', (done) =>{
            let res;
            req.query = {
                project_id: projectID,
                acct_id: accountID,
                domain_id: domainID
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.PROJECT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectByIdUser(req, res);
        })
        it('If project ID not found', (done) =>{
            let res;
            req.query = {
                project_id: 120,
                acct_id:'r.bhengra@thesynapses.com',
                domain_id: 'xyz.com'
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.ID_NOT_FOUND,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectByIdUser(req, res);
        })

        it('It should response db error if no details foound', (done) =>{
            let res;
            req.query = {}
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectByIdUser(req, res);
        })
    })
    /**
     * test update project
     */

    describe('PUT /updateProject', function(){
        req = {
            body: ''
        }
        it('It should update project', function(done){
            let res;
            req.body = {
                project_id: projectID,
                acct_id: 'r.bhengra@thesynapses.com',
                domain_id: "jira.com",
                inquestPro_enabled: 1,
                permission_status: 1,
                story_enabled : 1,
                task_enabled : 1,
                bug_enabled : 1,
                epic_enabled : 0,
                subtask_enabled : 0
            };
            sql_conn.statusConfigModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("status config deleted================>done",domainID);

            sql_conn.priorityConfigModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("priority config deleted================>done",domainID);

            sql_conn.componentConfigModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("component config deleted================>done",domainID);

            sql_conn.environmentConfigModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("environment config deleted================>done",domainID);

            sql_conn.labelConfigModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("label config deleted================>done",domainID);

            sql_conn.customFieldConfigModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("custom field config deleted================>done",domainID);
            sql_conn.datasetConfigModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("dataset config deleted================>done",domainID);

            sql_conn.roleModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("role config deleted================>done",domainID);

            sql_conn.groupModel.destroy({
                where: {
                    'domain_id': domainID
                }
            }).catch(console.error);
            console.log("role config deleted================>done",domainID);

            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.PROJECT_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateProject(req, res);
        })
        it('It should return invalid if project not found', function(done){
            let res;
            req.body = {
                project_id: 1005,
                acct_id: 'r.bhengra@thesynapses.com',
                domain_id: "jira.com",
                inquestPro_enabled: 1,
                permission_status: 1,
                story_enabled : 1,
                task_enabled : 1,
                bug_enabled : 1,
                epic_enabled : 1,
                subtask_enabled : 1
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateProject(req, res);
        })
    })
/**
 * Test to list all Projects
 */
    describe('GET /projects', () => {
        it('It should list all the projects', (done) =>{
            let res;
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.PROJECT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listProjects(req, res);
        })

        it('It should res db error if no details found', (done) =>{
            let res;
            req.body = {}
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listProjects(req, res);
        })
    })

    /**
     * Test projectIssueView
     */
    describe('GET /project/projectIssueView', () => {
        req = {
           body : ''
        }
        it('It should projectIssueView', (done) =>{
            let res;
            req.query = {
                project_id:101,
                domain_id:"jira.com",
                issue_id:1
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getIssueView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = {}
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getIssueView(req, res);
        })
    })


    /**
     * Test projectIssueView
     */
    describe('GET /project/getProjectView', () => {
        req = {
           body : ''
        }
        it('It should getProjectView', (done) =>{
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = {
                projectId:101,
                projectKey:"",
                selectedFolderId:null
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getProjectView(req, res);
        })
    })

    /**
     * Test getGlobalProjectView
     */
    describe('GET /project/getGlobalProjectView', () => {
        req = {
           body : ''
        }
        it('It should getGlobalProjectView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getGlobalProjectView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getGlobalProjectView(req, res);
        })
    })

    /**
     * Test getConfigurationView
     */
    describe('GET /project/getConfigurationView', () => {
        req = {
           body : ''
        }
        it('It should getConfigurationView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getConfigurationView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getConfigurationView(req, res);
        })
    })

    /**
     * Test getGlobalsettingView
     */
    describe('GET /project/getGlobalsettingView', () => {
        req = {
           body : ''
        }
        it('It should getGlobalsettingView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getGlobalsettingView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getGlobalsettingView(req, res);
        })
    })

    /**
     * Test getTestCasesView
     */
    describe('GET /project/getTestCasesView', () => {
        req = {
           body : ''
        }
        it('It should getTestCasesView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getTestCasesView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getTestCasesView(req, res);
        })
    })

    /**
     * Test getTestCycleView
     */
    describe('GET /project/getTestCycleView', () => {
        req = {
           body : ''
        }
        it('It should getTestCycleView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getTestCycleView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getTestCycleView(req, res);
        })
    })

    /**
     * Test getTestPlanView
     */
    describe('GET /project/getTestPlanView', () => {
        req = {
           body : ''
        }
        it('It should getTestPlanView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getTestPlanView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getTestPlanView(req, res);
        })
    })

    /**
     * Test getReportView
     */
    describe('GET /project/getReportView', () => {
        req = {
           body : ''
        }
        it('It should getReportView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getReportView(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getReportView(req, res);
        })
    })

    /**
     * Test getReportView
     */
    describe('GET /project/mainPage', () => {
        req = {
           body : ''
        }
        it('It should getReportView', (done) => {
            let res;
            req.query = {
                projectId:""
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getMainPage(req, res);
        })

        it('It should res db error if no details found', (done) => {
            let res;
            req.body = { }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getMainPage(req, res);
        })
    })

    /**
     * Test to delete project by ID
     */
    describe('DELETE /project', () => {
        it('It should delete the project', (done) => {
            let res;
            req.query = {
                projectId: projectId
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.PROJECT_DELETED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteProject(req, res);
        })

        it('It should return query error if ID not found', (done) => {
            let res;
            req.query = {
                projectId: 2000
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.ID_NOT_FOUND,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteProject(req, res);
        })

        it('It should return query error if ID not found', (done) => {
            let res;
            req.query = {};
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:500,
                    message:message.DB_ERROR,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteProject(req, res);
        })
    })
}