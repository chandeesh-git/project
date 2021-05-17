let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let mongodbConfig = require('../db/mongoose_models/config/config_detail');
let dbConfig = require('../db/sequelize_models/config/config_detail');
require('../db/mongoose_models/testIndex')
let controllers = require('../src/controllers/testcase.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
const MockExpressRequest = require('mock-express-request');
var fs = require('fs');
var FormData = require('form-data');
if((dbConfig.db_name === dbConfig.test_db_name) && mongodbConfig.test_utdb_url){
    let testcaseID;
    let accountID;
    let projectID;
    let domainID;
    let testcaseDocID
    /**
     * Create testcase
     */
    describe('POST /testcase', function(){
        req = {
            body: ''
        }
        it('It should create testcase records', function(done){
            let res;
            var form = new FormData();
            // var filePath = "Pictures/single.PNG"
            let testcase = {
              name: "test15",
              acct_id: "r.bhengra@thesynapses.com",
              project_id: 101,
              domain_id: "jira.com",
              folder_id: null,
              description: "desc",
              precondition: "none",
              owner: "Roshni",
              status: "Approved",
              priority: "High",
              component: "comp11",
              estimated_time: "2",
              folder_name: "test",
              label: "tset label",
              testscript_type: "",
              testscript: "",
              test_data: "",
              parameters: "",
              weblinks: "",
              issues: "",
              attachments: "",
              lock: false,
              customFields: "cf1",
              submit_status: true
            }

            form.append("data", JSON.stringify(testcase));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
              });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                testcaseID = result.data.id;
                accountID = result.data.created_by,
                projectID = result.data.project_id,
                domainID = result.data.domain_id
                const response = {
                    status:200,
                    message:message.TESTCASE_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.add(req, res);
        })

        it('it should res db error if no details',function (done) {
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
            controllers.add(req,res)
        })
    })

    /**
     * update testcase
     */
    describe('PUT /testcase', function(){
        req = {
            body: ''
        }
        it('It should update testcase records', function(done){
            let res;
            var form = new FormData();
            // var filePath = "Pictures/single.PNG"
            let testcase = {
                testcase_id:1,
                version: "1.1",
                name: "test update",
                acct_id: "r.bhengra@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "desc",
                precondition: "none",
                owner: "Roshni",
                status: "Approved",
                priority: "Low",
                component: "comp11",
                estimated_time: "2",
                folder_name: "",
                label: "test label",
                testscript_type: "test type update",
                testscript: "script update",
                test_data: "data update",
                parameters: "param update",
                weblinks: "w1",
                issues: [{"issue_id":2,"issue_type":"Bug","issue_name":"test bug","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"High"}],
                attachments: "",
                lock: false,
                customFields: "cf1",
                submit_status: true
              }
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcase));
            const req = new MockExpressRequest({
                method: 'PUT',
                headers: form.getHeaders()
              });
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result====================>",result);
                const response = {
                    status:200,
                    message:message.TESTCASE_UPDATE,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.update(req, res);
        })

        it('It should show insufficient access', function(done){
            let res;
            var form = new FormData();
            // var filePath = "Pictures/single.PNG"
            let testcase = {
                testcase_id:1,
                version: "1.1",
                name: "test update",
                acct_id: "",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "desc",
                precondition: "none",
                owner: "Roshni",
                status: "Approved",
                priority: "Low",
                component: "comp11",
                estimated_time: "2",
                folder_name: "",
                label: "test label",
                testscript_type: "test type update",
                testscript: "script update",
                test_data: "data update",
                parameters: "param update",
                weblinks: "w1",
                issues: [{"issue_id":2,"issue_type":"Bug","issue_name":"test bug","issue_key":"TEST","issue_status":"new_issues","test_type":"testcase","issue_priority":"High"}],
                attachments: "",
                lock: false,
                customFields: "cf1",
                submit_status: true
              }
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcase));
            const req = new MockExpressRequest({
                method: 'PUT',
                headers: form.getHeaders()
              });
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result====================>",result);
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

        it('It should show version already locked', function(done){
            let res;
            var form = new FormData();
            // var filePath = "Pictures/single.PNG"
            let testcase = {
                testcase_id:10,
                version: "1.0",
                name: "test update",
                acct_id: "r.bhengra@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "desc",
                precondition: "none",
                owner: "Roshni",
                status: "Approved",
                priority: "Low",
                component: "comp11",
                estimated_time: "2",
                folder_name: "",
                label: "test label",
                testscript_type: "test type update",
                testscript: "script update",
                test_data: "data update",
                parameters: "param update",
                weblinks: "w1",
                issues: [{"issue_id":2,"issue_type":"Bug","issue_name":"test bug","issue_key":"TEST","issue_status":"new_issues","test_type":"testcycle","issue_priority":"High"}],
                attachments: "",
                lock: true,
                customFields: "cf1",
                submit_status: true
            }
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testcase));
            const req = new MockExpressRequest({
                method: 'PUT',
                headers: form.getHeaders()
            });
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result====================>",result);
                const response = {
                    status:401,
                    message:message.TESTCASE_LOCKED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.update(req, res);
        })

        it('It should show db error if deatils invalid', function(done){
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
     * Test the List all testcase
     */
    describe('GET /testcase/list', function () {
        let req = {
            body:''
        };
        it('it should list all testcases',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASES_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.list(req,res)
        })

        it('it should response empty list if no testcases found',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASES_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.list(req,res)
        })

        it('it should response db error no testcases found',function (done) {
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
            controllers.list(req,res)
        })
    })

    describe('GET /testcase/history', function () { 
        let req = {
            body:''
        };
        it('it should list testcase history',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testcase_id: "3"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_HISTORY,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testcaseHistory(req,res)
        })

        it('it should response insufficient access if user not allowed to access',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 001,
                user: "r.bhengra@thesynapses.com",
                testcase_id: "3"
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
            controllers.testcaseHistory(req,res)
        })

        it('it should response db query error if details not found',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testcase_id: ""
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
            controllers.testcaseHistory(req,res)
        })
    })

    describe('GET /testcase/versionCompare', function () { 
        let req = {
            body:''
        };
        it('it should compare version',function (done) {
            let res;
            let test_ids = ['601efa562ac3b90d2cea8b04']
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                testcase_id: JSON.stringify(test_ids),
            }
            req.query = {
                user: "r.bhengra@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_VERSION_HISTORY,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testcaseVersionCompare(req,res)
        })

        // it('it should compare version',function (done) {
        //     let res;
        //     let test_ids = ['601efa562ac3b90d2cea8b04']
        //     req.body = {
        //         domain_id : "jira.com",
        //         project_id: 101,
        //         testcase_id: JSON.stringify(test_ids),
        //     }
        //     req.query = {
        //         user: "r.bhengra@thesynapses.com"
        //     }
        //     res = {
        //         json(result) {
        //         result = result.res;
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
        //     controllers.testcaseVersionCompare(req,res)
        // })

        it('it should compare version',function (done) {
            let res;
            let test_ids = []
            req.body = {
                domain_id : "jira.com",
                project_id: 001,
                testcase_id: JSON.stringify(test_ids),
            }
            req.query = {
                user: "r.bhengra@thesynapses.com"
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
            controllers.testcaseVersionCompare(req,res)
        })
    })

    describe('GET /testcase/showLogs', function () { 
        let req = {
            body:''
        };
        it('it should show logs',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testcase_id: 3,
                version: 1.0
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_HISTORY,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.showLogs(req,res)
        })

        it('it should show query error',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testcase_id: "",
                version: 1.0
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
            controllers.showLogs(req,res)
        })

        it('it should show access not allowed',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "",
                testcase_id: 3,
                version: 1.0
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
            controllers.showLogs(req,res)
        })
    })

    /**
     * Test the List owners
     */
    describe('/testcase/ownerList', function () { 
        let req = {
            body:''
        };
        it('it should list owners',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                test_type:"testcase"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.OWNER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listOwner(req,res)
        })

        it('it should response query error',function (done) {
            let res;
            req.query ={
                domain_id : "",
                project_id: 101,
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
            controllers.listOwner(req,res)
        })
    })

    /**
     * Test testcase details
     */
    describe('GET /testcase/getById', function () { 
        let req = {
            body:''
        };
        it('it should get details testcase',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: 3,
                version:1.0
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.detail(req,res)
        })

        it('it should return db query errorif no testcase found',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: "",
                version:""
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
            controllers.detail(req,res)
        })

        it('it should return access not allowed if no user found',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                testcase_id: 3,
                version:1.0
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
            controllers.detail(req,res)
        })
    })

    /**
     * Test testcase clone
     */
    describe('GET /testcase/clone', function () { 
        let req = {
            body:''
        };
        it('it should get details testcase', function (done) {
            let res;
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: 3,
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
                expect(result.data).to.equal(null)
                done();
                },
            }
            controllers.cloneTestCase(req,res)
        })

        it('it should return db query errorif no testcase found',function (done) {
            let res;
            req.body = {
                domain_id : "",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: "",
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
            controllers.cloneTestCase(req,res)
        })

        it('it should return insufficient access if no user found',function (done) {
            let res;
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                testcase_id: 3,
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.cloneTestCase(req,res)
        })
    })

    /**
     * Test testcase list version
     */
    describe('GET /testcase/version', function () { 
        let req = {
            body:''
        };
        it('it should get version testcase',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: 6,
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.VERSION_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.versionList(req,res)
        })

        it('it should show db query error',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: '',
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:500,
                    message:message.DB_ERROR
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.versionList(req,res)
        })

        it('it should get version testcase',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                testcase_id: 3,
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.versionList(req,res)
        })
    })

    /**
     * Test testcase delete
     */
    describe('/testcase/delete', function () {
        let req = {
            body:''
        };
        it('it should delete testcase',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: 5
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_INACTIVE,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.delete(req,res)
        })

        it('it should return db query error if not testcase found',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testcase_id: ""
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
            controllers.delete(req,res)
        })

        it('it should return no access allowed if no user found',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                testcase_id: 5
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
            controllers.delete(req,res)
        })
    })

    /**
     * Test testcase list search
     */
    describe('GET /testcase/search', function () {
        let req = {
            body:''
        };
        it('it should search testcase',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                test_type: "testcase",
                search_string: "testcase"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.search(req,res)
        })

        it('it should get search testcycle',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                test_type: "testcycle",
                search_string: "testcycle"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.TESTCASE_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.search(req,res)
        })

        it('it should get search testplan',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                test_type: "testplan",
                search_string: "testplan"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.search(req,res)
        })

        it('it should response insufficient access for search testcase',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                test_type: "testcase",
                search_string: ""
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
            controllers.search(req,res)
        })

        it('it should response insufficient access for search testcycle',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                test_type: "testcycle",
                search_string: ""
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
            controllers.search(req,res)
        })

        it('it should response insufficient access for search testplan',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                test_type: "testplan",
                search_string: ""
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
            controllers.search(req,res)
        })

        it('it should response db error testplan',function (done) {
            let res;
            req.query = {
                domain_id : "",
                project_id: 101,
                acct_id: "",
                test_type: "testplan",
                search_string: ""
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
            controllers.search(req,res)
        })
    })


    describe('GET /testcase/executionList', function () {
        let req = {
            body:''
        };
        it('it should show executionList',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testcase_id: 37
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_EXECUTION_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.executionList(req,res)
        })

        it('it should show db error',function (done) {
            let res;
            req.query = {
                domain_id : "",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testcase_id: ''
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
            controllers.executionList(req,res)
        })

        it('it should show access not allowed',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "",
                testcase_id: 3
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
            controllers.executionList(req,res)
        })
    })

    describe('GET /testcase/issuesDetails', function () {
        let req = {
            body:''
        };
        it('it should show issuesDetails',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                issue_id: 1
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.ISSUES_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.issueDetails(req,res)
        })

        //testcycle
        it('it should show issuesDetails',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                issue_id: 3
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.ISSUES_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.issueDetails(req,res)
        })

        it('it should show db query error',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                user: "r.bhengra@thesynapses.com",
                issue_id: 1
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
            controllers.issueDetails(req,res)
        })
    })

    /**
     * Test testcase bulk create
     */
    describe(' POST /testcase/bulkCreate', function () { 
        let req = {
            body:''
        };
        it('it should create bulk testcase', function(done){
            let res;
            let nameData = ["test reset pwd"]
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                name: JSON.stringify(nameData),
                status: "Approved",
                priority: "High",
                owner: "Roshni Bhengra",
                label: "test label",
                component: "Development"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TESTCASE_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.equal(null)
                done();
                },
            }
            controllers.bulkCreate(req,res)
        })

        it('it should show db query error',function (done) {
            let res;
            req.body = {}
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:500,
                    message:message.DB_ERROR
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.bulkCreate(req,res)
        })

        it('it should show insufficient access if user not allowed',function (done) {
            let res;
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.bulkCreate(req,res)
        })
    })

    /**
     * Test to import testcase
     */
    describe('POST /testcase/importData', function(){
        req = {
            body: ''
        }
        it('it should res db error if no details',function (done) {
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
            controllers.importTestcase(req,res)
        })
    })

    /**
     * Test to export testcase
     */
    describe('POST /testcase/exportFile', function(){
        req = {
            body: ''
        }

        // it('it should export testcase details',function (done) {
        //     let res;
        //     let ownerData = ["Roshni","Reshma"]
        //     req.body = {
        //         domain_id : "jira.com",
        //         project_id: 101,
        //         acct_id: "r.bhengra@thesynapses.com",
        //         owner_array:JSON.stringify(ownerData),
        //         file_type: "csv"
        //     }
            // res = {
            //     json(result) {
            //     result = result.res;
            //     // console.log("result", result);
            //     const response = {
            //         status:500,
            //         message:message.DB_ERROR,
            //     }
            //     expect(result.status).to.equal(response.status)
            //     expect(result.message).to.equal(response.message)
            //     expect(result.data).to.not.equal(null)
            //     done();
            //     },
            // }
        //     controllers.exportFile(req,res)
        // })

        it('it should res insufficient access to user',function (done) {
            let res;
            let ownerData = ["Roshni","Reshma"]
            req.body = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "",
                owner_array:JSON.stringify(ownerData),
                file_type: "csv"
            }
            res = {
                json(result) {
                result = result.res;
                // console.log("result", result);
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
            controllers.exportFile(req,res)
        })

        it('it should res db error if no details',function (done) {
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
            controllers.exportFile(req,res)
        })
    })
}

