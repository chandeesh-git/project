const roleService = require('../services/role.service').roleService;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * @typedef userRoles
 * @property {string} acct_id - acct_id who has created this role
 * @property {string} role_name - name of the role
 * @property {integer} project_id - project ID from jira,
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add projectInfo
 * @route POST /role
 * @security JWT
 * @group Role
 * @param {userRoles.model} userRoles.body.required - the new point
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
 * @property {integer} allow_testcase_execute - enable/disable story for inquestPro
 * @property {integer} allow_configuration - enable/disable story for inquestPro
 */

/** 
 * @typedef userRolesUpdate
 * @property {string} acct_id - acct_id who has created this role
 * @property {Array.<roleUpdate>} roleUpdate - Array of access updates corresponding to role
 */
/**
 * This function is used to add projectInfo
 * @route PUT /role
 * @security JWT
 * @group Role
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
 * @route DELETE /role
 * @security JWT
 * @group Role
 * @param {string} role_id.query.required - role Id that is to be deleted
 * @param {string} acct_id.query.required - acct Id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteRoles = async (req, res) => {
	try {
		let data = {};
		data['role_id'] = req.query.role_id;
		data['acct_id'] = req.query.acct_id;
		let result = await roleService.deleteUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing testplan
 * @route GET /role/list
 * @security JWT
 * @group Role
 * @param {string} project_id.query.required
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
 * This function is used to get the role permission view
 * @route GET /role/permissions
 * @security JWT
 * @group Role
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getPermissionsView = async (req, res) => {
	try {
		let result = await roleService.userRoleList();
		res.render('role/rbac_setting', {
            'permissions': result.data
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get the role permission view
 * @route GET /role/manageRole
 * @security JWT
 * @group Role
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getManageRoleView = async (req, res) => {
	try {
		let result = await roleService.usersListWithRole();
		res.render('role/manageRole', {
            'roleList': result.data
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef user
 * @property {string} acct_id - Acct ids of user belonging to same role
 */
/**
 * @typedef groupArr
 * @property {integer} id - id of group belonging to same role
 */
/**
 * @typedef role
 * @property {integer} role_id - Role Id containing users
 * @property {Array.<user>} users - Array of user objects within a role
 * @property {Array.<groupArr>} groups - Array of group objects within a role
 */
/**
 * @typedef roleAccess
 * @property {string} acct_id - acct_id who is assiging the access
 * @property {Array.<role>} roles - array of roles and user association
 */
/**
 * This function is used to add projectInfo
 * @route POST /role/access
 * @security JWT
 * @group Role
 * @param {roleAccess.model} roleAccess.body.required - the new point
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

exports.addRoleAccess = async (req, res) => {
	try {
		let data = req.body;		
		let result = await roleService.assignRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get role by id
 * @route GET /role/id
 * @security JWT
 * @group Role
 * @param {integer} role_id.query.required
 * @param {string} acct_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getRoleById = async (req, res) => {
	try {
		let data = req.query;
		let result = await roleService.getRoleById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


