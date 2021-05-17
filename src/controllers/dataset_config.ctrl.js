const datasetConfigService = require('../services/dataset_config.service').datasetConfigService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef datasetConfig
 * @property {string} acct_id - acct_id who has created this dataset
 * @property {string} dc_name - name of the dataset
 * @property {integer} project_id - project ID from jira
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add dataset
 * @route POST /dataset
 * @security JWT
 * @group Dataset
 * @param {datasetConfig.model} datasetConfig.body.required - the new point
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

exports.addDatasetConfig = async (req, res) => {
	try {
		let data = req.body;		
		let result = await datasetConfigService.addDatasetConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get dataset by id
 * @route GET /dataset/id
 * @security JWT
 * @group Dataset
 * @param {integer} dataset_id.query.required
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getDatasetConfigById = async (req, res) => {
	try {
		let data = req.query;
		let result = await datasetConfigService.getDatasetConfigById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list dataset
 * @route GET /dataset/allList
 * @security JWT
 * @group Dataset
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getAllDatasetList = async (req, res) => {
	try {
		let result = await datasetConfigService.getAllDatasetList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef datasetEdit
 * @property {string} acct_id.data.required -  acct ID who is updating
 * @property {integer} dataset_id.query.required - dataset ID 
 * @property {string} dc_name - name of the dataset
 * @property {integer} project_id.data.required - project ID from jira
 * @property {string} domain_id.data.required - jira domain ID
 */
/**
 * This function is used to update dataset
 * @route PUT /dataset
 * @security JWT
 * @group Dataset
 * @param {datasetEdit.model} datasetEdit.body.required - the new point
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
exports.editDatasetConfig = async (req, res) => {
	try {
		let data = req.body;	
		let result = await datasetConfigService.editDatasetConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing dataset
 * @route DELETE /dataset
 * @security JWT
 * @group Dataset
 * @param {string} dataset_id.query.required - dataset ID that is to be deleted
 * @param {integer} project_id.query.required - project ID from jira
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteDatasetConfig = async (req, res) => {
	try {
		let data = {};
		data = req.query;
		let result = await datasetConfigService.deleteDatasetConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


