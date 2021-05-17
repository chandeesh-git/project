let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let mongodbConfig = require('../db/mongoose_models/config/config_detail');
let dbConfig = require('../db/sequelize_models/config/config_detail');
require('../db/mongoose_models/testIndex')
let controllers = require('../src/controllers/testexecution.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
var fs = require('fs');
var FormData = require('form-data');
const MockExpressRequest = require('mock-express-request');
if((dbConfig.db_name === dbConfig.test_db_name) && mongodbConfig.test_utdb_url){

let testcycleID;
let accountID;
let projectID;
let domainID;
    /**
     * Test for adding test execution
     */
    describe('POST /testexecution', function(){
        req = {
            body: '',
        }
        it('It should add testexecution with testcycle', function(done){
            let res;
            var form = new FormData();
            let dateDate = new Date();
            let activity_log = [
                {"status":"Pass","status_color":"#3ABB4B", "tested_by":"Roshni Bhengra","detail":"test detail"},
                {"status":"In Progress","status_color":"#FFA900", "tested_by":"Roshni Bhengra","detail":"test detail"}
            ]
            let testData = {
                "testcase_id":37,
                "execution_issues":[
                    {"issue_id":1,"issue_type":"Story","issue_name":"test story","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"Highest"},
                    {"issue_id":2,"issue_type":"Bug","issue_name":"test story","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"High"},
                ],
                "execution_attachment":[],
                "testcycle_id":"6027ef5f4bca7e0468ef41bf",
                "last_execution":dateDate,
                "name":"login test6",
                "acct_id":"r.bhengra@thesynapses.com",
                "project_id":101,
                "domain_id":"jira.com",
                "folder_id":"8",
                "description":"desc9 ",
                "precondition":"none",
                "executed_by":"Roshni",
                "status":"Approved",
                "execution_status":"Pass",
                "priority":"High",
                "component":"None",
                "estimated_time":"2",
                "folder_name":"MMtest",
                "environment":"Development",
                "label":"label test",
                "testscript_type":"",
                "testscript":"",
                "test_data":"",
                "parameters":"",
                "weblinks":"",
                "lock":false,
                "customFields":"cf1",
                "submit_status":true,
                "is_active":true,
                "version":"1.0",
                "activity_log":JSON.stringify(activity_log)
            }


            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testData));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
              });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result);
                const response = {
                    status:200,
                    message:message.TEST_EXECUTED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addTestExecution(req, res);
        })

        it('It should add testexecution without testcycle', function(done){
            let res;
            var form = new FormData();
            let dateData = new Date();
            let activity_log = [{"status":"Pass","status_color":"#3ABB4B", "tested_by":"Roshni Bhengra","detail":"test detail"}]
            let testData = {
                "testcase_id":6,
                "testcycle_id":"",
                "execution_issues":[{"issue_id":3,"issue_type":"Task","issue_name":"test task","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"Highest"}],
                "execution_attachment":[],
                "last_execution": dateData,
                "name":"login test3",
                "acct_id":"r.bhengra@thesynapses.com",
                "project_id":101,
                "domain_id":"jira.com",
                "folder_id": null,
                "description":"desc9 ",
                "precondition":"none",
                "executed_by":"Roshni",
                "status":"Approved",
                "execution_sttaus":"Pass",
                "priority":"Medium",
                "component":"None",
                "estimated_time":"2",
                "folder_name":"",
                "environment":"Development",
                "label":"label test",
                "testscript_type":"",
                "testscript":"",
                "test_data":"",
                "parameters":"",
                "weblinks":"",
                "lock":false,
                "customFields":"cf1",
                "submit_status":true,
                "is_active":true,
                "version":"1.0",
                "activity_log":JSON.stringify(activity_log)
            }
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testData));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
            });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result);
                const response = {
                    status:200,
                    message:message.TEST_EXECUTED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addTestExecution(req, res);
        })

        it('It should add testexecution without testcycle but response insufficient access', function(done){
            let res;
            var form = new FormData();
            let dateData = new Date();
            let testData = {
                "testcase_id":6,
                "testcycle_id":"",
                "execution_issues":[{"issue_id":3,"issue_type":"Task","issue_name":"test task","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"Highest"}],
                "execution_attachment":[],
                "last_execution": dateData,
                "name":"login test3",
                "acct_id":"",
                "project_id":101,
                "domain_id":"jira.com",
                "folder_id": null,
                "description":"desc9 ",
                "precondition":"none",
                "executed_by":"Roshni",
                "status":"Approved",
                "execution_sttaus":"Pass",
                "priority":"Medium",
                "component":"None",
                "estimated_time":"2",
                "folder_name":"",
                "environment":"Development",
                "label":"label test",
                "testscript_type":"",
                "testscript":"",
                "test_data":"",
                "parameters":"",
                "weblinks":"",
                "lock":false,
                "customFields":"cf1",
                "submit_status":true,
                "is_active":true,
                "version":"1.0"
            }
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testData));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
            });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result);
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addTestExecution(req, res);
        })

        it('It should response db error if no details found', function(done){
            let res;
            req.body = {}
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result);
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
            controllers.addTestExecution(req, res);
        })
    })

    /**
     * update testcycle
     */
    describe('PUT /testexecution', function(){
        req = {
            body: '',
        }
        it('It should update testexecution without testycle records', function(done){
            let res;
            var form = new FormData();
            let dateData = new Date();
            let activity_log = [{"status":"Pass","status_color":"#3ABB4B", "tested_by":"Roshni Bhengra","detail":"test detail"}]
            let testData = {
                "testexecution_id":"6023c225c44ebd0b3003aec4",
                "testcase_id":17,
                "testcycle_id":"",
                "execution_issues":[{"issue_id":3,"issue_type":"Task","issue_name":"test task","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"Highest"}],
                "execution_attachment":[],
                "last_execution":dateData,
                "name":"login test3",
                "acct_id":"r.bhengra@thesynapses.com",
                "project_id":101,
                "domain_id":"jira.com",
                "folder_id":"1",
                "description":"desc9 ",
                "precondition":"none",
                "executed_by":"Roshni",
                "status":"Approved",
                "execution_staus":"Pass",
                "priority":"Medium",
                "component":"None",
                "estimated_time":"2",
                "folder_name":"",
                "environment":"Development",
                "label":"label test",
                "testscript_type":"",
                "testscript":"",
                "test_data":"",
                "parameters":"",
                "weblinks":"",
                "lock":false,
                "customFields":"cf1",
                "submit_status":true,
                "is_active":true,
                "version":"1.0",
                "activity_log":JSON.stringify(activity_log)
            }
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testData));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
            });
                
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TEST_EXECUTED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateTestExecution(req, res);
        })

        it('It should update testexecution with testycle records', function(done){
            let res;
            var form = new FormData();
            let dateData = new Date();
            let activity_log = [{"status":"Pass","status_color":"#3ABB4B", "tested_by":"Roshni Bhengra","detail":"test detail"}]
            let testData = {
                "testexecution_id":"6023c225c44ebd0b3003aec4",
                "testcase_id":37,
                "execution_issues":[{"issue_id":3,"issue_type":"Task","issue_name":"test task","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"Highest"}],
                "testcycle_id":"6027ef5f4bca7e0468ef41bf",
                "execution_attachment":[],
                "last_execution":dateData,
                "name":"login test3",
                "acct_id":"r.bhengra@thesynapses.com",
                "project_id":101,
                "domain_id":"jira.com",
                "folder_id":"8",
                "description":"desc9 ",
                "precondition":"none",
                "executed_by":"Roshni",
                "status":"Approved",
                "execution_staus":"Pass",
                "priority":"Medium",
                "component":"None",
                "estimated_time":"2",
                "folder_name":"test",
                "environment":"Development",
                "label":"label test",
                "testscript_type":"",
                "testscript":"",
                "test_data":"",
                "parameters":"",
                "weblinks":"",
                "lock":false,
                "customFields":"cf1",
                "submit_status":true,
                "is_active":true,
                "version":"1.0",
                "activity_log":JSON.stringify(activity_log)
            }
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testData));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
            });
                
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TEST_EXECUTED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateTestExecution(req, res);
        })

        it('It should update testexecution with testycle records', function(done){
            let res;
            var form = new FormData();
            let dateData = new Date()
            let testData = {
                "testexecution_id":"6023c225c44ebd0b3003aec4",
                "testcase_id":37,
                "execution_issues":[{"issue_id":3,"issue_type":"Task","issue_name":"test task","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"Highest"}],
                "testcycle_id":"6027ef5f4bca7e0468ef41bf",
                "execution_attachment":[],
                "last_execution":dateData,
                "name":"login test3",
                "acct_id":"",
                "project_id":101,
                "domain_id":"jira.com",
                "folder_id":"8",
                "description":"desc9 ",
                "precondition":"none",
                "executed_by":"Roshni",
                "status":"Approved",
                "execution_staus":"Pass",
                "priority":"Medium",
                "component":"None",
                "estimated_time":"2",
                "folder_name":"test",
                "environment":"Development",
                "label":"label test",
                "testscript_type":"",
                "testscript":"",
                "test_data":"",
                "parameters":"",
                "weblinks":"",
                "lock":false,
                "customFields":"cf1",
                "submit_status":true,
                "is_active":true,
                "version":"1.0"
            }
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testData));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
            });
                
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateTestExecution(req, res);
        })

        it('It should res db querye error if no valid details found', function(done){
            let res;
            req.body = {}
            res = {
                json(result) {
                result = result.res;
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
            controllers.updateTestExecution(req, res);
        })
    })

    /**
     * Test the run details
     */
    describe('GET /testexecution/runDetails', function () {
        let req = {
            body:''
        };
        it('it should list all execution List',function (done) {
            let res;
            req.query = {
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                domain_id: "jira.com",
                testcycle_id: "6027a8cb892c9f3d2cf84d50",
                testcase_id: 6,
                version: "1.0"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.TESTCASE_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.runDetails(req,res)
        })

        it('it should res db query error details entered not found',function (done) {
            let res;
            req.query = {}
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.runDetails(req,res)
        })

        it('it should res invalid details entered not found',function (done) {
            let res;
            req.query = {
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                domain_id: "jira.com",
                testcycle_id: "",
                testcase_id: "",
                version: ""
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:401,
                    message:message.INVALID_DETAILS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.runDetails(req,res)
        })

        it('it should check not allowed to user',function (done) {
            let res;
            req.query = {
                project_id: 101,
                acct_id: "",
                domain_id: "jira.com",
                testcycle_id: "",
                testcase_id: "",
                version: ""
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.runDetails(req,res)
        })
    })

    /**
     * Test the run test list
     */
    describe('GET /testexecution/runTestList', function () {
        let req = {
            body:''
        };
        it('it should run test details',function (done) {
            let res;
            req.query = {
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                domain_id: "jira.com",
                testcycle_id: "60264a7564f7aa34a4bb8c24"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.TESTCASE_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.runTestList(req,res)
        })
        
        it('it should res db error testcycle details not found',function (done) {
            let res;
            req.query = {
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                domain_id: "jira.com",
                testcycle_id: "60210fd8312e613bec320a59"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.runTestList(req,res)
        })
        //  /**
        //  * check not added in the main api
        //  */
        // it('it should run testcase details and show INSUFFICIENT_ACCESS if user not found',function (done) {
        //     let res;
        //     req.query = {
        //         // project_id: 101,
        //         acct_id: "",
        //         domain_id: "jira.com",
        //         testcycle_id: "60264a7564f7aa34a4bb8c24"
        //     }
        //     res = {
        //         json(result) {
        //         result = result.res;
        //         console.log("result==>",result)
        //         const response = {
        //             status:401,
        //             message:message.INSUFFICIENT_ACCESS,
        //         }
        //         expect(result.status).to.equal(response.status)
        //         expect(result.message).to.equal(response.message)
        //         expect(result.data).to.not.equal(null)
        //         done();
        //         },
        //     }
        //     controllers.runTestList(req,res)
        // })
    })
    /**
     * Test the tester list
     */
    describe('GET /testexecution/listTesters', function () { 
        let req = {
            body:''
        };
        it('it should list Testers',function (done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                user: "r.bhengra@thesynapses.com",
                test_type:"testcase"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listTesters(req,res)
        })

        it('it should response db query error ',function (done) {
            let res;
            req.query = {
                // project_id: 101,
                user: "r.bhengra@thesynapses.com",
                test_type:"testcase"
            }
            res = {
                json(result) {
                result = result.res;
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
            controllers.listTesters(req,res)
        })
    })

    /**
     * Test the new execution
     */
    describe('GET /testexecution/newExecution', function () {
        let req = {
            body:''
        };
        it('it should add newExecution with testcycle id', function(done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcycle_id: "6027a8cb892c9f3d2cf84d50",
                testcase_id: 6,
                version: "1.0"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result",result);
                const response = {
                    status:200,
                    message:message.TESTCASE_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.newExecution(req,res)
        })

        it('it should add newExecution without testcycle id', function(done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: 6,
                version: "1.0"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result",result);
                const response = {
                    status:200,
                    message:message.TESTCASE_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.newExecution(req,res)
        })
        it('it should res invalid if details not found',function (done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcycle_id:"6022d4f9bcbfb92c84585482",
                testcase_id: 2,
                version: 1.0
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:401,
                    message:message.INVALID_DETAILS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.newExecution(req,res)
        })

        it('it should res access not allowed',function (done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "",
                testcycle_id:"6022d4f9bcbfb92c84585482",
                testcase_id: 17,
                version:"1.0"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.newExecution(req,res)
        })

        it('it should res db query error',function (done) {
            let res;
            req.query = {
                domain_id: "jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcycle_id:"6022d4f9bcbfb92c84585482",
                testcase_id: 17,
                version:"1.0"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.newExecution(req,res)
        })
    })

    /**
     * Test the testcase details api
     */
    describe('GET /testexecution/testcaseDetails', function () {
        let req = {
            body:''
        };
        it('it should list testcase details ',function (done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id:37,
                version:"1.0",
                environment:"Development"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.TESTCASE_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testcaseDetails(req,res)
        })

        it('it should list testcase details ',function (done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id:17,
                version:"1.0",
                environment:"Development"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.TESTCASE_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testcaseDetails(req,res)
        })

        it('it should res not access allowed',function (done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "",
                testcase_id:"3",
                version:"1.0",
                environment:"Development"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testcaseDetails(req,res)
        })

        it('it should res invalid details or db query error',function (done) {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: 6,
                version:"1.0"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.testcaseDetails(req,res)
        })

        it('it should res db query error if not details send',function (done) {
            let res;
            req.query = {}
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.testcaseDetails(req,res)
        })
    })
}
