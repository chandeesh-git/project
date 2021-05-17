'use strict';

const userGroupService = require('../services/user-group.service').userGroupService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef createUserGroup
 * @property {string} acct_id - acct_id who is updating from screen
 * @property {string} user_name - user_name which is coming from screen
 * @property {integer} group_id - id of the group
 * @property {string} user_id - id of the user from JIRA
 */
/**
 * This function is used to add userGroupInfo
 * @route POST /userGroup
 * @security JWT
 * @group UserGroup
 * @param {createUserGroup.model} createUserGroup.body.required - the new point
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

exports.addUsersToGroup = async (req, res) => {
	try {
		let data = req.body;
		let result = await userGroupService.addUsersToGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch(e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}	
};

/**
 * @typedef userGroupEdit
 * @property {integer} id.data.required - user-group Id
 * @property {string} user_name - user name coming from screen cloudapp
 * @property {string} acct_id - acc_id of cloud app 
 * @property {integer} group_id - group_id of group
 * @property {integer} is_active - status of user-group
 */
/**
 * This function is used to update user-group
 * @route PUT /userGroup
 * @security JWT
 * @group UserGroup
 * @param {userGroupEdit.model} userGroupEdit.body.required - the new point
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
exports.editUserGroup = async (req, res) => {
	try {
		let data = req.body;	
		let result = await userGroupService.editUserGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the user-group
 * @route DELETE /userGroup
 * @security JWT
 * @group UserGroup
 * @param {integer} group_id.query.required - user-group primary Id that is to be deleted
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteUserGroup = async (req, res) => {
	try {
		let data = {};
		data['id'] = req.query.group_id;
		let result = await userGroupService.deleteUserGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list active user-group mapping
 * @route GET /userGroup/listActive
 * @security JWT
 * @group UserGroup
 * @param {string} domain_id.query.required
 * @param {string} project_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */
exports.userGroupActiveList = async (req, res) => {
	try {
		let data = req.query;
		let result = await userGroupService.userGroupActiveList(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list all user-group table
 * @route GET /userGroup/listAll
 * @security JWT
 * @group UserGroup
 * @param {string} domain_id.query.required
 * @param {string} project_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */
exports.allUserGroupList = async(req, res) => {
	try {
		let data = req.query;
		let result = await userGroupService.allUserGroupList(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
}

