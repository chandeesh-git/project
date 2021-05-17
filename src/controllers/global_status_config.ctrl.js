const statusService = require('../services/global_status_config.service').statusService;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * @typedef globalStatusConfig
 * @property {string} domain_id - jira domain ID
 * @property {string} sc_name - name of the test status
 * @property {string} sc_description - description of the test status
 * @property {string} sc_color - color of the test status
 * @property {integer} sc_status - status lock option 0 for lock and 1 for unclock
 * @property {string} sc_type - type of the status like test_case or test_plan or test_cycles or test_executions
 */
/**
 * This function is used to add test
 * @route POST /globalStatus/create
 * @security JWT
 * @group Global Status
 * @param {globalStatusConfig.model} globalStatusConfig.body.required - the new point
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

exports.addTest = async (req, res) => {
	try {
        let data = req.body;	
        data['acct_id'] = req.query.user;
		let result = await statusService.addTest(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list all status table
 * @route GET /globalStatus/allList
 * @security JWT
 * @group Global Status
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @param {string} sc_type.query.required -status type of test case or test plan, test cycle etc
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */
exports.listStatus = async(req, res) => {
	try {
		let data = req.query;
		let result = await statusService.listStatus(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
}



/**
 * @typedef globalConfigStatus
 * @property {string} domain_id - jira domain ID
 * @property {integer} global_status_id - id of the globalStatus status
 * @property {string} sc_name - globalStatus status name
 * @property {string} sc_description - globalStatus status description
 * @property {string} sc_color - globalStatus status color
 * @property {integer} sc_status - globalStatus status lock option 0 for lock and 1 for unclock
 * @property {string} sc_type - globalStatus status type testcase/testcycle/testplan
 */
/**
 * This function is used to update config status
 * @route PUT /globalStatus/update
 * @security JWT
 * @group Global Status
 * @param {globalConfigStatus.model} globalConfigStatus.body.required - the new point
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

exports.updateConfigStatus = async (req, res) => {
	try {
        let data = req.body;
        data['acct_id'] = req.query.user		
		let result = await statusService.updateConfigStatus(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to inactive global status
 * @route DELETE /globalStatus/delete
 * @security JWT
 * @group Global Status
 * @param {string} global_status_id.query.required - globalStatus status id that is to be deleted
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteConfigStatus = async (req, res) => {
	try {
		let data = {};
        data = req.query;
		let result = await statusService.deleteConfigStatus(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get global status by id
 * @route GET /globalStatus/id
 * @security JWT
 * @group Global Status
 * @param {integer} global_status_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getStatusById = async (req, res) => {
	try {
		let data = req.query;
		let result = await statusService.getStatusById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};