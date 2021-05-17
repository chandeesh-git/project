process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_status_config.ctrl.js');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post global status
     */
    let statusID;
    let domainID;
    let accountID
    describe('POST /globalStatus', function(){
        req = {
            body: ''
        }
        it('It should create a new status config records', function(done){
            let res;
            req.body = {
                domain_id: "jira.com",
                sc_name: "test001",
                sc_description: "Draft",
                sc_color: "#FFA900",
                sc_type: "testcase",
                created_by:'Roshni',
                sc_status:0
            };
            req.query = {
                user:"Roshni"
            }
            res = {
                json(result) {
                result = result.res;
                statusID = result.data.id;
                accountID = result.data.created_by,
                domainID = result.data.domain_id
                const response = {
                    status:200,
                    message:message.STATUS_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addTest(req, res);
        })

        it('It should response exist if status name already available', function(done){
            let res;
            req.body = {
                domain_id: "jira.com",
                sc_name: "status test",
                sc_description: " this is test",
                sc_color: "#008000",
                sc_type: "testcase",
                created_by:'Roshni',
                sc_status:0
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.NAME_EXIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addTest(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                domain_id: "jira.com",
                sc_name: "status test",
                sc_description: "",
                sc_color: "#FFA900",
                sc_type: "testcase",
                sc_status:0
            };
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
            controllers.addTest(req, res);
        })
    })

    /**
     * Test the List all status
     */
    describe('GET /status/statusList', () => {
        req = {
            body: ''
        }
        it('It should list all the status config', (done) => {
            let res;
            req.query = {
                domain_id:"jira.com",
                sc_type: "testcase"
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
            controllers.listStatus(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                domain_id: "test.com",
                sc_type: "testcase"
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
            controllers.listStatus(req, res);
        })
    })

    /**
     * Test the status details
     */
    describe('GET /status/statusById', () => {
        req = {
            body: ''
        }
        it('It should list status details', (done) => {
            let res;
            req.query = {
                domain_id:"jira.com",
                sc_type: "testcase",
                global_status_id:18,
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.DATA_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getStatusById(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
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
            controllers.getStatusById(req, res);
        })
    })
    /**
     * Test the update status
     */
    describe('PUT /updateStatus', () => {
        it('It should update status', (done) => {
            let res;
            req.body = {
                sc_name: "Draft",
                sc_description: "test002",
                sc_color: "#FFA900",
                domain_id: 'jira.com',
                global_status_id: statusID,
                sc_type: "testcase",
                sc_status:0
            };
            req.query = {
                user:accountID,
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.STATUS_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateConfigStatus(req, res);
        })

        it('It should response already available if name exist', (done) => {
            let res;
            req.body = {
                sc_name: "status test",
                sc_description: "Test",
                sc_color: "#FFA900",
                domain_id: 'jira.com',
                global_status_id: statusID,
                sc_type:"testcase",
                sc_status:0
            };
            req.query = {
                user: accountID,
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.NAME_EXIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateConfigStatus(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                sc_name: "Draft",
                sc_description: "Test",
                sc_color: "#FFA900", 
                domain_id: 'jira.com',
                global_status_id:statusID,
                sc_type:"testcase",
                sc_status:0
            };
            req.query = {
                user: accountID,
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
            controllers.updateConfigStatus(req, res);
        })
    })

    /**
     * Test to delete status by ID
     */
    describe('DELETE /status', () => {
        it('It should delete the status', (done) => {
            let res;
            req.query = {
                global_status_id: statusID,
                domain_id:domainID,
                user:accountID
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.DATA_DELETED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.equal(null)
                sql_conn.globalStatusConfig.destroy({
                    where: {
                        'id': statusID
                    }
                }).catch(console.error);
                console.log("global status deleted================>done",statusID);
                done();
                },
            }
            controllers.deleteConfigStatus(req, res);
        })

        it('It should return db query error if status ID not found', (done) => {
            let res;
            req.query = {
                global_status_id: 10000,
                domain_id:domainID,
                user:accountID
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
            controllers.deleteConfigStatus(req, res);
        })
    })
}