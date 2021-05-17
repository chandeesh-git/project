process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_label_config.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post global label
     */
    let labelID;
    let domainID;
    let accountID
    describe('POST /globalLabelConfig', function(){
        req = {
            body: ''
        }
        it('It should create a new global label config records', function(done){
            let res;
            req.body = {
                lc_name: "label1",
                domain_id: "jira.com"
            };
            req.query = {
                user:"Roshni"
            }
            res = {
                json(result) {
                result = result.res;
                labelID = result.data.label.id;
                accountID = result.data.label.created_by,
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
                lc_name: "label1",
                domain_id: "test.com",
            };
            req.query = {
                user:"Roshni"
            }
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
            controllers.addLabelConfig(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                lc_name: "label1",
                domain_id: "test.com"
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
                global_label_id: labelID,
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
                sql_conn.globalLabelConfig.destroy({
                    where: {
                        'id':  labelID
                    }
                }).catch(console.error);
                console.log("global label deleted================>done",labelID);
                done();
                },
            }
            controllers.deleteLabelConfig(req, res);
        })

        it('It should return invalid if label ID not found', (done) => {
            let res;
            req.query = {
                global_label_id: 10000,
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