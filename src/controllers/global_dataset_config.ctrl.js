const datasetConfigService = require('../services/global_dataset_config.service').datasetConfigService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef globalDatasetConfig
 * @property {string} dc_name - name of the dataset
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add dataset
 * @route POST /globalDataset/create
 * @security JWT
 * @group Global Dataset
 * @param {globalDatasetConfig.model} globalDatasetConfig.body.required - the new point
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
		data['acct_id'] = req.query.user;		
		let result = await datasetConfigService.addDatasetConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get dataset by id
 * @route GET /globalDataset/id
 * @security JWT
 * @group Global Dataset
 * @param {integer} global_dataset_id.query.required
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
 * @route GET /globalDataset/allList
 * @security JWT
 * @group Global Dataset
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
 * @typedef globalDatasetEdit
 * @property {integer} global_dataset_id.query.required - dataset ID 
 * @property {string} dc_name - name of the dataset
 * @property {string} domain_id.data.required - jira domain ID
 */
/**
 * This function is used to update dataset
 * @route PUT /globalDataset/edit
 * @security JWT
 * @group Global Dataset
 * @param {globalDatasetEdit.model} globalDatasetEdit.body.required - the new point
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
		data['acct_id'] = req.query.user;	
		let result = await datasetConfigService.editDatasetConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing dataset
 * @route DELETE /globalDataset/delete
 * @security JWT
 * @group Global Dataset
 * @param {string} global_dataset_id.query.required - dataset ID that is to be deleted
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


