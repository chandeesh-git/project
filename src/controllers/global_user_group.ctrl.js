'use strict';

const userGroupService = require('../services/global_user_group.service').userGroupService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef globalUserGroup
 * @property {string} user_name - user_name which is coming from screen
 * @property {integer} group_id - id of the group
 * @property {string} user_id - id of the user from JIRA
 */
/**
 * This function is used to add global userGroupInfo
 * @route POST /globalUserGroup
 * @security JWT
 * @group Global UserGroup
 * @param {globalUserGroup.model} globalUserGroup.body.required - the new point
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
        data['acct_id'] = req.query.user
		let result = await userGroupService.addUsersToGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch(e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}	
};

/**
 * @typedef globalUserGroupEdit
 * @property {integer} id.data.required - user-group Id
 * @property {string} user_name - user name coming from screen cloudapp
 * @property {integer} group_id - group_id of group
 * @property {integer} is_active - status of user-group
 */
/**
 * This function is used to update user-group
 * @route PUT /globalUserGroup
 * @security JWT
 * @group Global UserGroup
 * @param {globalUserGroupEdit.model} globalUserGroupEdit.body.required - the new point
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
		data['acct_id']	= req.query.user;
		let result = await userGroupService.editUserGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the user-group
 * @route DELETE /globalUserGroup
 * @security JWT
 * @group Global UserGroup
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
 * @route GET /globalUserGroup/listActive
 * @security JWT
 * @group Global UserGroup
 * @param {string} domain_id.query.required
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