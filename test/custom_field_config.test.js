process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/custom_field_config.ctrl.js');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post custom field
     */
    let customFieldID;
    let projectID;
    let domainID;
    let accountID;
    let cfName;
    describe('POST /customField', function(){
        req = {
            body: ''
        }
        it('It should create a new custom field config records', function(done){
            let res;
            req.body = {
                project_id: 101,
                domain_id: "jira.com",
                cfc_name: "cf4",
                cfc_field_type: "CheckBox",
                cfc_required_flag: 0,
                cfc_status:1,
                cfc_type: "testcase",
                cfc_options:"",
                acct_id:'Roshni'
            };
            res = {
                json(result) {
                result = result.res;
                customFieldID = result.data.customField.id;
                accountID = result.data.customField.created_by,
                projectID = result.data.customField.project_id,
                domainID = result.data.customField.domain_id,
                cfName = result.data.customField.cfc_name
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
            controllers.addCustomFieldConfig(req, res);
        })
        it('It should response exist if details already exist', function(done){
            let res;
            req.body = {
                project_id: 101,
                domain_id: "jira.com",
                cfc_name: "cf1",
                cfc_field_type: "CheckBox",
                cfc_required_flag: 0,
                cfc_status:1,
                cfc_type: "testcase",
                cfc_options:"",
                acct_id:'Roshni'
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.CF_EXIST_WITH_PROJECT,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addCustomFieldConfig(req, res);
        })
        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                project_id: 1010000,
                domain_id: "jira.com",
                cfc_name: "cf1",
                cfc_field_type: "CheckBox",
                cfc_required_flag: 0,
                cfc_status:1,
                cfc_type: "testcase",
                cfc_options:"",
                acct_id:'Roshni'
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
            controllers.addCustomFieldConfig(req, res);
        })
    })

    /**
     * Test the List all cf
     */
    describe('GET /customField/allList', () => {
        req = {
            body: ''
        }
        it('It should list all the cf config', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                cfc_type: "testcase"
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
            controllers.getAllCustomFieldList(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                project_id: 10000,
                domain_id: "test.com",
                cfc_type: "testcase"
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
            controllers.getAllCustomFieldList(req, res);
        })
    })
    /**
     * Test the update cf
     */
    describe('PUT /updateCf', () => {
        it('It should update custom field', (done) => {
            let res;
            req.body = {
                cfield_id: customFieldID,
                project_id: 101,
                domain_id: "jira.com",
                cfc_name: cfName,
                cfc_field_type: "TextBox",
                cfc_required_flag: 0,
                cfc_status:1,
                cfc_type: "testcase",
                cfc_options:"",
                acct_id:'Roshni'
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
            controllers.editCustomFieldConfig(req, res);
        })

        it('It should response already available if same custom field exist', (done) => {
            let res;
            req.body = {
                cfield_id: customFieldID,
                project_id: 101,
                domain_id: "jira.com",
                cfc_name: "cf1",
                cfc_field_type: "CheckBox",
                cfc_required_flag: 0,
                cfc_status:1,
                cfc_type: "testcase",
                cfc_options:"",
                acct_id:'Roshni'
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.CF_EXIST_WITH_PROJECT,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.editCustomFieldConfig(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                cfield_id: customFieldID,
                domain_id: "jira.com",
                cfc_name: "cf1",
                cfc_field_type: "TextBox",
                cfc_required_flag: 0,
                cfc_status:1,
                cfc_type: "testcase",
                cfc_options:"",
                acct_id:'Roshni',
                project_id:100000
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
            controllers.editCustomFieldConfig(req, res);
        })
    })

    /**
     * Test to delete custom field by ID
     */
    describe('DELETE /customField', () => {
        it('It should delete the custom field', (done) => {
            let res;
            req.query = {
                cfield_id: customFieldID,
                project_id:projectID,
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
                expect(result.data).to.not.equal(null)
                sql_conn.customFieldConfigModel.destroy({
                    where: {
                        'id':  customFieldID
                    }
                }).catch(console.error);
                console.log("custom field config deleted================>done");
                done();
                },
            }
            controllers.deleteCustomFieldConfig(req, res);
        })

        it('It should return db query error if cf ID not found', (done) => {
            let res;
            req.query = {
                cfield_id: 10000,
                project_id:projectID,
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
            controllers.deleteCustomFieldConfig(req, res);
        })
    })
}