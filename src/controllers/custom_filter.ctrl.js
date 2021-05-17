const customFilterService = require('../services/custom_filter.service').customFilterService;
const { response } = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef customFilter
 * @property {string} acct_id.data.required - acct_id of cloud app
 * @property {integer} project_id.data.required - project_id of project
 * @property {string} domain_id.data.required - domain_id of project
 * @property {string} filter_name.data.required - filter name that is created   
 * @property {string} test_type.data.required - test type like testcase , testcycle, testplan 
 * @property {string} filter_key - filter key like a string of category name , status etc
 * @property {string} filter_type - filter type is like - public or private
 */
/**
 * This function is used to add projectInfo
 * @route POST /customFilter/create
 * @security JWT
 * @group customFilter
 * @param {customFilter.model} folder.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.create = async (req, res) => {
    try {
        let data = {};
        data['acct_id'] = req.body.acct_id;
        data['project_id'] = parseInt(req.body.project_id);
        data['domain_id'] = req.body.domain_id;
        data['filter_name'] = req.body.filter_name;
        data['test_type'] = req.body.test_type;
        data['filter_key'] = req.body.filter_key;
        data['filter_type'] = req.body.filter_type;
        data['created_by'] = req.body.acct_id;
        data['updated_by'] = req.body.acct_id;

        let result = await customFilterService.createFilter(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * @typedef updateFilter
 * @property {string} acct_id.data.required - acct_id of cloud app
 * @property {integer} project_id.data.required - project_id of project
 * @property {string} domain_id.data.required - domain_id of project
 * @property {string} custom_filter_id.data.required - custom_filter_id 
 * @property {string} filter_name.data.required - filter_name 
 * @property {string} test_type.data.required - test_type like testcase, testcycle , testplan
 * @property {string} filter_key.data.required - filter_key -the criteria of filter  
 * @property {string} filter_type.data.required - filter_type public/private 
 */
/**
 * This function is used to rename the added folder
 * @route PUT /customFilter/update
 * @security JWT
 * @group customFilter
 * @param {updateFilter.model} updateFilter.body.required - the new point
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.update = async (req, res) => {
    try {
        let data = {};
        data['acct_id'] = req.body.acct_id;
        data['project_id'] = parseInt(req.body.project_id);
        data['domain_id'] = req.body.domain_id;
        data['custom_filter_id'] = req.body.custom_filter_id;
        data['filter_name'] = req.body.filter_name;
        data['test_type'] = req.body.test_type;
        data['filter_key'] = req.body.filter_key;
        data['filter_type'] = req.body.filter_type;
        data['created_by'] = req.body.acct_id;
        data['updated_by'] = req.body.acct_id;

        let result = await customFilterService.updateFilter(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get list of folders
 * @route GET /customFilter/list
 * @security JWT
 * @group customFilter
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain_id of project
 * @param {string} test_type.query.required -test type->testcase/testplan/testcycle
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.list = async (req, res) => {
    try {
        let data = {};
        data['acct_id'] = req.query.acct_id;
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['test_type'] = req.query.test_type;
        let result = await customFilterService.lisFilter(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get detail of folders
 * @route GET /customFilter/detail
 * @security JWT
 * @group customFilter
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain_id of project
 * @param {string} custom_filter_id.query.required -
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.detail = async (req, res) => {
    try {
        let data = {};
        data['acct_id'] = req.query.acct_id;
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['custom_filter_id'] = req.query.custom_filter_id;
        let result = await customFilterService.detailFilter(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * @typedef deleteFilter
 * @property {string} acct_id.data.required - acct_id of cloud app
 * @property {integer} project_id.data.required - project_id of project
 * @property {string} domain_id.data.required - domain_id of project
 * @property {string} custom_filter_id.data.required - custom_filter_id 
 */
/**
 * This function is used to rename the added folder
 * @route PUT /customFilter/delete
 * @security JWT
 * @group customFilter
 * @param {deleteFilter.model} deleteFilter.body.required - the new point
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.delete = async (req, res) => {
    try {
        let data = {};
        data['acct_id'] = req.body.acct_id;
        data['project_id'] = parseInt(req.body.project_id);
        data['domain_id'] = req.body.domain_id;
        data['custom_filter_id'] = req.body.custom_filter_id;

        let result = await customFilterService.deleteFilter(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};
