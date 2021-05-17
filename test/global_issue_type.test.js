process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_issue_type.ctrl.js');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post Issue Type
     */
    let issueTypeID;
    let domainID;
    let accountID;
    describe('POST /globalIssueType', function(){
        req = {
            body: ''
        }
        it('It should create a new global issue type records', function(done){
            let res;
            req.body = {
                domain_id: "example1.com",
                permission_status: 0,
                story_enabled: 0,
                task_enabled: 0,
                bug_enabled: 0,
                epic_enabled: 0,
                subtask_enabled: 0
            };
            req.query = {
                user:"Roshni"
            }
            res = {
                json(result) {
                result = result.res;
                console.log("result===>",result);
                issueTypeID = result.data.id;
                accountID = result.data.acct_id,
                domainID = result.data.domain_id
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
            controllers.addIssueType(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                permission_status: 1,
                story_enabled: 1,
                task_enabled: 0,
                bug_enabled: 0,
                epic_enabled: 0,
                subtask_enabled: 1
            };
            req.query = {
                user:"Roshni"
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
            controllers.addIssueType(req, res);
        })
    })

    /**
     * Test the List all issue type
     */
    describe('GET /globalIssueType', () => {
        req = {
            body: ''
        }
        it('It should list all the issueType', (done) => {
            let res;
            req.query = {
                domain_id:"jira.com"
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
            controllers.getList(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                domain_id: "test.com"
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
            controllers.getList(req, res);
        })
    })

    /**
     * Test the update issue type
     */
    describe('PUT /updateIssueType', () => {
        it('It should update global issue type', (done) => {
            let res;
            req.body = {
                domain_id: domainID,
                permission_status: 1,
                story_enabled: 1,
                task_enabled: 1,
                bug_enabled: 1,
                epic_enabled: 1,
                subtask_enabled: 1
            };
            req.query = {
                user:"Roshni"
            }
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
                sql_conn.globalIssueTypeModel.destroy({
                    where: {
                        'id': issueTypeID,
                        'domain_id':domainID
                    }
                }).catch(console.error);
                console.log("global issue type deleted================>done",issueTypeID);
                done();
                },
            }
            controllers.editIssueType(req, res);
        })

        it('It should return invalid if issue type details not found', (done) => {
            let res;
            req.body = {
                domain_id: "test.com",
                permission_status: 0,
                story_enabled: 0,
                task_enabled: 0,
                bug_enabled: 0,
                epic_enabled: 0,
                subtask_enabled: 0
            };
            req.query = {
                user:"Roshni"
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
            controllers.editIssueType(req, res);
        })
    })
}