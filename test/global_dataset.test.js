process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/global_dataset_config.ctrl');
let message = require('../src/utils/message');
var sql_conn = require('../db/sequelize_models');
if(dbConfig.db_name === dbConfig.test_db_name){

    /**
     * Post dataset
     */
    let datasetID;
    let domainID;
    let accountID
    describe('POST /datasetConfig', function(){
        req = {
            body: ''
        }
        it('It should create a new dataset config records', function(done){
            let res;
            req.body = {
                dc_name: "dc12",
                domain_id: "jira.com",
                dc_description: "dc desc"
            };
            req.query = {
                user:"Roshni"
            }
            res = {
                json(result) {
                result = result.res;
                datasetID = result.data.dataset.id;
                accountID = result.data.dataset.created_by,
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
                dc_name: "dc1",
                domain_id: "test.com",
                dc_description: "dc desc"
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
            controllers.addDatasetConfig(req, res);
        })

        it('It should response invalid if details not matched', function(done){
            let res;
            req.body = {
                dc_name: "dc1",
                domain_id: "test.com",
                dc_description: "dc desc"
            };
            req.query = {
                user:"Roshni"
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
    describe('PUT /updateDataset', () => {
        it('It should update dataset', (done) => {
            let res;
            req.body = {
                dc_name: "dataset1",
                domain_id: "jira.com",
                global_dataset_id: datasetID,
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
            controllers.editDatasetConfig(req, res);
        })

        it('It should response already available if same name exist', (done) => {
            let res;
            req.body = {
                acct_id: "ROSHNI123",
                dc_name: "dc1",
                project_id: 101,
                domain_id: "jira.com",
                dc_description: "dc desc",
                global_dataset_id: datasetID,
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
            controllers.editDatasetConfig(req, res);
        })

        it('It should return invalid if status details not found', (done) => {
            let res;
            req.body = {
                dc_name: "dataset1",
                domain_id: 'jira.com',
                global_dataset_id: datasetID
            };
            req.query = {
                user: accountID
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
                global_dataset_id: datasetID,
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
                sql_conn.globalDatasetConfig.destroy({
                    where: {
                        'id':  datasetID
                    }
                }).catch(console.error);
                console.log("global dataset deleted================>done",datasetID);
                done();
                },
            }
            controllers.deleteDatasetConfig(req, res);
        })

        it('It should return invalid if dataset ID not found', (done) => {
            let res;
            req.query = {
                global_dataset_id: 10000,
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