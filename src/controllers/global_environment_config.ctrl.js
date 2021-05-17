const globalEnvConfigService = require('../services/global_environment_config.service').globalEnvService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef globalEnvConfig
 * @property {string} ec_name - name of the globalEnv
 * @property {string} domain_id - jira domain ID
 * @property {string} ec_description - env config description
 */
/**
 * This function is used to add globalEnv
 * @route POST /globalEnv/create
 * @security JWT
 * @group Global Environment
 * @param {globalEnvConfig.model} globalEnvConfig.body.required - the new point
 * @param {string} user.query.required - acct_id from jira
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.addGlobalEnvConfig = async (req, res) => {
	try {
		let data = req.body;
		data['acct_id'] = req.query.user		
		let result = await globalEnvConfigService.addGlobalEnvConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get globalEnv by id
 * @route GET /globalEnv/id
 * @security JWT
 * @group Global Environment
 * @param {integer} global_env_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.globalEnvConfigId = async (req, res) => {
	try {
		let data = req.query;
		let result = await globalEnvConfigService.globalEnvConfigId(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list globalEnv
 * @route GET /globalEnv/allList
 * @security JWT
 * @group Global Environment
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.allGlobalEnvList = async (req, res) => {
	try {
		let result = await globalEnvConfigService.allGlobalEnvList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef globalEnvEdit
 * @property {integer} global_env_id.data.required - globalEnv ID that is to be deleted
 * @property {string} ec_name - name of the globalEnv
 * @property {string} ec_description - env config description
 * @property {string} domain_id.data.required - jira domain ID
 */
/**
 * This function is used to update globalEnv
 * @route PUT /globalEnv
 * @security JWT
 * @group Global Environment
 * @param {globalEnvEdit.model} globalEnvEdit.body.required - the new point
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
exports.editGlobalEnvConfig = async (req, res) => {
	try {
		let data = req.body;
		data['acct_id'] = req.query.user;	
		let result = await globalEnvConfigService.editGlobalEnvConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing globalEnv
 * @route DELETE /globalEnv
 * @security JWT
 * @group Global Environment
 * @param {string} global_env_id.query.required - globalEnv ID that is to be deleted
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteGlobalEnvConfig = async (req, res) => {
	try {
		let data = {};
		data['global_env_id'] = req.query.global_env_id;
		data['domain_id'] = req.query.domain_id;
		data['acct_id'] = req.query.user;
		let result = await globalEnvConfigService.deleteGlobalEnvConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


