process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_environment_config.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post global environment
     */
    let envID;
    let domainID;
    let acccountID
    describe('POST /globalEnvConfig', function(){
        req = {
            body: ''
        }
        it('It should create a new global env config records', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "test env001",
                domain_id: "jira.com",
                ec_description: "env desc",
            };
            req.query = {
                user: "Roshni"
            }
            res = {
                json(result) {
                result = result.res;
                envID = result.data.globalEnv.id;
                accountID = result.data.globalEnv.created_by,
                domainID = result.data.globalEnv.domain_id
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
            controllers.addGlobalEnvConfig(req, res);
        })

        it('It should response environment available if same name already exist', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "Development",
                domain_id: "test.com",
                ec_description: "env desc"
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
            controllers.addGlobalEnvConfig(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "env1",
                ec_description: "env desc",
                domain_id: ""
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
            controllers.addGlobalEnvConfig(req, res);
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
            controllers.allGlobalEnvList(req, res);
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
            controllers.allGlobalEnvList(req, res);
        })
    })

    /**
     * Test the update env
     */
    describe('PUT /updateEnv', () => {
        it('It should update env', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "test env002",
                domain_id: "jira.com",
                ec_description: "env desc",
                global_env_id: envID,
                is_active:true
            };
            req.query = {
                user: "Roshni"
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
                done();
                },
            }
            controllers.editGlobalEnvConfig(req, res);
        })
        it('It should response already available if same name exist', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "Test",
                domain_id: "test.com",
                ec_description: "env desc",
                global_env_id: envID
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
            controllers.editGlobalEnvConfig(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                ec_name: "env1",
                ec_description: "env desc",
                acct_id: accountID,
                domain_id: 'jira.com',
                global_env_id: envID
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
            controllers.editGlobalEnvConfig(req, res);
        })
    })

    /**
     * Test to delete global environment by ID
     */
    describe('DELETE /globalEnvironment', () => {
        it('It should delete the global environment', (done) => {
            let res;
            req.query = {
                global_env_id: envID,
                domain_id:domainID,
                user:"Roshni"
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
                sql_conn.globalEnvironmentConfig.destroy({
                    where: {
                        'id':  envID
                    }
                }).catch(console.error);
                console.log("global env deleted================>done",envID);
                done();
                },
            }
            controllers.deleteGlobalEnvConfig(req, res);
        })

        it('It should return invalid if env ID not found', (done) => {
            let res;
            req.query = {
                global_env_id: 10000,
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
            controllers.deleteGlobalEnvConfig(req, res);
        })
    })
}