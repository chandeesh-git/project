process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/label_config.ctrl');
let message = require('../src/utils/message');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post label
     */
    let labelID;
    let projectID;
    let domainID;
    let accountID
    describe('POST /labelConfig', function(){
        req = {
            body: ''
        }
        it('It should create a new label config records', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                lc_name: "label1",
                project_id: 101,
                domain_id: "jira.com",
            };
            res = {
                json(result) {
                result = result.res;
                labelID = result.data.label.id;
                accountID = result.data.label.created_by,
                projectID = result.data.label.project_id,
                domainID = result.data.label.domain_id
                const response = {
                    status:200,
                    message:message.LABEL_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addLabelConfig(req, res);
        })

        it('It should response exist if same label name already available', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                lc_name: "test label",
                project_id: 101,
                domain_id: "jira.com",
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.NAME_EXIST_WITH_PROJECT,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addLabelConfig(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                lc_name: "label1",
                project_id: 1010,
                domain_id: "test.com"
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
            controllers.addLabelConfig(req, res);
        })
    })

    /**
     * Test the List all label
     */
    describe('GET /label/listAll', () => {
        req = {
            body: ''
        }
        it('It should list all the label config', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.LABEL_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getAllLabelList(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                project_id: 100,
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
            controllers.getAllLabelList(req, res);
        })
    })

    /**
     * Test to delete label by ID
     */
    describe('DELETE /label', () => {
        it('It should delete the label', (done) => {
            let res;
            req.query = {
                label_id: labelID,
                project_id:projectID,
                domain_id:domainID
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
                done();
                },
            }
            controllers.deleteLabelConfig(req, res);
        })

        it('It should return invalid if label ID not found', (done) => {
            let res;
            req.query = {
                label_id: 10000,
                project_id:projectID,
                domain_id:domainID
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
            controllers.deleteLabelConfig(req, res);
        })
    })
}