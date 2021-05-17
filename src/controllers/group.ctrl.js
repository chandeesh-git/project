const groupService = require('../services/group.service').groupService;
const projectDao = require('../dao/project.dao').projectDetails;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * @typedef userGroups
 * @property {string} acct_id - acct_id who has created this group
 * @property {string} group_name - name of the group
 * @property {integer} project_id - project ID from jira,
 * @property {string} domain_id - jira domain ID
 */
/**
 * This function is used to add groups
 * @route POST /group
 * @security JWT
 * @group Group
 * @param {userGroups.model} userGroups.body.required - the new point
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
		let result = await groupService.addGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef updateGroups
 * @property {string} acct_id - acct_id who has created this group
 * @property {integer} group_id - id of the group
 * @property {string} group_name - group_name
 * @property {integer} is_active - status
 */
/**
 * This function is used to add role to groups
 * @route PUT /group/updateGroup
 * @security JWT
 * @group Group
 * @param {updateGroups.model} updateGroups.body.required - the new point
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
		let result = await groupService.updateGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef roleGroups
 * @property {string} acct_id - acct_id who has created this group
 * @property {integer} group_id - id of the group
 * @property {integer} role_id - role_id
 */
/**
 * This function is used to add role to groups
 * @route PUT /group/updateRoleGroup
 * @security JWT
 * @group Group
 * @param {roleGroups.model} roleGroups.body.required - the new point
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
		let result = await groupService.updateGroupsRole(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing group
 * @route DELETE /group
 * @security JWT
 * @group Group
 * @param {string} group_id.query.required - group Id that is to be deleted
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteGroups = async (req, res) => {
	try {
		let data = {};
		data['group_id'] = req.query.group_id;
		let result = await groupService.deleteGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing testplan
 * @route GET /group/activeList
 * @security JWT
 * @group Group
 * @param {string} project_id.query.required
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
 * This function is used to list groups
 * @route GET /group/allList
 * @security JWT
 * @group Group
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.allGroupList = async (req, res) => {
	try {
		let result = await groupService.allGroupList(req.query);
		if(result)
			return response(res, result.rescode, result.msg, result.data);
		else 
			return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete the existing testplan
 * @route GET /group/manageGroup
 * @security JWT
 * @group Group
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.manageGroupView = async (req, res) => {
	try {
		let result = await groupService.groupListWithUsers();
		res.render('group/manageGroup', {
            'groupList': result.data
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list groups without role
 * @route GET /group/groupListNoRole
 * @security JWT
 * @group Group
 * @param {string} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.groupListWithoutRole = async (req, res) => {
	try {
		let acct_id = req.query;
		let result = await groupService.groupListWithoutRole(acct_id);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get group by id
 * @route GET /group/id
 * @security JWT
 * @group Group
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
