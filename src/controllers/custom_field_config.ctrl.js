const customFieldConfigService = require('../services/custom_field_config.service').customFieldConfigService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef customFieldConfig
 * @property {string} acct_id - acct_id who has created this custom_field
 * @property {string} cfc_name - name of the custom_field
 * @property {string} cfc_type - type of custom_field
 * @property {string} cfc_field_type -  field_type of custom_field
 * @property {integer} cfc_required_flag -required_flag of custom_field
 * @property {string} cfc_status -status of custom_field
 * @property {string} cfc_options -options of custom_field
 * @property {integer} project_id - project ID from jira
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add custom_field
 * @route POST /customField
 * @security JWT
 * @group CustomField
 * @param {customFieldConfig.model} customFieldConfig.body.required - the new point
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

exports.addCustomFieldConfig = async (req, res) => {
	try {
		let data = req.body;		
		let result = await customFieldConfigService.addCustomFieldConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef customFieldEdit
 * @property {string} acct_id.data.required - jira domain ID
 * @property {integer} cfield_id.data.required - custom-field Id
 * @property {string} cfc_name -  custom-field  name
 * @property {string} cfc_type - custom-field test type test_case/test_paln/test_execution/test_cycle
 * @property {string} cfc_field_type custom-field field type
 * @property {string} cfc_options custom-field options
 * @property {integer} cfc_required_flag -required_flag of custom_field
 * @property {integer} project_id.data.required - project ID from jira
 * @property {string} domain_id.data.required - jira domain ID
 */
/**
 * This function is used to update custom-field
 * @route PUT /customField
 * @security JWT
 * @group CustomField
 * @param {customFieldEdit.model} customFieldEdit.body.required - the new point
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
exports.editCustomFieldConfig = async (req, res) => {
	try {
		let data = req.body;	
		let result = await customFieldConfigService.editCustomFieldConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get custom_field by id
 * @route GET /customField/id
 * @security JWT
 * @group CustomField
 * @param {integer} cfield_id.query.required
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getCustomFieldgById = async (req, res) => {
	try {
		let data = req.query;
		let result = await customFieldConfigService.getCustomFieldgById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list custom_field
 * @route GET /customField/allList
 * @security JWT
 * @group CustomField
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} cfc_type.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getAllCustomFieldList = async (req, res) => {
	try {
		let result = await customFieldConfigService.getAllCustomFieldList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing custom_field
 * @route DELETE /customField
 * @security JWT
 * @group CustomField
 * @param {string} cfield_id.query.required - custom_field ID that is to be deleted
 * @param {integer} project_id.query.required - project ID from jira
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteCustomFieldConfig = async (req, res) => {
	try {
		let data = {};
		data['cfield_id'] = req.query.cfield_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		let result = await customFieldConfigService.deleteCustomFieldConfig(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


