process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/dataset_config.ctrl');
let message = require('../src/utils/message');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post dataset
     */
    let datasetID;
    let projectID;
    let domainID;
    let accountID
    describe('POST /datasetConfig', function(){
        req = {
            body: ''
        }
        it('It should create a new dataset config records', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                dc_name: "dc1",
                project_id: 101,
                domain_id: "jira.com",
                dc_description: "dc desc"
            };
            res = {
                json(result) {
                result = result.res;
                datasetID = result.data.dataset.id;
                accountID = result.data.dataset.created_by,
                projectID = result.data.dataset.project_id,
                domainID = result.data.dataset.domain_id
                const response = {
                    status:200,
                    message:message.DATASET_ADDED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.addDatasetConfig(req, res);
        })

        it('It should response dataset available if same name already exist', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                dc_name: "test dataset",
                project_id: 101,
                domain_id: "jira.com",
                dc_description: "dc desc"
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
            controllers.addDatasetConfig(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                dc_name: "dc1",
                project_id: 1010,
                domain_id: "test.com",
                dc_description: "dc desc"
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
            controllers.addDatasetConfig(req, res);
        })
    })

    /**
     * Test the List all dataset
     */
    describe('GET /dataset/listAll', () => {
        req = {
            body: ''
        }
        it('It should list all the dataset config', (done) => {
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
                    message:message.DATASET_LIST_FETCHED,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.getAllDatasetList(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
                project_id: 10000,
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
            controllers.getAllDatasetList(req, res);
        })
    })

    /**
     * Test the update dataset
     */
    describe('PUT /editDataset', () => {
        it('It should update dataset', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                dc_name: "dc12",
                project_id: 101,
                domain_id: "jira.com",
                dc_description: "dc desc",
                dataset_id: datasetID,
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
            controllers.editDatasetConfig(req, res);
        })

        it('It should response already available if same name exist', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                dc_name: "test dataset",
                project_id: 101,
                domain_id: "jira.com",
                dc_description: "dc desc",
                dataset_id: datasetID,
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
            controllers.editDatasetConfig(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                dc_name: "test dc",
                project_id: 10100,
                domain_id: "jira.com",
                dc_description: "dc desc",
                dataset_id: datasetID,
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
            controllers.editDatasetConfig(req, res);
        })
    })


    /**
     * Test to delete dataset by ID
     */
    describe('DELETE /dataset', () => {
        it('It should delete the dataset', (done) => {
            let res;
            req.query = {
                dataset_id: datasetID,
                project_id: projectID,
                domain_id: domainID
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
            controllers.deleteDatasetConfig(req, res);
        })

        it('It should return invalid if dataset ID not found', (done) => {
            let res;
            req.query = {
                dataset_id: 10000,
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
            controllers.deleteDatasetConfig(req, res);
        })
    })
}