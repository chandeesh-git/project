const groupService = require('../services/global_group.service').groupService;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * @typedef globalGroups
 * @property {string} group_name - name of the group
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add groups
 * @route POST /globalGroup
 * @security JWT
 * @group Global Group
 * @param {globalGroups.model} globalGroups.body.required - the new point
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

exports.addGroups = async (req, res) => {
	try {
        let data = req.body;
        data['acct_id'] = req.query.user		
		let result = await groupService.addGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef globalUpdateGroups
 * @property {integer} group_id - id of the group
 * @property {string} group_name - group_name
 * @property {integer} is_active - status
 */
/**
 * This function is used to update groups
 * @route PUT /globalGroup/updateGroup
 * @security JWT
 * @group Global Group
 * @param {globalUpdateGroups.model} globalUpdateGroups.body.required - the new point
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

exports.updateGroup = async (req, res) => {
	try {
        let data = req.body;
        data['acct_id'] = req.query.user;		
		let result = await groupService.updateGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef globalRoleGroups
 * @property {integer} group_id - id of the group
 * @property {integer} role_id - role_id
 */
/**
 * This function is used to add role to groups
 * @route PUT /globalGroup/updateRoleGroup
 * @security JWT
 * @group Global Group
 * @param {globalRoleGroups.model} globalRoleGroups.body.required - the new point
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
exports.updateGroupsRole = async (req, res) => {
	try {
        let data = req.body;
        data['acct_id'] = req.query.user		
		let result = await groupService.updateGroupsRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing group
 * @route DELETE /globalGroup
 * @security JWT
 * @group Global Group
 * @param {string} group_id.query.required - group Id that is to be deleted
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteGroups = async (req, res) => {
	try {
		let data = {};
        data['group_id'] = req.query.group_id;
        data['acct_id'] = req.query.user;
		let result = await groupService.deleteGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used list group
 * @route GET /globalGroup/activeList
 * @security JWT
 * @group Global Group
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.activeGroupList = async (req, res) => {
	try {
		let acct_id = req.query.acct_id;
		let result = await groupService.activeGroupList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get group by id
 * @route GET /globalGroup/id
 * @security JWT
 * @group Global Group
 * @param {integer} group_id.query.required
 * @param {string} acct_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getGroupById = async (req, res) => {
	try {
		let data = req.query;
		let result = await groupService.getGroupById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};
