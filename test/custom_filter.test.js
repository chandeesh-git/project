process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/custom_filter.ctrl.js');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if (dbConfig.db_name === dbConfig.test_db_name) {

    /**
     * Post Component
     */
    let customFilterID;
    let projectID;
    let domainID;
    let accountID
    describe('POST /customFilter/create', function () {
        req = {
            body: ''
        }
        it('It should create a new custom filter-create api ', function (done) {
            let res;
            req.body = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "Roshni",
                test_type: "testcase",
                filter_name: "Test filter",
                filter_key: "Name",
                filter_type: "public"
            };
            res = {
                json(result) {
                    result = result.res;
                    customFilterID = result.data.id;
                    accountID = result.data.created_by,
                        projectID = result.data.project_id,
                        domainID = result.data.domain_id
                    const response = {
                        status: 200,
                        message: message.CUSTOM_FILTER_ADD,
                    }
                    expect(result.status).to.equal(response.status)
                    expect(result.message).to.equal(response.message)
                    expect(result.data).to.not.equal(null)
                    done();
                },
            }
            controllers.create(req, res);
        })
    })

    /**
     * Custom filter listing
     */
    describe('GET /customFilter/list', () => {
        req = {
            body: ''
        }
        it('It should list all the component config', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "Roshni",
                test_type: "testcase"
            }
            res = {
                json(result) {
                    result = result.res
                    const response = {
                        status: 200,
                        message: message.FILTER_LIST,
                    }
                    expect(result.status).to.equal(response.status)
                    expect(result.message).to.equal(response.message)
                    expect(result.data).to.not.equal(null)
                    done();
                },
            }
            controllers.list(req, res);
        })
    })

    /**
     * Custom filter Detail
     */
     describe('GET /customFilter/detail', () => {
        req = {
            body: ''
        }
        it('It should give the custom filter details of that id', (done) => {
            let res;
            req.query = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "Roshni",
                custom_filter_id: "1"
            }
            res = {
                json(result) {
                    result = result.res
                    const response = {
                        status: 200,
                        message: message.FILTER_LIST,
                    }
                    expect(result.status).to.equal(response.status)
                    expect(result.message).to.equal(response.message)
                    expect(result.data).to.not.equal(null)
                    done();
                },
            }
            controllers.detail(req, res);
        })
    })

    /**
     * Custom filter update 
     */
    describe('POST /customFilter/update', function () {
        req = {
            body: ''
        }
        it('It should update a  custom filter-update api ', function (done) {
            let res;
            req.body = {
                project_id: 101,
                domain_id: "jira.com",
                acct_id: "Roshni",
                custom_filter_id: customFilterID,
                test_type: "testcase",
                filter_name: "Test filter",
                filter_key: "Name",
                filter_type: "public"
            };
            res = {
                json(result) {
                    result = result.res;
                    customFilterID = result.data.id;
                    accountID = result.data.created_by,
                        projectID = result.data.project_id,
                        domainID = result.data.domain_id
                    const response = {
                        status: 200,
                        message: message.CUSTOM_FILTER_ADD,
                    }
                    expect(result.status).to.equal(response.status)
                    expect(result.message).to.equal(response.message)
                    expect(result.data).to.not.equal(null)
                    done();
                },
            }
            controllers.update(req, res);
        })
    })
}