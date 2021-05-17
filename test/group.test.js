process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/group.ctrl');
let message = require('../src/utils/message');
if(dbConfig.db_name === dbConfig.test_db_name){
var groupID;
var accountID;
/**
 * Test to post new groups
 */
var groupName;
    describe('POST /groups', function(){
        req = {
            body: ''
        }
        it('It should POST a new group', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                group_name: "GRP-Testers1",
                project_id: 101,
                domain_id: "jira.com"
            };
            res = {
                json(result) {
                result = result.res
                groupID = result.data.id;
                accountID = result.data.created_by
                groupName = result.data.group_name
                const response = {
                    status:200,
                    message:message.GROUP_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addGroups(req, res);
        })

        it('It should response exist if already available', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                group_name: "GRP-Testers",
                project_id: 101,
                domain_id: "jira.com"
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.GROUP_EXIST_IN_PROJECT,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addGroups(req, res);
        })

        it('It should response invalid details if correct prject and domain details not entered', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                group_name: "GRP-Testers",
                project_id: 101,
                domain_id: "test.com"
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.INVALID_DETAILS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addGroups(req, res);
        })

        it('It should response db error details not entered', function(done){
            let res;
            req.body = {};
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
            controllers.addGroups(req, res);
        })
    })
    /**
     * Test the List all groups
     */
    describe('GET /group/listAll', () => {
        req = {
            body: ''
        }
        it('It should list all the groups', (done) => {
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
                    message:message.GROUP_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.allGroupList(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                project_id: 100,
                domain_id:"test.com"
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
            controllers.allGroupList(req, res);
        })
    })
    /**
     * Test the List all groups
     */
    describe('GET /group/listAllActive', () => {
        it('It should list all the active groups', (done) =>{
            let res;
            req.query = {
                project_id:101,
                domain_id:"jira.com"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.GROUP_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.activeGroupList(req, res);
        })

        it('It should not list groups if details not available', (done) => {
            let res;
            req.query = {
                project_id:100,
                domain_id:"jira.com"
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
            controllers.activeGroupList(req, res);
        })
    })

    /**
     * Test the update groups
     */
    describe('PUT /updateGroup', () => {
        it('It should update the groups', (done) => {
            let res;
            req.body = {
                acct_id: accountID,
                group_name: "GRP-Testers2",
                group_id: groupID,
                // project_id: 101,
                // domain_id:"jira.com",
                is_active:1
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.GROUP_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateGroup(req, res);
        })

        it('It should update the groups', (done) => {
            let res;
            req.body = {};
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
            controllers.updateGroup(req, res);
        })
    })

    /**
     * Test the update role in groups
     */
    describe('PUT /updateRoleGroup', () => {
        it('It should update the Role in groups', (done) => {
            let res;
            req.body = {
                acct_id: accountID,
                group_id: groupID,
                role_id: 2
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.GROUP_ROLE_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.updateGroupsRole(req, res);
        })

        it('It should return invalid if group details not found', (done) => {
            let res;
            req.body = {
                acct_id: accountID,
                group_id: 1000,
                role_id: 2
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
            controllers.updateGroupsRole(req, res);
        })
    })

    /**
     * Test the List all groups without role
     */
    describe('GET /listGroupWithNoRole', () => {
        it('It should list all the groups,not assigned any role', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.GROUP_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.groupListWithoutRole(req, res);
        })

        it('It should list no groups,if assigned any role', (done) => {
            let res;
            req.query = {
                project_id: 100,
                domain_id: "jira.com"
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
            controllers.groupListWithoutRole(req, res);
        })
    })

    /**
     * Test to delete group by ID
     */
    describe('DELETE /group', () => {
        it('It should delete the group', (done) => {
            let res;
            req.query = {
                group_id: groupID
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.GROUP_DELETED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteGroups(req, res);
        })

        it('It should return invalid if group not found', (done) => {
            let res;
            req.query = {
                group_id: 10000
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:401,
                    message:message.INVALID_DETAILS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteGroups(req, res);
        })
        it('It should return db error if no details found', (done) => {
            let res;
            req.query = {};
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
            controllers.deleteGroups(req, res);
        })
    })   
}