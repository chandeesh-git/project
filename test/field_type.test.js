process.env.NODE = 'test'
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = require('chai').expect;
let dbConfig = require('../db/sequelize_models/config/config_detail');
let controllers = require('../src/controllers/field_type.ctrl');
let message = require('../src/utils/message');
if(dbConfig.db_name === dbConfig.test_db_name){
    /**
     * Test the List all field type
     */
    describe('GET /field/listAll', () => {
        req = {
            body: ''
        }
        it('It should list all the field type config in custom field config section', (done) => {
            let res;
            req = {
            }
            res = {
                json(result) {
                result = result.res
                const response = {
                    status:200,
                    message:message.FIELD_TYPE_DETAIL,
                }
                expect(result.status).to.equal(response.status)
                expect(result.message).to.equal(response.message)
                expect(result.data).to.not.equal(null)
                done();
                },
            }
            controllers.allFieldTypeList(req, res);
        })

        it('It should response invalid details if given details not found', (done) => {
            let res;
            req.query = {
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
            controllers.allFieldTypeList(req, res);
        })
    })
}