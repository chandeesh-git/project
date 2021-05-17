const statusService = require('../services/status_config_service').statusService;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * @typedef addTest
 * @property {string} acct_id - acct_id who has created this role
 * @property {integer} project_id - project ID from jira,
 * @property {string} domain_id - jira domain ID
 * @property {string} sc_name - name of the test status 
 * @property {string} sc_description - description of the test status
 * @property {string} sc_color - color of the test status
 * @property {integer} sc_status - status of the test status for lock and unlock
 * @property {string} sc_type - type of the status like test_case or test_plan or test_cycles or test_executions
 */
/**
 * This function is used to add test
 * @route POST /configuration/status
 * @security JWT
 * @group configStatus
 * @param {addTest.model} addTest.body.required - the new point
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
        data['is_active'] = 1;
		let result = await statusService.addTest(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to get list of configuration status 
 * @route GET /configuration/statusList
 * @security JWT
 * @group configStatus
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} sc_type.query.required -status type of test case or test plan, test cycle etc
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.listStatus = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['sc_type'] = req.query.sc_type;
		let result = await statusService.listStatus(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list all user-group table
 * @route GET /configuration/statusList
 * @security JWT
 * @group configStatus
 * @param {string} domain_id.query.required
 * @param {string} project_id.query.required
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
 * @typedef updateConfigStatus
 * @property {string} acct_id - acct_id who has created this group
 * @property {integer} project_id - project ID from jira,
 * @property {string} domain_id - jira domain ID
 * @property {integer} config_status_id - id of the configuration status
 * @property {string} sc_name - configuration status name
 * @property {string} sc_description - configuration status description
 * @property {string} sc_color - configuration status color
 * @property {integer} sc_status - configuration status lock option (0 for lock and 1 for unlock)
 * @property {string} sc_type - type of the status like test_case or test_plan or test_cycles or test_executions
 */
/**
 * This function is used to update config status
 * @route PUT /configuration/status
 * @security JWT
 * @group configStatus
 * @param {updateConfigStatus.model} updateConfigStatus.body.required - the new point
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
		let result = await statusService.updateConfigStatus(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the user-role
 * @route DELETE /configuration/status
 * @security JWT
 * @group configStatus
 * @param {string} config_status_id.query.required - configuration status id that is to be deleted
 * @param {integer} project_id.query.required - project ID from jira
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteConfigStatus = async (req, res) => {
	try {
		let data = {};
		data['config_status_id'] = req.query.config_status_id;
		data['acct_id'] = req.query.user;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		let result = await statusService.deleteConfigStatus(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get custom_field by id
 * @route GET /configuration/status/id
 * @security JWT
 * @group configStatus
 * @param {integer} config_status_id.query.required
 * @param {string} project_id.query.required
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