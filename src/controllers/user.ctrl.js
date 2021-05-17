const userService = require('../services/user.service').userService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * This function is used to render project setting view
 * @route GET /user/access
 * @security JWT
 * @group User
 * @param {string} acct_id.query.required - cloud app acct id
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

exports.getUserAccess = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		console.log(JSON.stringify(req.query));
		let result = await userService.getUserAccess(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * @typedef user
 * @property {string} acct_id - Acct ids of user belonging to same group
 */
/**
 * @typedef group
 * @property {integer} group_id - Group Id containing users
 * @property {Array.<user>} users - Array of user objects within a group
 */
/**
 * @typedef userGroupAccess
 * @property {string} acct_id - acct_id who is assiging the access
 * @property {Array.<group>} groups - array of groups and user association
 */
/**
 * This function is used to add groups to users
 * @route POST /user/groupAccess
 * @security JWT
 * @group User
 * @param {userGroupAccess.model} userGroupAccess.body.required - the new point
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

exports.addGroupAccess = async (req, res) => {
	try {
		let data = req.body;		
		let result = await userService.addUserGroup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

