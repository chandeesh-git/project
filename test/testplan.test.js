
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let mongodbConfig = require('../db/mongoose_models/config/config_detail');
let dbConfig = require('../db/sequelize_models/config/config_detail');
require('../db/mongoose_models/testIndex')
let controllers = require('../src/controllers/testplan.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
var Testplan = require('../db/mongoose_models/testplan');
var TestExecution = require('../db/mongoose_models/testexecution');
var TestCycle = require('../db/mongoose_models/testcycle');
var TestCase = require('../db/mongoose_models/testcase');
var fs = require('fs');
var FormData = require('form-data');
const MockExpressRequest = require('mock-express-request');
if((dbConfig.db_name === dbConfig.test_db_name) && mongodbConfig.test_utdb_url){
let testplanID;
let accountID;
let projectID;
let domainID;
    /**
     * Create testplan
     */
    describe('POST /testplan', function(){
        req = {
            body: ''
        }
        it('It should create testplan records', function(done){
            let res;
            var form = new FormData({ maxDataSize: 20971520 });
            // var filePath = "public/single.PNG"
            let testplan = {
            name: "testplan t1",
            acct_id: "r.bhengra@thesynapses.com",
            project_id: 101,
            domain_id: "jira.com",
            folder_id: null,
            description: "test1 desc",
            objective: "test1 obj",
            status: "Approved",
            owner: "Roshni bhengra",
            folder_name: "",
            label: "label test",
            custom_field: "cf1",
            weblinks: "",
            testcycles:["60210fd8312e613bec320a59"],
            attachments:[],
            submit_status: true
            };
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testplan));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
              });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result===>",result);
                testplanID = result.data.testplan_id;
                const response = {
                    status:200,
                    message:message.TESTPLAN_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.add(req, res);
        })

        it('It should res db error if no valid details entered', function(done){
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

        it('It should response insufficient access if user not allowed or not a valid user', function(done){
            let res;
            var form = new FormData({ maxDataSize: 20971520 });
            // var filePath = "public/single.PNG"
            let testplan = {
            name: "testplan t1",
            acct_id: "",
            project_id: 101,
            domain_id: "jira.com",
            folder_id: null,
            description: "test1 desc",
            objective: "test1 obj",
            status: "Approved",
            owner: "Roshni bhengra",
            folder_name: "",
            label: "label test",
            custom_field: "cf1",
            weblinks: "",
            testcycles:["60210fd8312e613bec320a59"],
            attachments:[],
            submit_status: true
            };
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testplan));
            const req = new MockExpressRequest({
                method: 'POST',
                headers: form.getHeaders()
              });
              
            form.pipe(req);
            res = {
                json(result) {
                result = result.res;
                console.log("result===>",result);
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
    })

    /**
     * update testplan
     */
    describe('PUT /testplan', function(){
        req = {
            body: ''
        }
        it('It should update testplan records', function(done){
            let res;
            var form = new FormData();
            // var filePath = "Pictures/single.PNG"
            let testplan = {
                name: "testplan t1 update",
                acct_id: "r.bhengra@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "test1 desc",
                objective: "test1 obj",
                status: "Approved",
                owner: "Roshni bhengra",
                folder_name: "",
                label: "label test",
                custom_field: "cf1",
                weblinks: "",
                testcycles:["60210fd8312e613bec320a59"],
                attachments:[],
                testplan_id:"602fffbd3eded72080fa03ae"
            };
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testplan));
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
                    message:message.TESTPLAN_UPDATE,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.update(req, res);
        })

        it('It shouldres db error if no valid details entered', function(done){
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

        it('It should res user not allowed if not valid user', function(done){
            let res;
            var form = new FormData();
            // var filePath = "Pictures/single.PNG"
            let testplan = {
                name: "testplan t1 update",
                acct_id: "",
                project_id: 101,
                domain_id: "jira.com",
                folder_id: null,
                description: "test1 desc",
                objective: "test1 obj",
                status: "Approved",
                owner: "Roshni bhengra",
                folder_name: "",
                label: "label test",
                custom_field: "cf1",
                weblinks: "",
                testcycles:["60210fd8312e613bec320a59"],
                attachments:[],
                testplan_id:"602fffbd3eded72080fa03ae"
            };
          
            // form.append('file', fs.createReadStream(filePath));
            form.append("data",JSON.stringify(testplan));
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
            controllers.update(req, res);
        })
    })
    /**
     * Test the List all testplan
     */
    describe('GET /testplan/list', function () {
        let req = {
            body:''
        };
        it('it should list all testplans',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.list(req,res)
        })

        it('it should list all testplans',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.list(req,res)
        })

        it('it should response db query error if details not found',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 001,
                acct_id: ""
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
            controllers.list(req,res)
        })
    })

     /**
     * Test the List testplan history
     */
    describe('GET /testplan/history', function () { 
        let req = {
            body:''
        };
        it('it should list testplan history',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testplan_id: "6020e0ec3ffdf20534c38781"
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
            controllers.history(req,res)
        })

        it('it should response nothing if no details found',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                acct_id: "r.bhengra@thesynapses.com",
                testplan_id: ""
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
            controllers.history(req,res)
        })
    })

    /**
     * Test the  testcycle list
     */
    describe('/testplan/cycleList', function () { 
        let req = {
            body:''
        };
        it('it should list testcycle',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: '101',
                acct_id: "r.bhengra@thesynapses.com",
                cycle_name: "testcycle test1"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
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
            controllers.cycleList(req,res)
        })

        it('it should response db query error',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                // project_id: 001,
                acct_id: "r.bhengra@thesynapses.com",
                cycle_name: "testcycle test1"
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
            controllers.cycleList(req,res)
        })
    })

    /**
     * Test testplan details
     */
    describe('GET /testplan/getById', function () { 
        let req = {
            body:''
        };
        it('it should get invalid if not valid details testplan',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testplan_id: "6020fbb89eff8a1c38ce6f22"
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
            controllers.testplanDetailById(req,res)
        })

        it('it should get details testplan',function (done) {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testplan_id: testplanID
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.TESTPLAN_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testplanDetailById(req,res)
        })

        it('it should return db query error if no testplan found',function (done) {
            let res;
            req.query ={}
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
            controllers.testplanDetailById(req,res)
        })

        it('it should return access not allowed if no not found',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: "101",
                acct_id: "",
                testplan_id: "6020e0ec3ffdf20534c38781"
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
            controllers.testplanDetailById(req,res)
        })
    })

    /**
     * Test testplan delete
     */
    describe('/testplan/delete', function () { 
        let req = {
            body:''
        };
        it('it should delete testplan',async function() {
            let res;
            req.query = {
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testplan_id: "6020fbb89eff8a1c38ce6f22"
            }

            //remove data from folder test mapping
            await sql_conn.folderTestMapping.destroy({
                where: {
                  created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("ut data deleted from folder test mapping================>done");

            //remove data from testcase details mapping
            await sql_conn.testcaseDetailsModel.destroy({
                where: {
                  created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("data deleted from testcase Details Model mapping================>done");

            //remove data from testcase version mapping
            await sql_conn.testcaseVersionModel.destroy({
                where: {
                  created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("data deleted from testcase Version Model mapping================>done");

            //remove data from plan cycle mapping
            await sql_conn.planCycleModel.destroy({
                where: {
                  created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("data deleted from planCycle mapping================>done");

            //remove data from testcycle testcase mapping model
            await sql_conn.testCycleCaseMapping.destroy({
                where: {
                    created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("cycle testcase data deleted from testcycle testcase================>done");

            //remove data from execution log mapping model
            await sql_conn.executionLogsModel.destroy({
                where: {
                    created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("execution log data deleted ================>done");

            //remove data from jira issues mapping model
            await sql_conn.issueModel.destroy({
                where: {
                    created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("jira issues data deleted ================>done");

            //remove data from jira issues mapping model
            await sql_conn.testKeyModel.destroy({
                where: {
                    created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("test key data deleted ================>done");

            //remove data from jira issues mapping model
            await sql_conn.testLogs.destroy({
                where: {
                    created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("test log data deleted ================>done");

            //remove data from jira issues mapping model
            await sql_conn.testexecutionDetailsModel.destroy({
                where: {
                    created_at:  {[Op.gt]: '2021-02-25 01:06:40'}
                }
            }).catch(console.error);
            console.log("test  execution data deleted ================>done");

            //testcase document delete
            await TestCase.deleteMany({
                'createdAt':
                {$gt:'2021-02-25T01:06:40.292+00:00'}
            },(err)=>{
                if(err) console.log(err);
                console.log("testcase Successful deletion=========================>done");
            })

            //testcycle document delete
            await TestCycle.deleteMany({'createdAt':{
                $gt:'2021-02-25T01:06:40.292+00:00'
            }},(err)=>{
                if(err) console.log(err)
                console.log("testcycle deleted Successfully=================>done")
            })

            //TestExecution document delete
            await TestExecution.deleteMany({
                'createdAt':
                {$gt:'2021-02-25T01:06:40.292+00:00'}
            },(err)=>{
                if(err) console.log(err);
                console.log("Test ExecutionSuccessful deletion=========================>done");
            })

            //Testplan document delete
            await Testplan.deleteMany({
                'createdAt':
                {$gt:'2021-02-25T01:06:52.292+00:00'}
            },(err)=>{
                if(err) console.log(err);
                console.log("Testplan Successful deletion=========================>");
            })
            res = {
                json(result) {
                result = result.res;
                console.log("result==>",result)
                const response = {
                    status:200,
                    message:message.TESTPLAN_INACTIVE,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                // done();
                },
            }
            controllers.delete(req,res)
        })

        it('it shoutd return db query errorif no testplan found',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                user: "r.bhengra@thesynapses.com",
                testplan_id: ""
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
            controllers.delete(req,res)
        })

        it('it should res insufficient access if user not allowed to delete testplan',function (done) {
            let res;
            req.query ={
                domain_id : "jira.com",
                project_id: 101,
                user: "",
                testplan_id: testplanID
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
            controllers.delete(req,res)
        })
    })
}

