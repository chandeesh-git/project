const priorityConfigService = require('../services/priority_config.service').priorityConfigService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef priorityConfig
 * @property {string} acct_id - acct_id who has created this priority
 * @property {string} pc_name - name of the priority
 * @property {string} priority_type - type of the priority
 * @property {string} priority_color - priority color
 * @property {integer} project_id - project ID from jira
 * @property {string} domain_id - jira domain ID
 * @property {string} priority_label - priority config label H,L,M
 */
/**
 * This function is used to add priority
 * @route POST /priority
 * @security JWT
 * @group Priority
 * @param {priorityConfig.model} priorityConfig.body.required - the new point
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

exports.addPriorityConfig = async (req, res) => {
	try {
		let data = req.body;		
		let result = await priorityConfigService.addPriorityConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get priority by id
 * @route GET /priority/id
 * @security JWT
 * @group Priority
 * @param {integer} priority_id.query.required
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getPriorityConfigById = async (req, res) => {
	try {
		let data = req.query;
		let result = await priorityConfigService.getPriorityConfigById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list priority
 * @route GET /priority/allList
 * @security JWT
 * @group Priority
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} priority_type.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getAllPriorityList = async (req, res) => {
	try {
		let result = await priorityConfigService.getAllPriorityList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef priorityEdit
 * @property {string} acct_id.data.required - jira domain ID
 * @property {integer} priority_id.data.required - priority ID 
 * @property {string} pc_name - name of the priority
 * @property {string} priority_type - type of the priority
 * @property {string} priority_label - priority config label H,L,M
 * @property {string} priority_color - priority color
 * @property {integer} project_id.data.required - project ID from jira
 * @property {string} domain_id.data.required - jira domain ID
 */
/**
 * This function is used to update custom-field
 * @route PUT /priority
 * @security JWT
 * @group Priority
 * @param {priorityEdit.model} priorityEdit.body.required - the new point
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
exports.editPriorityConfig = async (req, res) => {
	try {
		let data = req.body;	
		let result = await priorityConfigService.editPriorityConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing priority
 * @route DELETE /priority
 * @security JWT
 * @group Priority
 * @param {string} priority_id.query.required - priority ID that is to be deleted
 * @param {integer} project_id.query.required - project ID from jira
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deletePriorityConfig = async (req, res) => {
	try {
		let data = {};
		data = req.query;
		let result = await priorityConfigService.deletePriorityConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


