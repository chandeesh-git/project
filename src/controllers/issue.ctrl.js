const issueDao = require('../dao/issues.dao');
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * This is a webhook for getting issue_create event
 * @route POST /issue/created
 * @security JWT
 * @group Issue
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

exports.created = async (req, res) => {
	try {
		let data = {};
		data['issue_id'] = parseInt(req.body.issue.id);
		data['project_id'] = parseInt(req.body.issue.fields.project.id);
		data['issue_type'] = req.body.issue.fields.issuetype.name;

		let addIssue =  await issueDao.issueDetails.addIssue(data);
		if(addIssue) {
			return response(res, 200, message.ISSUE_ADDED, {});
		} else {
			return response(res, 401, message.INVALID_DETAILS, {});
		}
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
* This is a webhook for getting issue_deleted event
 * @route POST /issue/deleted
 * @security JWT
 * @group Issue
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

exports.deleted = async (req, res) => {
	try {
		let issue_id = parseInt(req.body.issue.id);
	
		let deleteIssue =  await issueDao.issueDetails.deleteIssue(issue_id);
		if(deleteIssue) {
			return response(res, 200, message.ISSUE_DELETED, {});
		} else {
			return response(res, 401, message.INVALID_DETAILS, {});
		}
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


