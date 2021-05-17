const roleService = require('../services/global_role.service').roleService;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * @typedef globalUserRoles
 * @property {string} role_name - name of the role
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add global role
 * @route POST /globalRole
 * @security JWT
 * @group Global Role
 * @param {globalUserRoles.model} globalUserRoles.body.required - the new point
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

exports.addRole = async (req, res) => {
	try {
        let data = req.body;
        data['acct_id'] = req.query.user;	
		let result = await roleService.addRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/** 
 * @typedef roleUpdate
 * @property {string} role_id - role_id to be updated
 * @property {string} domain_id - domain_id to be updated
 * @property {integer} allow_testcase_create - enable/disable access permission
 * @property {integer} allow_testcase_edit - enable/disable story for inquestPro
 * @property {integer} allow_testcase_read - enable/disable story for inquestPro
 * @property {integer} allow_testcase_delete - enable/disable story for inquestPro
 * @property {integer} allow_testcase_archive - enable/disable story for inquestPro
 * @property {integer} allow_testcase_versions - enable/disable story for inquestPro
 * @property {integer} allow_testcase_folders - enable/disable story for inquestPro
 * @property {integer} allow_testplan_create - enable/disable story for inquestPro
 * @property {integer} allow_testplan_edit - enable/disable access permission
 * @property {integer} allow_testplan_view - enable/disable access permission
 * @property {integer} allow_testplan_delete - enable/disable story for inquestPro
 * @property {integer} allow_testplan_folders - enable/disable story for inquestPro
 * @property {integer} allow_testcycle_create - enable/disable story for inquestPro
 * @property {integer} allow_testcycle_edit - enable/disable story for inquestPro
 * @property {integer} allow_testcycle_view - enable/disable story for inquestPro
 * @property {integer} allow_testcycle_execute - enable/disable story for inquestPro
 * @property {integer} allow_testcycle_delete - enable/disable story for inquestPro
 * @property {integer} allow_testcycle_folders - enable/disable story for inquestPro
 * @property {integer} allow_reports_create - enable/disable story for inquestPro
 * @property {integer} allow_configuration - enable/disable story for inquestPro
 */

/** 
 * @typedef userRolesUpdate
 * @property {string} acct_id - acct_id who has created this role
 * @property {Array.<roleUpdate>} roleUpdate - Array of access updates corresponding to role
 */
/**
 * This function is used to add projectInfo
 * @route PUT /globalRole
 * @security JWT
 * @group Global Role
 * @param {userRolesUpdate.model} userRolesUpdate.body.required - the new point
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

exports.updateRoles = async (req, res) => {
	try {
		let data = req.body;		
		let result = await roleService.updateUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the user-role
 * @route DELETE /globalRole
 * @security JWT
 * @group Global Role
 * @param {string} role_id.query.required - role Id that is to be deleted
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteRoles = async (req, res) => {
	try {
		let data = {};
		data['role_id'] = req.query.role_id;
		data['acct_id'] = req.query.user;
		let result = await roleService.deleteUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing testplan
 * @route GET /globalRole/list
 * @security JWT
 * @group Global Role
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getRoles = async (req, res) => {
	try {
		let data = req.query;
		let result = await roleService.userRoleList(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get role by id
 * @route GET /globalRole/id
 * @security JWT
 * @group Global Role
 * @param {integer} role_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getRoleById = async (req, res) => {
	try {
		let data = req.query;
		data['acct_id'] = req.query.user;
		let result = await roleService.getRoleById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


