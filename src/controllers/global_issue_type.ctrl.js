const issueTypeService = require('../services/global_issue_type.service').issueTypeService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef globalIssueType
 * @property {integer} permission_status - enable/disable access permission
 * @property {integer} story_enabled - enable/disable story for inquestPro
 * @property {integer} task_enabled - enable/disable story for inquestPro
 * @property {integer} bug_enabled - enable/disable story for inquestPro
 * @property {integer} epic_enabled - enable/disable story for inquestPro
 * @property {integer} subtask_enabled - enable/disable story for inquestPro
 * @property {string} domain_id - domain ID from JIRA
 */
/**
 * This function is used to add issue type
 * @route POST /globalIssueType
 * @security JWT
 * @group Global Issue Type
 * @param {globalIssueType.model} globalIssueType.body.required - the new point
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

exports.addIssueType = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.user;
		data['story_enabled'] = req.body.story_enabled || 0;
		data['task_enabled'] = req.body.task_enabled || 0;
		data['bug_enabled'] = req.body.bug_enabled || 0;
		data['epic_enabled'] = req.body.epic_enabled || 0;
		data['subtask_enabled'] = req.body.subtask_enabled || 0;
		data['permission_status'] = req.body.permission_status || 0;
		data['domain_id'] = req.body.domain_id || null;
        
        let result = await issueTypeService.addIssueType(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef editGlobalIssueType
 * @property {integer} story_enabled - enable/disable story for inquestPro
 * @property {integer} task_enabled - enable/disable story for inquestPro
 * @property {integer} bug_enabled - enable/disable story for inquestPro
 * @property {integer} epic_enabled - enable/disable story for inquestPro
 * @property {integer} subtask_enabled - enable/disable story for inquestPro
 * @property {integer} permission_status - enable/disable access permission
 * @property {string} domain_id - domain ID from JIRA
 */
/**
 * This function is used to update project
 * @route PUT /globalIssueType
 * @security JWT
 * @group Global Issue Type
 * @param {editGlobalIssueType.model} editGlobalIssueType.body.required - the new point
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

exports.editIssueType = async (req, res) => {
	try {
        let data = req.body;
        data['updated_by'] = req.query.user
		let result = await issueTypeService.editIssueType(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get issue type by id
 * @route GET /globalIssueType/id
 * @security JWT
 * @group Global Issue Type
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getIssueTypeById = async (req, res) => {
	try {
		let data = req.query;
		let result = await issueTypeService.getIssueTypeById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list issue type
 * @route GET /globalIssueType/list
 * @security JWT
 * @group Global Issue Type
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getList = async (req, res) => {
	try {
		let result = await issueTypeService.getList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};