const componentService = require('../services/global_component_config.service').componentService;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * @typedef globalComponentConfig
 * @property {string} domain_id - jira domain ID
 * @property {string} cp_name - name of the test component 
 * @property {string} cp_description - description of the test component
 * @property {string} cp_color - color of the test component
 * @property {string} cp_type - type of the component like test_case or test_plan or test_cycles or test_executions
 */
/**
 * This function is used to create component
 * @route POST /globalComponent/create
 * @security JWT
 * @group Global Component
 * @param {globalComponentConfig.model} globalComponentConfig.body.required - the new point
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and component code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} component
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.createComponent = async (req, res) => {
	try {
		let data = req.body;
		data['acct_id']	= req.query.user;
		let result = await componentService.createComponent(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to get list of components
 * @route GET /globalComponent/componentList
 * @security JWT
 * @group Global Component
 * @param {string} domain_id.query.required - domain ID
 * @param {string} cp_type.query -component type of test case or test plan, test cycle etc
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and component code
 * @returns {Error}  default - Unexpected error
 */

exports.componentLists = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.user;
		data['domain_id'] = req.query.domain_id;
		data['cp_type'] = req.query.cp_type;
		let result = await componentService.componentLists(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * @typedef globalUpdateComponentConfig
 * @property {string} domain_id - jira domain ID
 * @property {integer} global_component_id - id of the component
 * @property {string} cp_name - configuration component name
 * @property {string} cp_description - configuration component description
 * @property {string} cp_color - configuration component color
 * @property {string} cp_type - configuration component color
 */
/**
 * This function is used to update config component
 * @route PUT /globalComponent/update
 * @security JWT
 * @group Global Component
 * @param {globalUpdateComponentConfig.model} globalUpdateComponentConfig.body.required - the new point
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and component code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} component
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.updateComponent = async (req, res) => {
	try {
		let data = req.body;
		data['acct_id'] = req.query.user;		
		let result = await componentService.updateComponent(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the component
 * @route DELETE /globalComponent/delete
 * @security JWT
 * @group Global Component
 * @param {string} global_component_id.query.required - configuration component id that is to be deleted
 * @param {string} domain_id.query.required - jira domain ID
 * @param {string} user.query.required - acct_id
 * @returns {Response} 200 - response object containing data, message and component code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteComponent = async (req, res) => {
	try {
		let data = {};
		data['global_component_id'] = req.query.global_component_id;
		data['acct_id'] = req.query.user;
		data['domain_id'] = req.query.domain_id;
		let result = await componentService.deleteComponent(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get component by id
 * @route GET /globalComponent/id
 * @security JWT
 * @group Global Component
 * @param {integer} global_component_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and component code
 * @returns {Error}  default - Unexpected error
 */

exports.getComponentById = async (req, res) => {
	try {
		let data = req.query;
		let result = await componentService.getComponentById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};