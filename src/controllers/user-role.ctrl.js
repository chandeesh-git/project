'use strict';

const userRoleService = require('../services/user-role.service').userRoleService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef createUserRoles
 * @property {string} acct_id - acct_id who is updating from screen
 * @property {string} user_name - user_name which is coming from screen
 * @property {integer} role_id - id of the role
 * @property {string} user_id - id of the user from JIRA
 */
/**
 * This function is used to add userRoleInfo
 * @route POST /userRole
 * @security JWT
 * @group UserRole
 * @param {createUserRoles.model} createUserRoles.body.required - the new point
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
		let result = await userRoleService.createUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch(e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}	
};

/**
 * @typedef userRoleEdit
 * @property {integer} id.data.required - user-role Id
 * @property {string} user_name - user name coming from screen cloudapp
 * @property {string} acct_id - acc_id of cloud app 
 * @property {integer} role_id - role_id of role
 * @property {integer} is_active - status of role
 */
/**
 * This function is used to update user-role
 * @route PUT /userRole
 * @security JWT
 * @group UserRole
 * @param {userRoleEdit.model} userRoleEdit.body.required - the new point
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
		let result = await userRoleService.editUserRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the user-role
 * @route DELETE /userRole
 * @security JWT
 * @group UserRole
 * @param {integer} id.query.required - role Id that is to be deleted
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

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
 * @route GET /userRole/listActive
 * @security JWT
 * @group UserRole
 * @param {string} domain_id.query.required
 * @param {string} project_id.query.required
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

/**
 * This function is used to list all user-role table
 * @route GET /userRole/listAll
 * @security JWT
 * @group UserRole
 * @param {string} domain_id.query.required
 * @param {string} project_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */
exports.userRoleListAll = async(req, res) => {
	try {
		let data = req.query;
		let result = await userRoleService.userRoleListAll(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		//this is test comment
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
}