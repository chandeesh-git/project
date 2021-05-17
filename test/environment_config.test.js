process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/environment_config.ctrl');
let message = require('../src/utils/message');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post environment
     */
    let envID;
    let projectID;
    let domainID;
    let acccountID
    describe('POST /envConfig', function(){
        req = {
            body: ''
        }
        it('It should create a new env config records', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "test env10",
                project_id: 101,
                domain_id: "jira.com",
                ec_description: "env desc"
            };
            res = {
                json(result) {
                result = result.res;
                envID = result.data.environment.id;
                accountID = result.data.environment.created_by,
                projectID = result.data.environment.project_id,
                domainID = result.data.environment.domain_id
                const response = {
                    status:200,
                    message:message.ENV_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addEnvConfig(req, res);
        })

        it('It should response environment available if same name already exist', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "env1",
                project_id: 101,
                domain_id: "jira.com",
                ec_description: "env desc"
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
            controllers.addEnvConfig(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "env1",
                project_id: 1010,
                domain_id: "test.com",
                ec_description: "env desc"
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
            controllers.addEnvConfig(req, res);
        })
    })

    /**
     * Test the List all environment
     */
    describe('GET /environment/listAll', () => {
        req = {
            body: ''
        }
        it('It should list all the env config', (done) => {
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
                    message:message.ENV_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getAllEnvList(req, res);
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
            controllers.getAllEnvList(req, res);
        })
    })
    /**
     * Test to get environment by ID
     */
    describe('GET /environment/id', () => {
        it('It should get the environment details', (done) => {
            let res;
            req.query = {
                env_id: envID,
                project_id:projectID,
                domain_id:domainID
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.ENV_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getEnvConfigById(req, res);
        })

        it('It should return invalid if env ID not found', (done) => {
            let res;
            req.query = {
                env_id: 10000,
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
            controllers.getEnvConfigById(req, res);
        })
    })

    /**
     * Test the update environment
     */
    describe('PUT /editEnv', () => {
        it('It should edit environmet', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "test env10",
                project_id: 101,
                domain_id: "jira.com",
                ec_description: "env desc",
                env_id: envID
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
            controllers.editEnvConfig(req, res);
        })

        it('It should response already available if same name exist', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "env1",
                project_id: 101,
                domain_id: "jira.com",
                ec_description: "env desc",
                env_id: envID
            };
            res = {
                json(result) {
                result = result.res
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
            controllers.editEnvConfig(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "test env10",
                project_id: 10100,
                domain_id: "jira.com",
                ec_description: "env desc",
                env_id: envID,
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
            controllers.editEnvConfig(req, res);
        })
    })

    /**
     * Test to delete environment by ID
     */
    describe('DELETE /environment', () => {
        it('It should delete the environment', (done) => {
            let res;
            req.query = {
                env_id: envID,
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
            controllers.deleteEnvConfig(req, res);
        })

        it('It should return invalid if env ID not found', (done) => {
            let res;
            req.query = {
                env_id: 10000,
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
            controllers.deleteEnvConfig(req, res);
        })
    })
}