process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/component_config.ctrl.js');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post Component
     */
    let componentID;
    let projectID;
    let domainID;
    let accountID
    describe('POST /component', function(){
        req = {
            body: ''
        }
        it('It should create a new component config records', function(done){
            let res;
            req.body = {
                project_id: 101,
                domain_id: "jira.com",
                cp_name: "test component",
                cp_description: "This is test comp",
                cp_color: "",
                cp_type: "testcase"
            };
            req.query = {
                user:'Roshni'
            }
            res = {
                json(result) {
                result = result.res;
                componentID = result.data.id;
                accountID = result.data.created_by,
                projectID = result.data.project_id,
                domainID = result.data.domain_id
                const response = {
                    status:200,
                    message:message.COMPONENT_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createComponent(req, res);
        })

        it('It should response already available if same component exist', function(done){
            let res;
            req.body = {
                project_id: 101,
                domain_id: "jira.com",
                cp_name: "None",
                cp_description: "This is test comp",
                cp_color: "",
                cp_type: "testcase"
            };
            req.query = {
                user:'Roshni'
            }
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
            controllers.createComponent(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                project_id: 100000,
                domain_id: "jira.com",
                // cp_name: "None",
                cp_description: "This is test comp",
                cp_color: "",
                cp_type: "testcase",
            };
            req.query = {
                user:'Roshni'
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
            controllers.createComponent(req, res);
        })
    })

    /**
     * Test the List all component
     */
    describe('GET /component/componnetList', () => {
        req = {
            body: ''
        }
        it('It should list all the component config', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                cp_type: "testcase"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.COMPONENT_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.componentLists(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                project_id: 10000,
                domain_id: "test.com",
                cp_type: "testcase"
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
            controllers.componentLists(req, res);
        })
    })
    /**
     * Test the update component
     */
    describe('PUT /updateComponent', () => {
        it('It should update component', (done) => {
            let res;
            req.body = {
                cp_name: "test component",
                cp_description: "This is test comp",
                cp_color: "",
                updated_by: accountID,
                project_id: 101,
                domain_id: 'jira.com',
                component_id: componentID,
                cp_type:"testcase"
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.COMPONENT_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateComponent(req, res);
        })

        it('It should response already available if same name exist', (done) => {
            let res;
            req.body = {
                cp_name: "None",
                cp_description: "This is test comp",
                cp_color: "",
                updated_by: accountID,
                project_id: 101,
                domain_id: 'jira.com',
                component_id: componentID,
                cp_type:"testcase"
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
            controllers.updateComponent(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                cp_name: "None",
                cp_description: "This is test comp",
                cp_color: "",
                updated_by: accountID,
                project_id: 100000,
                domain_id: 'jira.com',
                component_id: componentID,
                cp_type:"testcase"
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
            controllers.updateComponent(req, res);
        })
    })

    /**
     * Test to delete status by ID
     */
    describe('DELETE /component', () => {
        it('It should delete the component', (done) => {
            let res;
            req.query = {
                component_id: componentID,
                project_id:projectID,
                domain_id:domainID,
                user:accountID
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.COMPONENT_DELETED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.equal(null)
                sql_conn.componentConfigModel.destroy({
                    where: {
                        'id':  componentID
                    }
                }).catch(console.error);
                console.log("component config deleted================>done");
                done();
                },
            }
            controllers.deleteComponent(req, res);
        })

        it('It should return db query error if status ID not found', (done) => {
            let res;
            req.query = {
                component_id: 10000,
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
            controllers.deleteComponent(req, res);
        })
    })
}