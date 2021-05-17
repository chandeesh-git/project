let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_user_group.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){
    /**
     * Test for create user Group entry
     */
    let userGroupId;
    let groupID;
    let accountID
    describe('POST /userGroup', function(){
        req = {
            body: ''
        }
        it('It should create a new user-role records', function(done){
            let res;
            req.body = {
                group_id: 1,
                user_name: 'Roshni Bhengra',
                user_id: 'JIRA123'
            };
            req.query = {
                user: "r.bhengra@thesynapses.com"
            }
            res = {
                json(result) {
                result = result.res;
                userGroupId = result.data.id;
                groupID = result.data.group_id;
                accountID = result.data.created_by
                const response = {
                    status:200,
                    message:message.USER_ADDED_TO_GROUP,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addUsersToGroup(req, res);
        })
    })

    /**
     * Test to list user-group
     */
    describe('GET /userGroup', () => {
        it('It should list all the user-group mapped record', (done) => {
            let res;
            req.query = {
                domain_id : "jira.com"
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.ACTIVE_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.userGroupActiveList(req, res);
        })

        it('It should not list all the user-group mapped record if details not found', (done) => {
            let res;
            req.query = {
                domain_id : "test.com"
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
            controllers.userGroupActiveList(req, res);
        })
    })

    
    /**
    * Test the update user-group mapping table
    */
    describe('PUT /updateUserGroup', () => {
        it('It should update the user-group mapping table', (done) => {
            let res;
            req.body = {
                id: userGroupId,
                group_id: groupID,
                user_name: 'Rihana',
                is_active: 1
            };
            req.query = {
                user: accountID,
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
            controllers.editUserGroup(req, res);
        })

        it('It should not update the user-group mapping table', (done) => {
            let res;
            req.body = {
                id: 100001,
                acct_id: accountID,
                group_id: groupID,
                user_name: 'Rihana',
                is_active: 1
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
            controllers.editUserGroup(req, res);
        })
    })

    /**
     * Test to delete user-group by ID
     */
    describe('DELETE /userGroup', () => {
        it('It should delete the user-group mapping records', (done) => {
            let res;
            req.query = {
                group_id: userGroupId
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.USER_GROUP_DELETED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                sql_conn.globalUserGroupModel.destroy({
                    where: {
                        'id': userGroupId
                    }
                }).catch(console.error);
                console.log("global user group deleted================>done",userGroupId);
                done();
                },
            }
            controllers.deleteUserGroup(req, res);
        })

        it('It should not delete the user-group mapping records if ID not found', (done) => {
            let res;
            req.query = {
                group_id: 100000
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
            controllers.deleteUserGroup(req, res);
        })
    })
}