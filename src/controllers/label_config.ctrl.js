const labelConfigService = require('../services/label_config.service').labelConfigService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef labelConfig
 * @property {string} acct_id - acct_id who has created this label
 * @property {string} lc_name - name of the label
 * @property {integer} project_id - project ID from jira
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add label
 * @route POST /label
 * @security JWT
 * @group Label
 * @param {labelConfig.model} labelConfig.body.required - the new point
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

exports.addLabelConfig = async (req, res) => {
	try {
		let data = req.body;		
		let result = await labelConfigService.addLabelConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get label by id
 * @route GET /label/id
 * @security JWT
 * @group Label
 * @param {integer} label_id.query.required
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getLabelConfigById = async (req, res) => {
	try {
		let data = req.query;
		let result = await labelConfigService.getLabelConfigById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list label
 * @route GET /label/allList
 * @security JWT
 * @group Label
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getAllLabelList = async (req, res) => {
	try {
		let result = await labelConfigService.getAllLabelList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing label
 * @route DELETE /label
 * @security JWT
 * @group Label
 * @param {string} label_id.query.required - label ID that is to be deleted
 * @param {integer} project_id.query.required - project ID from jira
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteLabelConfig = async (req, res) => {
	try {
		let data = {};
		data = req.query;
		let result = await labelConfigService.deleteLabelConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


