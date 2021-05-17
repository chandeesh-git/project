let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/user-role.ctrl');
let message = require('../src/utils/message');

if(dbConfig.db_name === dbConfig.test_db_name){
/**
 * Test for create user Role entry
 */
var userRoleId;
var accountID;
var roleID;
    describe('POST /userRole', function(){
        req = {
            body: ''
        }
        it('It should create a new user-role records', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                role_id: 7,
                user_name: 'Roshni Bhengra',
                user_id: 'JIRA123'
            };
            res = {
                json(result) {
                result = result.res;
                userRoleId = result.data.id;
                accountID = result.data.created_by;
                roleID = result.data.role_id
                const response = {
                    status:200,
                    message:message.ROLE_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createUserRole(req, res);
        })
    })

/**
 * Test to list Roles
 */
    describe('GET /userRole', () => {
        it('It should list all the user-role mapped record', (done) => {
            let res;
            req.query = {
                project_id : 101,
                domain_id :'jira.com'
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.ROLE_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getUserRolesList(req, res);
        })

        it('It should not list all records if no details found', (done) => {
            let res;
            req.query = {
                project_id : 101,
                domain_id :'test.com'
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
            controllers.getUserRolesList(req, res);
        })
    })

/**
 * Test to list active user Roles mapped list
 */
    describe('GET /userRole', () => {
        it('It should list all the active user-role mapped record', (done) => {
            let res;
            req.query = {
                project_id : 101,
                domain_id : 'jira.com'
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.ROLE_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.userRoleListAll(req, res);
        })

        it('It should not list all the active user-role record if role not found', (done) => {
            let res;
            req.query = {
                project_id : 101,
                domain_id : 'test.com'
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
            controllers.userRoleListAll(req, res);
        })
    })
    /**
     * Test the update user-role mapping table
     */
    describe('PUT /updateUserRole', () => {
        it('It should update the user-role', (done) => {
            let res;
            req.body = {
                acct_id: accountID,
                user_name: "Anjali",
                role_id: roleID,
                id:userRoleId,
                is_active:1
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.ROLE_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.editUserRoles(req, res);
        })

        it('It should not update the user-role if role not found', (done) => {
            let res;
            req.body = {
                acct_id: accountID,
                user_name: "Anjali",
                role_id: roleID,
                id:100001,
                is_active:1
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
            controllers.editUserRoles(req, res);
        })
    })

    /**
     * Test to delete user-role by ID
     */
    describe('DELETE /userRole', () => {
        it('It should delete the user-role mapping records', (done) => {
            let res;
            req.query = {
                id: userRoleId
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.USER_ROLE_DELETED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteUserRole(req, res);
        })

        it('It should not delete the user-role mapping record if ID not found', (done) => {
            let res;
            req.query = {
                id: 10000
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
            controllers.deleteUserRole(req, res);
        })
    })
}