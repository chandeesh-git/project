const envConfigService = require('../services/environment_config.service').envConfigService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef environmentConfig
 * @property {string} acct_id - acct_id who has created this environment
 * @property {string} ec_name - name of the environment
 * @property {integer} project_id - project ID from jira
 * @property {string} domain_id - jira domain ID
 * @property {string} ec_description - env config description
 */
/**
 * This function is used to add environment
 * @route POST /environment
 * @security JWT
 * @group Environment
 * @param {environmentConfig.model} environmentConfig.body.required - the new point
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

exports.addEnvConfig = async (req, res) => {
	try {
		let data = req.body;		
		let result = await envConfigService.addEnvConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get environment by id
 * @route GET /environment/id
 * @security JWT
 * @group Environment
 * @param {integer} env_id.query.required
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getEnvConfigById = async (req, res) => {
	try {
		let data = req.query;
		let result = await envConfigService.getEnvConfigById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list environment
 * @route GET /environment/allList
 * @security JWT
 * @group Environment
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getAllEnvList = async (req, res) => {
	try {
		let result = await envConfigService.getAllEnvList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef environmentEdit
 * @property {string} acct_id.data.required -  acct ID who is updating
 * @property {integer} env_id.data.required - environment ID that is to be deleted
 * @property {string} ec_name - name of the environment
 * @property {string} ec_description - env config description
 * @property {integer} project_id.data.required - project ID from jira
 * @property {string} domain_id.data.required - jira domain ID
 */
/**
 * This function is used to update environment
 * @route PUT /environment
 * @security JWT
 * @group Environment
 * @param {environmentEdit.model} environmentEdit.body.required - the new point
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
exports.editEnvConfig = async (req, res) => {
	try {
		let data = req.body;	
		let result = await envConfigService.editEnvConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing environment
 * @route DELETE /environment
 * @security JWT
 * @group Environment
 * @param {string} env_id.query.required - environment ID that is to be deleted
 * @param {integer} project_id.query.required - project ID from jira
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteEnvConfig = async (req, res) => {
	try {
		let data = {};
		data['env_id'] = req.query.env_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		let result = await envConfigService.deleteEnvConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


