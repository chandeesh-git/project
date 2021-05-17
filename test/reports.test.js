let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let mongodbConfig = require('../db/mongoose_models/config/config_detail');
let dbConfig = require('../db/sequelize_models/config/config_detail');
require('../db/mongoose_models/testIndex')
let controllers = require('../src/controllers/report.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

if((dbConfig.db_name === dbConfig.test_db_name) && mongodbConfig.test_utdb_url){
    /**
     * Test the test execution List report
     */
    describe('GET /report/list', () => {
        req = {
            body: ''
        }
        it('It should list the test execution report', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                testcycle_id:'6028fa68c44eb90e08f723f2',
                user: "r.bhengra@thesynapses.com",
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
            controllers.list(req, res);
        })
        it('It should list the test execution report with status config', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                testcycle_id:'6027a8cb892c9f3d2cf84d50',
                user: "r.bhengra@thesynapses.com",
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
            controllers.list(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.list(req, res);
        })
    })

    /**
     * Test the testcycle list report
     */
    describe('GET /report/testCycleList', () => {
        req = {
            body: ''
        }
        it('It should list the testcycle report', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                environment:"Development",
                acct_id: "r.bhengra@thesynapses.com",
                start_date: "2021-02-08T10:18:00.343+00:00",
                end_date: "2021-02-23T10:18:00.343+00:00"
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.testCycleList(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.testCycleList(req, res);
        })
    })


    /**
     * Test the test execution details report
     */
    describe('GET /report/detail', () => {
        req = {
            body: ''
        }
        it('It should list the test execution details report', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcycle_id:'6027ef5f4bca7e0468ef41bf',
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
                const response = {
                    status:200,
                    message:message.REPORT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.detail(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.detail(req, res);
        })
    })

    /**
     * Test the defect distribution report
     */
    describe('GET /report/detail', () => {
        req = {
            body: ''
        }
        it('It should list the test execution details report', (done) => {
            let res;
            let cycleData = "6027ef5f4bca7e0468ef41bf,60367fe4453e3125c8450205"
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                testcycle_ids: cycleData
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
                const response = {
                    status:200,
                    message:message.REPORT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.defectDistribution(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.defectDistribution(req, res);
        })
    })

    /**
     * Test the testcase report
     */
    describe('GET /report/detail', () => {
        req = {
            body: ''
        }
        it('It should list the testcase report', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                acct_id: "r.bhengra@thesynapses.com",
                search_type:'executed',
                count:2
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
                const response = {
                    status:200,
                    message:message.REPORT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testcaseReport(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.testcaseReport(req, res);
        })
    })

    /**
     * Test the activity log report
     */
    describe('GET /report/activityLogs', () => {
        req = {
            body: ''
        }
        it('It should list activity logs report', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                last_days: '7',
                record_limit: 2,
                count:2
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
                const response = {
                    status:200,
                    message:message.REPORT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.activityLogs(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.activityLogs(req, res);
        })
    })

    
    /**
     * Test the execution status report
     */
    describe('GET /report/executionStatus', () => {
        req = {
            body: ''
        }
        it('It should test execution status report', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                last_days: '30',
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
                const response = {
                    status:200,
                    message:message.REPORT_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.executionStatus(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.executionStatus(req, res);
        })
    })

    /**
     * Test the export execution list report
     */
    describe('GET /report/exportExecutionList', () => {
        req = {
            body: ''
        }
        it('It should test export execution status report without testcycle id', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                last_days: '30',
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
                const response = {
                    status:401,
                    message:message.NO_TESTCASE,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.exportExecutionList(req, res);
        })

        //res.Header is not a function
        it('It should test export execution status report with testcycle id', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                testcycle_id:'6027ef5f4bca7e0468ef41bf',
                last_days: '30',
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportExecutionList(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.exportExecutionList(req, res);
        })
    })

    /**
     * Test the export execution status report
     */
    describe('GET /report/exportExecutionStatus', () => {
        req = {
            body: ''
        }
        //res.Header is not a function from api not returning response
        it('It should test export execution status report if testcycle id not found', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                testcycle_id:'6021107d312e613bec320a5a'
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportExecutionStatus(req, res);
        })

        //res.Header is not a function
        it('It should test export execution status report with testcycle id', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                testcycle_id:'6027ef5f4bca7e0468ef41bf',
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportExecutionStatus(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.exportExecutionStatus(req, res);
        })
    })

    /**
     * Test the export execution details report
     */
    describe('GET /report/exportExecutionStatus', () => {
        req = {
            body: ''
        }
        //res.Header is not a function from api not returning response
        it('It should test export execution status report if testcycle id not found', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                testcycle_id:'6021107d312e613bec320a5a'
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportExecutionDetail(req, res);
        })

        //res.Header is not a function since it export csv file
        it('It should test export execution status report with testcycle id', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                testcycle_id:'6027ef5f4bca7e0468ef41bf',
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportExecutionDetail(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.exportExecutionDetail(req, res);
        })
    })

     /**
     * Test the export exportTraceabilityReport
     */
    describe('GET /report/exportTraceabilityReport', () => {
        req = {
            body: ''
        }
        //res.Header is not a function from api not returning response
        it('It should test export execution status report if testcycle id not found', (done) => {
            let res;
            let testcycleData = "60367fe4453e3125c8450205,6021107d312e613bec320a5a"
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                testcycle_ids:testcycleData
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportTraceabilityReport(req, res);
        })

        //res.Header is not a function since it export csv file
        it('It should test export execution status report with testcycle id', (done) => {
            let res;
            let cycleData = "6027ef5f4bca7e0468ef41bf,60367fe4453e3125c8450205"
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                testcycle_ids:cycleData
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportTraceabilityReport(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.exportTraceabilityReport(req, res);
        })
    })

    /**
     * Test the export exportLiveStatistics
     */
    describe('GET /report/exportLiveStatistics', () => {
        req = {
            body: ''
        }
        //res.Header is not a function from api not returning response,since csv file
        it('It should test export execution status report if testcycle id not found', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                user: "r.bhengra@thesynapses.com",
                last_days:"30"
            }
            res = {
                json(result) {
                result = result.res
                console.log("result",result);
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
            controllers.exportLiveStatistics(req, res);
        })

        it('It should reponse db error if not valid data', (done) => {
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
            controllers.exportLiveStatistics(req, res);
        })
    })
}