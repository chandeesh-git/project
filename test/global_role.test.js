let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_role.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){
/**
 * Test for create Role
 */
var roleId;
var accountID;
var domainID;
    describe('POST /role', function(){
        req = {
            body: ''
        }
        it('It should POST a new role', function(done){
            let res;
            req.body = {
                role_name: "Role12",
                domain_id: "jira.com"
            };
            req.query = {
                user: "xyz@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                roleId = result.data.id;
                accountID = result.data.acct_id,
                domainID = result.data.domain_id;
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
            controllers.addRole(req, res);
        })

        it('It should response exist if same role available', function(done){
            let res;
            req.body = {
                role_name: "admin",
                domain_id: "jira.com"
            };
            req.query = {
                user: "xyz@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.ROLE_EXIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addRole(req, res);
        })

        it('It should response invalid if details not floud', function(done){
            let res;
            req.body = {
                role_name: "Role12",
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
            controllers.addRole(req, res);
        })
    })
     /**
     * Test to list Roles
     */
    describe('GET /role', () => {
        it('It should list all the roles', (done) =>{
            let res;
            req.query = {
                domain_id: domainID
            }
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
            controllers.getRoles(req, res);
        })
        it('It should list empty array if no roles found', (done) =>{
            let res;
            req.query = {
                domain_id: "xyz.com"
            }
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
            controllers.getRoles(req, res);
        })

        it('It should db error if no details found', (done) =>{
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
            controllers.getRoles(req, res);
        })
    })
/**
* Test the update role
*/
    describe('PUT /updateRole', () => {
        it('It should update the role and access on role', (done) => {
            let res;
            let roleUpdateData;
                roleUpdateData = 
                    {
                        "role_id": roleId,
                        "domain_id": domainID,
                        "allow_testcase_create" : 1,
                        "allow_testcase_edit" : 1,
                        "allow_testcase_read" : 1,
                        "allow_testcase_delete" : 1,
                        "allow_testcase_archive" : 1, 
                        "allow_testcase_versions" : 1,
                        "allow_testcase_folders" : 1,
                        "allow_testplan_create" : 1,
                        "allow_testplan_edit" : 1,
                        "allow_testplan_view" : 1,
                        "allow_testplan_delete" : 0, 
                        "allow_testplan_folders" : 0,
                        "allow_testcycle_create" : 0,
                        "allow_testcycle_edit" : 0,
                        "allow_testcycle_view" : 0,
                        "allow_testcycle_execute" : 0,
                        "allow_testcycle_delete" : 0,
                        "allow_testcycle_folders" : 0,
                        "allow_reports_create" : 0,
                        "allow_configuration" : 0 
                    }


            req.body = {
                "acct_id":accountID,
                'roleUpdate' : JSON.stringify([roleUpdateData])
            }
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
            controllers.updateRoles(req, res);
        })

        it('It should res db eror if no details found', (done) => {
            let res;
            req.body = {
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
            controllers.updateRoles(req, res);
        })
    })

    /**
     * Test to delete role by ID
     */
    describe('DELETE /role', () => {
        it('It should delete the role', (done) => {
            let res;
            req.query = {
                role_id: roleId
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.ROLE_INACTIVATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                sql_conn.globalRoleModel.destroy({
                    where: {
                        'id': roleId
                    }
                }).catch(console.error);
                console.log("global role deleted================>done",roleId);
                done();
                },
            }
            controllers.deleteRoles(req, res);
        })

        it('It should return query error if no role found', (done) => {
            let res;
            req.query = {
                role_id: 1000,
                user:"Roshni"
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
            controllers.deleteRoles(req, res);
        })
    })
}