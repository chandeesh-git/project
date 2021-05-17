process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_priority_config.ctrl.js');
let message = require('../src/utils/message');
let error_message = require('../src/utils/error_message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post priority
     */
    let priorityID;
    let domainID;
    let accountID;
    describe('POST /priority', function(){
        req = {
            body: ''
        }
        it('It should create a new priority config records', function(done){
            let res;
            req.body = {
                domain_id: "jira.com",
                pc_name: "test p",
                priority_color:"DF4C4C",
                priority_label: "H",
                priority_type: "testcase"
            };

            req.query = {
                user:"Roshni"
            }
            res = {
                json(result) {
                result = result.res;
                priorityID = result.data.priority.id;
                accountID = result.data.priority.acct_id,
                domainID = result.data.priority.domain_id
                const response = {
                    status:200,
                    message:message.DATA_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addPriorityConfig(req, res);
        })

        it('It should response exist if already available ', function(done){
            let res;
            req.body = {
                domain_id: "test.com",
                pc_name: "High",
                priority_label: "H",
                priority_color:"",
                priority_type: "testcase",
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:error_message.NAME_EXIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addPriorityConfig(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                domain_id: "jira.com",
                pc_name: "High",
                priority_label: "H",
                priority_color:"",
                priority_type: "testcase",
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
            controllers.addPriorityConfig(req, res);
        })
    })

    /**
     * Test the List all priority
     */
    describe('GET /priority/priorityList', () => {
        req = {
            body: ''
        }
        it('It should list all the priority config', (done) => {
            let res;
            req.query = {
                domain_id:"jira.com",
                priority_type: "testcase"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.ALL_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getAllPriorityList(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                domain_id: "test.com",
                priority_type: "testcase"
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
            controllers.getAllPriorityList(req, res);
        })
    })

    /**
     * Test the List priority by ID
     */
    describe('GET /priority/priorityById', () => {
        req = {
            body: ''
        }
        it('It should view priority config', (done) => {
            let res;
            req.query = {
                domain_id:"jira.com",
                global_priority_id: priorityID
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
            controllers.getPriorityConfigById(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                domain_id: "test.com",
                global_priority_id: priorityID
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
            controllers.getPriorityConfigById(req, res);
        })
    })

    /**
     * Test the update priority
     */
    describe('PUT /updatePriority', () => {
        it('It should update priority', (done) => {
            let res;
            req.body = {
                pc_name: "test pc",
                priority_label: "X",
                acct_id: accountID,
                domain_id: 'jira.com',
                global_priority_id: priorityID,
                is_active:true,
                priority_type:"testcase"
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.DATA_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.editPriorityConfig(req, res);
        })

        it('It should return exist if priority name already available', (done) => {
            let res;
            req.body = {
                pc_name: "High",
                priority_label: "H",
                acct_id: accountID,
                domain_id: 'test.com',
                global_priority_id: priorityID,
                is_active:true,
                priority_type:"testcase"
            };
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
            controllers.editPriorityConfig(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                pc_name: "Medium",
                priority_label: "M",
                acct_id: accountID,
                domain_id: 'jira.com',
                global_priority_id: priorityID,
                priority_type:"testcase"
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
            controllers.editPriorityConfig(req, res);
        })
    })

    /**
     * Test to delete priority by ID
     */
    describe('DELETE /priority', () => {
        it('It should delete the priority', (done) => {
            let res;
            req.query = {
                global_priority_id: priorityID,
                domain_id: domainID,
                user: accountID
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
                expect(result.data).to.not.equal(null)
                sql_conn.globalPriorityConfig.destroy({
                    where: {
                        'id':  priorityID
                    }
                }).catch(console.error);
                console.log("global priority deleted================>done",priorityID);
                done();
                },
            }
            controllers.deletePriorityConfig(req, res);
        })

        it('It should return db query error if priority ID not found', (done) => {
            let res;
            req.query = {
                global_priority_id: 10000,
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
            controllers.deletePriorityConfig(req, res);
        })
    })
}