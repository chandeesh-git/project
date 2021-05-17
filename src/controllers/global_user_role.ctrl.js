'use strict';

const userRoleService = require('../services/global_user_role.service').userRoleService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef globalUserRole
 * @property {string} user_name - user_name which is coming from screen
 * @property {integer} role_id - id of the role
 * @property {string} user_id - id of the user from JIRA
 */
/**
 * This function is used to add userRoleInfo
 * @route POST /globalUserRole
 * @security JWT
 * @group Global UserRole
 * @param {globalUserRole.model} globalUserRole.body.required - the new point
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

exports.createUserRole = async (req, res) => {
	try {
        let data = req.body;
        data['acct_id']	= req.query.user
		let result = await userRoleService.createUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch(e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}	
};

/**
 * This function is used to delete the user-role
 * @route DELETE /globalUserRole
 * @security JWT
 * @group Global UserRole
 * @param {integer} id.query.required - role Id that is to be deleted
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef globalUserRoleEdit
 * @property {integer} id.data.required - user-role Id
 * @property {string} user_name - user name coming from screen cloudapp 
 * @property {integer} role_id - role_id of role
 * @property {integer} is_active - status of role
 */
/**
 * This function is used to update user-role
 * @route PUT /globalUserRole
 * @security JWT
 * @group Global UserRole
 * @param {globalUserRoleEdit.model} globalUserRoleEdit.body.required - the new point
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
exports.editUserRoles = async (req, res) => {
	try {
		let data = req.body;
		data['acct_id'] = req.query.user;	
		let result = await userRoleService.editUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.deleteUserRole = async (req, res) => {
	try {
		let data = {};
		data['id'] = req.query.id;
		let result = await userRoleService.deleteUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list active user-role mapping
 * @route GET /globalUserRole/listActive
 * @security JWT
 * @group Global UserRole
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */
exports.getUserRolesList = async (req, res) => {
	try {
		let data = req.query;
		let result = await userRoleService.listUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};
