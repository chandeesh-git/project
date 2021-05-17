const testplanService = require('../services/testplan.service').testplanService;
const {response} = require('../utils/utility');
const message = require('../utils/message');
const formidable = require('formidable');
const fs = require('fs');
const regionsSetup = require('../utils/helper');

/**
 * This is a route for adding a testplan
 * @route POST /testplan
 * @group TestPlan 
 * @security JWT
 * @param {string} user.query.required
 * @param {file} file.formData - attachment image
 * @param {feild} data.formData - 
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.add = async (req, res) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
		let data = JSON.parse(fields.data);
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",data)
		console.log("2222222222222222222222",data.acct_id)
		console.log("2222222222222222222222",data.project_id)
		let regionData = await regionsSetup(data);
		let result =  await testplanService.addTestPlan(data,files,regionData);
		return response(res, result.rescode, result.msg, result.data);    
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get particular testplan detail
 * @route GET /testplan/id
 * @security JWT
 * @group TestPlan
 * @param {string} testplan_id.query.required - testplan Id
 * @param {integer} project_id.query.required - project Id
 * @param {string} domain_id.query.required - domain Id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.testplanDetailById = async (req, res) => {
	try {
		let data = {};
		data['testplan_id'] = req.query.testplan_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		data['acct_id'] = req.query.user;
		let regionData = await regionsSetup(data);
		let result = await testplanService.testplanDetailById(data,regionData);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcases list
 * @route GET /testplan/list
 * @security JWT
 * @group TestPlan
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain in which folders are requested
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.list = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		let regionData = await regionsSetup(data);
		let result = await testplanService.list(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to delete the existing testplan
 * @route DELETE /testplan
 * @security JWT
 * @group TestPlan
 * @param {string} testplan_id.query.required - testplan Id that is to be deleted
 * @param {integer} project_id.query.required - project id
 * @param {string} domain_id.query.required - domain id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.delete = async (req, res) => {
	try {
		let data = {};
		data['testplan_id'] = req.query.testplan_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		data['acct_id'] = req.query.user;
		let regionData = await regionsSetup(data);
		let result = await testplanService.delete(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

 /**
 * This is a route for adding a testplan
 * @route PUT /testplan
 * @group TestPlan 
 * @security JWT
 * @param {string} user.query.required
 * @param {file} file.formData - attachment image
 * @param {feild} data.formData - 
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.update = async (req, res) => {
	try {
		let data = req.body;
		let form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			let data = JSON.parse(fields.data);
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data)
			console.log("2222222222222222222222", data.acct_id)
			console.log("2222222222222222222222", data.project_id)
			let regionData = await regionsSetup(data);
			let result = await testplanService.updateTestplan(data, files,regionData);
			return response(res, result.rescode, result.msg, result.data);
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get test plan cycleList
 * @route GET /testplan/cycleList
 * @security JWT
 * @group TestPlan
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {string} project_id.query - Project in which folders are requested
 * @param {string} domain_id.query.required - domain in which folders are requested
 * @param {string} cycle_name.query.required - test cycle name
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.cycleList = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		data['cycle_name'] = req.query.cycle_name;
		let regionData = await regionsSetup(data);
		let result = await testplanService.cycleList(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get test plan history
 * @route GET /testplan/history
 * @security JWT
 * @group TestPlan
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain in which folders are requested
 * @param {string} testplan_id.query.required - 
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.history = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testplan_id'] = req.query.testplan_id;
		let regionData = await regionsSetup(data);
		let result = await testplanService.history(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};
