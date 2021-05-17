process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/folder.ctrl');
require('../db/mongoose_models/testIndex')
let message = require('../src/utils/message');
let mongodbConfig = require('../db/mongoose_models/config/config_detail');
var sql_conn = require('../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
if((dbConfig.db_name === dbConfig.test_db_name) && mongodbConfig.test_utdb_url){
/**
 * Test to post new folder
 */
    var folderID;
    var accountID;
    let projectID;
    let domainID;
    describe('POST /folder', function(){
        req = {
            body: ''
        }
        it('It should POST a new folder for testcase', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder",
                project_id: 101,
                domain_id: "jira.com",
                folder_category:"testcase",
                parent_folder_id:''
            };
            res = {
                json(result) {
                result = result.res
                console.log("result========>",result);
                folderID = result.data.id;
                console.log("folderID=======>",folderID);
                accountID = result.data.created_by;
                domainID = result.data.domain_id;
                projectID = result.data.project_id;
                const response = {
                    status:200,
                    message:message.FOLDER_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createFolder(req, res);
        })
        it('It should POST a new folder for testcycle', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder",
                project_id: 101,
                domain_id: "jira.com",
                folder_category:"testcycle",
                parent_folder_id:''
            };
            res = {
                json(result) {
                result = result.res
                folderID = result.data.id;
                accountID = result.data.created_by;
                const response = {
                    status:200,
                    message:message.FOLDER_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createFolder(req, res);
        })
        it('It should POST a new folder for testplan', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder",
                project_id: 101,
                domain_id: "jira.com",
                folder_category:"testplan",
                parent_folder_id:''
            };
            res = {
                json(result) {
                result = result.res
                folderID = result.data.id;
                accountID = result.data.created_by;
                const response = {
                    status:200,
                    message:message.FOLDER_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createFolder(req, res);
        })

        it('It should create a parent folder', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder",
                project_id: 101,
                domain_id: "jira.com",
                folder_category:"testcase",
                parent_folder_id: 7
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createFolder(req, res);
        })

        it('It should create a parent folder for testcycle', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder",
                project_id: 101,
                domain_id: "jira.com",
                folder_category:"testcycle",
                parent_folder_id: 7
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createFolder(req, res);
        })

        it('It should create a parent folder for testplan', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder",
                project_id: 101,
                domain_id: "jira.com",
                folder_category:"testplan",
                parent_folder_id: 7
            };
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.createFolder(req, res);
        })

        it('It should response invalid details if correct prject and domain details not entered', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder",
                project_id: 101,
                domain_id: "test.com",
                folder_category:"testcase",
                parent_folder_id:''

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
            controllers.createFolder(req, res);
        })
    })
    /**
     * Test the List all testcase/testcycle/testplan with no folder
     */
    describe('GET /folder/listAll', () => {
        req = {
            body: ''
        }
        it('It should list all the testcase folder', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                folder_category:'testcase',
                acct_id: "r.bhengra@thesynapses.com",
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listFolders(req, res);
        })

        it('It should list all the testcycle folder', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                folder_category:'testcycle',
                acct_id: "r.bhengra@thesynapses.com",
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listFolders(req, res);
        })

        it('It should list all the testplan folder', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id:"jira.com",
                folder_category:'testplan',
                acct_id: "r.bhengra@thesynapses.com",
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.listFolders(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                project_id: 100,
                domain_id:"test.com",
                folder_category:'testcase'
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
            controllers.listFolders(req, res);
        })
    })
    /**
     * Test to List all testcase/testcycle/testplan with folder
     */
    describe('GET /folder/subfolderList', () => {
        it('It should list all the testcases with folder list', (done) =>{
            req = {
                body: ''
            }
            let res;
            req.query = {
                project_id:101,
                domain_id:"jira.com",
                parent_folder_id:7,
                folder_category:"testcase"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.subFolder(req, res);
        })

        it('It should list all the testcycle with folder list', (done) =>{
            let res;
            req.query = {
                project_id:101,
                domain_id:"jira.com",
                parent_folder_id:7,
                folder_category:"testcycle"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.subFolder(req, res);
        })

        it('It should list all the testplan with folder list', (done) =>{
            let res;
            req.query = {
                project_id:101,
                domain_id:"jira.com",
                parent_folder_id:7,
                folder_category:"testplan"
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FOLDER_LIST,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.subFolder(req, res);
        })

        it('It should not list folders if details not available', (done) => {
            let res;
            req.query = {
                project_id:100,
                domain_id:"jira.com",
                parent_folder_id:"",
                folder_category:"testcase"
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
            controllers.subFolder(req, res);
        })
    })
    
    describe('PUT /folder', function(){
        req = {
            body: ''
        }
        it('It should update given folder for testcase', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder Update",
                project_id: 101,
                domain_id: "jira.com",
                folder_category:"testcase",
                folder_id: 1,
                parent_folder_id:''
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.FOLDER_UPDATED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.renameFolder(req, res);
        })

        it('It should res invalid details', function(done){
            let res;
            req.body = {
            };
            res = {
                json(result) {
                result = result.res;
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
            controllers.renameFolder(req, res);
        })

        it('It should response db query error', function(done){
            let res;
            req.body = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder Update",
                project_id: 101
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
            controllers.renameFolder(req, res);
        })
    })

    describe('GET /folder/testFlag', function(){
        req = {
            body: ''
        }
        it('It should test if any testcase available', function(done){
            let res;
            req.query = {
                acct_id: "r.bhengra@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                test_type:"testcase"
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.TEST_FLAG,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.testFlag(req, res);
        })

        it('It should response db query error', function(done){
            let res;
            req.query = {
                acct_id: "r.bhengra@thesynapses.com",
                folder_name: "Test Folder Update",
                project_id: 101
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
            controllers.testFlag(req, res);
        })
    })
    //delete folder
    describe(' DELETE /folder', function(){
        req = {
            body: ''
        }
        it('It should test delete folder', function(done){
            let res;
            req.query = {
                user: "r.bhengra@thesynapses.com",
                project_id: 101,
                domain_id: "jira.com",
                folder_id:11,
                test_type:"testcase"
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:200,
                    message:message.FOLDER_DELETED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteFolder(req, res);
        })

        it('It should response db query error', function(done){
            let res;
            req.query = {
                acct_id: "r.bhengra@thesynapses.com",
                project_id: 101
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
            controllers.deleteFolder(req, res);
        })

        it('It should response insufficient access', function(done){
            let res;
            req.query = {
                acct_id: "",
                project_id: 101,
                domain_id: "jira.com",
            };
            res = {
                json(result) {
                result = result.res;
                const response = {
                    status:401,
                    message:message.INSUFFICIENT_ACCESS,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.deleteFolder(req, res);
        })
    })
    it('It should test if any testcase present ,then it will not delete folder', function(done){
        let res;
        req.query = {
            user: "r.bhengra@thesynapses.com",
            project_id: 101,
            domain_id: "jira.com",
            folder_id:1,
            test_type:"testcase"
        };
        res = {
            json(result) {
            result = result.res;
            const response = {
                status:401,
                message:message.FOLDER_NOT_DELETE,
            }
            expect(result.status).to.equal(response.status)
            expect(result.message).to.equal(response.message)
            expect(result.data).to.not.equal(null)
            done();
            },
        }
        controllers.deleteFolder(req, res);
    })
}