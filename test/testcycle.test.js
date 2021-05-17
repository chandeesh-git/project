let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let mongodbConfig = require('../db/mongoose_models/config/config_detail');
let dbConfig = require('../db/sequelize_models/config/config_detail');
require('../db/mongoose_models/testIndex')
let controllers = require('../src/controllers/testcycle.ctrl');
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
     * Create testcycle
     */
    describe('POST /testcycle', function(){
        req = {
            body: ''
        }
        it('It should create testcycle records', function(done){
            let res;
            var form = new FormData();
            let dataDate = new Date();
            console.log("dataDate=====>",dataDate);
            let issuesData = [
                {
                "issue_id":2,
                "issue_type":"Bug",
                "issue_name":"test bug",
                "issue_key":"TEST",
                "issue_status":"new_issues",
                "test_type":"testcycle",
                "issue_priority":"High"
                }
            ]
            let testcaseData =  [
                {
                "testcase_id":6,
                "doc_id":"602270941284704848ee1003",
                "tester":"r.bhengra@thesynapses.com",
                "version":"1.0"
                },
                {
                    "testcase_id":11,
                    "doc_id":"602274c872e1ec2190854549",
                    "tester":"r.bhengra@thesynapses.com",
                    "version":"1.0"
                },
                {
                    "testcase_id":12,
                    "doc_id":"602275677499a81a8ce14917",
                    "tester":"r.bhengra@thesynapses.com",
                    "version":"1.0"
                }
            ]
            // var filePath = "Pictures/single.PNG"
            let testcycle = {
                name: "testcycle test1",
                acct_id: "r.bhengra@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "testcycle test1",
                version: "1.0",
                status: "Approved",
                owner: "Roshni Bhengra",
                environment: "Development",
                planned_start_date: dataDate,
                planned_end_date: dataDate,
                folder_name: "",
                weblinks: "",
                issues: issuesData,
                testcases: testcaseData,
                testplans: ["602fffbd3eded72080fa03ae"],
                submit_status: true
            };
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcycle));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
              });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                testcycleID = result.data.id;
                accountID = result.data.created_by,
                projectID = result.data.project_id,
                domainID = result.data.domain_id
                const response = {
                    status:200,
                    message:message.TEST_CYCLE_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.add(req, res);
        })
        it('It should response insufficient access if not valid user', function(done){
            let res;
            var form = new FormData();
            let dataDate = new Date();
            console.log("dataDate=====>",dataDate);
            let issuesData = [
                {
                "issue_id":2,
                "issue_type":"Bug",
                "issue_name":"test bug",
                "issue_key":"TEST",
                "issue_status":"new_issues",
                "test_type":"testcycle",
                "issue_priority":"High"
                }
            ]
            let testcaseData =  [
                {
                "testcase_id":6,
                "doc_id":"602270941284704848ee1003",
                "tester":"r.bhengra@thesynapses.com",
                "version":"1.0"
                }
            ]
            // var filePath = "Pictures/single.PNG"
            let testcycle = {
                name: "testcycle test1",
                acct_id: "",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "testcycle test1",
                version: "1.0",
                status: "Approved",
                owner: "Roshni Bhengra",
                environment: "Development",
                planned_start_date: dataDate,
                planned_end_date: dataDate,
                folder_name: "",
                weblinks: "",
                issues: issuesData,
                testcases: testcaseData,
                testplans: ["602fffbd3eded72080fa03ae"],
                submit_status: true
            };
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcycle));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
              });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                testcycleID = result.data.id;
                accountID = result.data.created_by,
                projectID = result.data.project_id,
                domainID = result.data.domain_id
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
            controllers.add(req, res);
        })

        it('It should response insufficient access if user do not have access to create testcycle', function(done){
            let res;
            var form = new FormData();
            let dataDate = new Date();
            console.log("dataDate=====>",dataDate);
            let issuesData = [
                {
                "issue_id":2,
                "issue_type":"Bug",
                "issue_name":"test bug",
                "issue_key":"TEST",
                "issue_status":"new_issues",
                "test_type":"testcycle",
                "issue_priority":"High"
                }
            ]
            let testcaseData =  [
                {
                "testcase_id":6,
                "doc_id":"602270941284704848ee1003",
                "tester":"r.bhengra@thesynapses.com",
                "version":"1.0"
                }
            ]
            // var filePath = "Pictures/single.PNG"
            let testcycle = {
                name: "testcycle test1",
                acct_id: "s.dubay@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "testcycle test1",
                version: "1.0",
                status: "Approved",
                owner: "Roshni Bhengra",
                environment: "Development",
                planned_start_date: dataDate,
                planned_end_date: dataDate,
                folder_name: "",
                weblinks: "",
                issues: issuesData,
                testcases: testcaseData,
                testplans: ["602fffbd3eded72080fa03ae"],
                submit_status: true
            };
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcycle));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
              });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                testcycleID = result.data.id;
                accountID = result.data.created_by,
                projectID = result.data.project_id,
                domainID = result.data.domain_id
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
            controllers.add(req, res);
        })
        it('It should res db error if no records', function(done){
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
            controllers.add(req, res);
        })
    })

    /**
     * update testcycle
     */
    describe('PUT /testcycle', function(){
        req = {
            body: ''
        }
        it('It should update testcycle records', function(done){
            let res;
            var form = new FormData();
            let dataDate = new Date();
            // var filePath = "Pictures/single.PNG"
            let issuesData = [
                {
                "issue_id":2,
                "issue_type":"Task",
                "issue_name":"test task",
                "issue_key":"TEST",
                "issue_status":"new_issues",
                "test_type":"testcycle",
                "issue_priority":"Highest"
                }
            ]
            let testcaseData =  [
                {
                "testcase_id":6,
                "doc_id":"602270941284704848ee1003",
                "tester":"r.bhengra@thesynapses.com",
                "version":"1.0"
                }
            ]
 
            let testcycle = {
		        testcycle_id: "60264a7564f7aa34a4bb8c24",
                name: "testcycle test1 update",
                acct_id: "r.bhengra@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "testcycle test1 update",
                version: "1.0",
                status: "Approved",
                owner: "Roshni Bhengra",
                environment: "Development",
                planned_start_date: dataDate,
                planned_end_date: dataDate,
                folder_name: "",
                weblinks: "",
                issues: issuesData,
                testcases: testcaseData,
                testplans: ["602fffbd3eded72080fa03ae"],
                submit_status: true
            };
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcycle));
            const req = new MockExpressRequest({
                method: 'PUT',
                headers: form.getHeaders()
            });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCYCLE_UPDATE,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.update(req, res);
        })

        it('It should response insufficient access if user not found ', function(done){
            let res;
            var form = new FormData();
            let dataDate = new Date();
            // var filePath = "Pictures/single.PNG"
            let issuesData = [
                {
                "issue_id":2,
                "issue_type":"Task",
                "issue_name":"test task",
                "issue_key":"TEST",
                "issue_status":"new_issues",
                "test_type":"testcycle",
                "issue_priority":"Highest"
                }
            ]
            let testcaseData =  [
                {
                "testcase_id":6,
                "doc_id":"602270941284704848ee1003",
                "tester":"r.bhengra@thesynapses.com",
                "version":"1.0"
                }
            ]
 
            let testcycle = {
		        testcycle_id: "60264a7564f7aa34a4bb8c24",
                name: "testcycle test1 update",
                acct_id: "",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "testcycle test1 update",
                version: "1.0",
                status: "Approved",
                owner: "Roshni Bhengra",
                environment: "Development",
                planned_start_date: dataDate,
                planned_end_date: dataDate,
                folder_name: "",
                weblinks: "",
                issues: issuesData,
                testcases: testcaseData,
                testplans: ["602fffbd3eded72080fa03ae"],
                submit_status: true
            };
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcycle));
            const req = new MockExpressRequest({
                method: 'PUT',
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
            controllers.update(req, res);
        })

        it('It should res db error if no records', function(done){
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
            controllers.update(req, res);
        })     
    })
    /**
     * Test the List testplan
     */
    describe('GET /testcycle/planList', function () { 
        let req = {
            body:''
        };
        // it('it should list planList if no project id',function (done) {
        //     let res;
        //     req.query = {
        //         domain_id : "jira.com",
        //         acct_id: "r.bhengra@thesynapses.com",
        //         plan_name: "testplan1"
        //     }
        //     res = {
        //         json(result) {
        //         result = result.res;
        //         const response = {
        //             status:200,
        //             message:message.TESTPLAN_LIST,
        //         }
        //         expect(result.status).to.equal(response.status)
        //         expect(result.message).to.equal(response.message)
        //         expect(result.data).to.not.equal(null)
        //         done();
        //         },
        //     }
        //     controllers.planList(req,res)
        // })

        it('it should list planList with project id',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: "101",
                acct_id: "r.bhengra@thesynapses.com",
                plan_name: "testplan1"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTPLAN_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.planList(req,res)
        })

        it('it should res db error if no details found',function (done) {
            let res;
            req.query = {}
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
            controllers.planList(req,res)
        })
    })

    /**
     * Test the List testcases
     */
    describe('GET /testcycle/listTestcases', function () { 
        let req = {
            body:''
        };
        it('it should list testcase with folder',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                user: "r.bhengra@thesynapses.com",
                project_id:101,
                folder_id:7
            }
            res = {
                json(result) {
                result = result.res;
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
            controllers.listTestcase(req,res)
        })

        it('it should list listTestcase with no folder',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                folder_id:''
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCYCLE_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listTestcase(req,res)
        })

        it('it should res insufficient access if user not allowd',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: "101",
                user: "",
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
            controllers.listTestcase(req,res)
        })

        it('it should res db error if no details found',function (done) {
            let res;
            req.query = {}
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
            controllers.listTestcase(req,res)
        })
    })

    /**
     * Test the List testcycle history
     */
    describe('GET /testcycle/history', function () { 
        let req = {
            body:''
        };
        it('it should list testcycle history',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: "101",
                acct_id: "r.bhengra@thesynapses.com",
                testcycle_id: "6021107d312e613bec320a5a"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.undefined,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.history(req,res)
        })

        it('it should list no testcycle history if details not found',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: "101",
                user: "r.bhengra@thesynapses.com",
                testcycle_id: ""
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
            controllers.history(req,res)
        })
    })

    /**
     * clone testcycle
     */
    describe('/testcycle/cloneTestCycle', function () {
        let req = {
            body:''
        };
        it('it should clone testcycle', function (done) {
            let res;
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: "6021107d312e613bec320a5a"
            }

            req.query = {
                user: "r.bhengra@thesynapses.com",
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.CLONE_ADD,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.cloneTestCycle(req,res)
        })

        it('it should response db error',function (done) {
            let res;
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: ""
            }
            req.query = {
                user: "r.bhengra@thesynapses.com",
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
            controllers.cloneTestCycle(req,res)
        })

        it('it should clone testcycle user not allowed',function (done) {
            let res;
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: "6021107d312e613bec320a5a",
            }

            req.query = {
                user: "",
            }
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
            controllers.cloneTestCycle(req,res)
        })
    })

    /**
     * Upload CSV file
     */
    describe('POST /testcycle/importData', function(){
        req = {
            body: ''
        }
        // it('It should import testcycle records data', function(done){
        //     let res;
        //     var form = new FormData();
        //     let dataDate = new Date();
        //     console.log("dataDate=====>",dataDate);
        //     let issuesData = [
        //         {
        //         "issue_id":2,
        //         "issue_type":"Bug",
        //         "issue_name":"test bug",
        //         "issue_key":"TEST",
        //         "issue_status":"new_issues",
        //         "test_type":"testcycle",
        //         "issue_priority":"High"
        //         }
        //     ]
        //     let testcaseData =  [
        //         {
        //         "testcase_id":6,
        //         "doc_id":"602270941284704848ee1003",
        //         "tester":"r.bhengra@thesynapses.com",
        //         "version":"1.0"
        //         }
        //     ]
        //     // var filePath = "Pictures/single.PNG"
        //     let testcycle = {
        //         name: "testcycle test1",
        //         acct_id: "r.bhengra@thesynapses.com",
        //         project_id: 101,
        //         domain_id: "jira.com",
        //         folder_id: null,
        //         description: "testcycle test1",
        //         version: "1.0",
        //         status: "Approved",
        //         owner: "Roshni Bhengra",
        //         environment: "Development",
        //         planned_start_date: dataDate,
        //         planned_end_date: dataDate,
        //         folder_name: "",
        //         weblinks: "",
        //         issues: issuesData,
        //         testcases: testcaseData,
        //         testplans: ["602fffbd3eded72080fa03ae"],
        //         submit_status: true
        //     };
          
        //     // form.append('file', fs.createReadStream(filePath));
        //     form.append("data",JSON.stringify(testcycle));
        //     const req = new MockExpressRequest({
        //         method: 'POST',
        //         headers: form.getHeaders()
        //       });
              
        //     form.pipe(req);
        //     res = {
        //         json(result) {
        //         result = result.res;
        //         testcycleID = result.data.id;
        //         accountID = result.data.created_by,
        //         projectID = result.data.project_id,
        //         domainID = result.data.domain_id
        //         const response = {
        //             status:200,
        //             message:message.TEST_CYCLE_ADDED,
        //         }
        //         expect(result.status).to.equal(response.status)
        //         expect(result.message).to.equal(response.message)
        //         expect(result.data).to.not.equal(null)
        //         done();
        //         },
        //     }
        //     controllers.importTestcycle(req, res);
        // })

        it('It should res db error if no records data', function(done){
            let res;
            req.body= {}
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
            controllers.importTestcycle(req, res);
        })
    })

    /**
     * Export CSV file
     */
    describe('POST /testcycle/exportFile', function(){
        req = {
            body: ''
        }
        // it('It should export file', function(done){
        //     let res;
        //     let ownerData = ["Roshni","Reshma"]
        //     req.body = {
        //         acct_id:"r.bhengra@thesynapses.com",
        //         project_id:101,
        //         domain_id:"jira.com",
        //         owner_array:JSON.stringify(ownerData),
        //         file_type: "CSV"
        //     }

        //     res = {
        //         json(result) {
        //         const response = {
        //             status:200,
        //             message:message.TEST_CYCLE_ADDED,
        //         }
        //         expect(result.status).to.equal(response.status)
        //         expect(result.message).to.equal(response.message)
        //         expect(result.data).to.not.equal(null)
        //         done();
        //         },
        //     }
        //     controllers.exportFile(req, res);
        // })

        it('It should res db error if no details found', function(done){
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
            controllers.exportFile(req, res);
        })

               //res.setHeader is notfunction issue
        // it('It should export file', function(done){
        //     let res;
        //     let ownerData = ["Roshni","Reshma"]
        //     req.body = {
        //         acct_id:"r.bhengra@thesynapses.com",
        //         project_id:101,
        //         domain_id:"jira.com",
        //         owner_array:JSON.stringify(ownerData),
        //         file_type: "csv"
        //     }

        //     res = {
        //         json(result) {
            // result = result.res;
        //         const response = {
        //             status:200,
        //             message:message.TEST_CYCLE_ADDED,
        //         }
        //         expect(result.status).to.equal(response.status)
        //         expect(result.message).to.equal(response.message)
        //         expect(result.data).to.not.equal(null)
        //         done();
        //         },
        //     }
        //     controllers.exportFile(req, res);
        // })

        it('It should show user not allowed', function(done){
            let res;
            let ownerData = ["Roshni","Reshma"]
            req.body = {
                acct_id:"",
                project_id:101,
                domain_id:"jira.com",
                owner_array:JSON.stringify(ownerData),
                file_type: "csv"
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
            controllers.exportFile(req, res);
        })
    })

    /**
     * details testcycle
     */
    describe('/testcycle/testcycleDetailById', function () {
        let req = {
            body:''
        };
        it('it should details testcycle',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: "6028fa68c44eb90e08f723f2",
                user: "r.bhengra@thesynapses.com",
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.undefined,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testcycleDetailById(req,res)
        })
        it('it should details testcycle',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: "6022d0f60e28c72ffcfa09b7",
                user: "r.bhengra@thesynapses.com",
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
            controllers.testcycleDetailById(req,res)
        })

        it('it should res insufficient access for user',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: "6022d0f60e28c72ffcfa09b7",
                user: "",
            }
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
            controllers.testcycleDetailById(req,res)
        })

        it('it should response db error',function (done) {
            let res;
            req.body = {}
            req.query = {}
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
            controllers.testcycleDetailById(req,res)
        })
    })
    /**
     * delete testcycle
     */
    describe('/testcycle/delete', function () {
        let req = {
            body:''
        };
        it('it should delete testcycle',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: "6022d0f60e28c72ffcfa09b7",
                user: "r.bhengra@thesynapses.com",
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCYCLE_INACTIVE,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.delete(req,res)
        })

        it('it should res insufficient access for user',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                testcycle_id: "6022d0f60e28c72ffcfa09b7",
                user: "",
            }
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
            controllers.delete(req,res)
        })
        it('it should response db error',function(done) {
            let res;
            req.body = {}
            req.query = {}
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
            controllers.delete(req,res)
        })
    })
}

