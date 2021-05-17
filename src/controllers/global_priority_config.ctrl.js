const globalPriorityConfigService = require('../services/global_priority_config.service').priorityConfigService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef globalPriorityConfig
 * @property {string} pc_name - name of the priority
 * @property {string} priority_type - type of the priority
 * @property {string} domain_id - jira domain ID
 * @property {string} priority_color - priority color
 * @property {string} priority_label - priority config label H,L,M
 */
/**
 * This function is used to add priority
 * @route POST /globalPriority/create
 * @security JWT
 * @group Global Priority
 * @param {globalPriorityConfig.model} globalPriorityConfig.body.required - the new point
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
        data['acct_id'] = req.query.user;		
		let result = await globalPriorityConfigService.addPriorityConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get priority by id
 * @route GET /globalPriority/id
 * @security JWT
 * @group Global Priority
 * @param {integer} global_priority_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getPriorityConfigById = async (req, res) => {
	try {
		let data = req.query;
		let result = await globalPriorityConfigService.getPriorityConfigById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list priority
 * @route GET /globalPriority/allList
 * @security JWT
 * @group Global Priority
 * @param {string} domain_id.query.required
 * @param {string} priority_type.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getAllPriorityList = async (req, res) => {
	try {
		let result = await globalPriorityConfigService.getAllPriorityList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef globalPriorityEdit
 * @property {integer} global_priority_id.data.required - priority ID 
 * @property {string} pc_name - name of the priority
 * @property {string} priority_type - type of the priority
 * @property {string} priority_label - priority config label H,L,M
 * @property {string} priority_color - priority color
 * @property {string} domain_id.data.required - jira domain ID
 */
/**
 * This function is used to update custom-field
 * @route PUT /globalPriority/edit
 * @security JWT
 * @group Global Priority
 * @param {globalPriorityEdit.model} globalPriorityEdit.body.required - the new point
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
        data['acct_id'] = req.query.user	
		let result = await globalPriorityConfigService.editPriorityConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing priority
 * @route DELETE /globalPriority/delete
 * @security JWT
 * @group Global Priority
 * @param {string} global_priority_id.query.required - priority ID that is to be deleted
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deletePriorityConfig = async (req, res) => {
	try {
		let data = {};
		data = req.query;
		let result = await globalPriorityConfigService.deletePriorityConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


