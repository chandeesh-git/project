const testexecutionService = require('../services/testexecution.service').testexecutionService;
const {response} = require('../utils/utility');
const message = require('../utils/message');
const formidable = require('formidable');
const fs = require('fs');
const regionsSetup = require('../utils/helper');

/**
 * @typedef testExecution
 * @property {string} testcycle_id.data.required - Test Cycle Id
 * @property {string} acct_id.data.required - cloud app acct Id
 * @property {integer} project_id.data.required - project Id
 * @property {object} testcase - testcase for which execution to be added
 */
/**
 * This is a route for adding a test execution
 * @route POST /testexecution
 * @security JWT
 * @group TestExecution
 * @param {testExecution.model} testExecution.body.required - the new point
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

exports.add = async (req, res) => {
	try {
		let data = req.body;
		console.log("Data = "+JSON.stringify(data));
		let regionData = await regionsSetup(data);
		let result =  await testexecutionService.add(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef testExecutionUpdate
 * @property {string} testexecution_id.data.required - Test Cycle Id
 * @property {string} acct_id.data.required - cloud app acct Id
 * @property {integer} project_id.data.required - project Id
 * @property {object} update - updates to test execution
 */
/**
 * This is a route for updating test execution
 * @route PUT /testexecution
 * @security JWT
 * @group TestExecution
 * @param {testExecutionUpdate.model} testExecutionUpdate.body.required - the new point
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

exports.update = async (req, res) => {
	try {
		let data = req.body;
		console.log("Data = "+JSON.stringify(data));
		let regionData = await regionsSetup(data);
		let result =  await testexecutionService.update(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcycle list
 * @route GET /testexecution/list
 * @security JWT
 * @group TestExecution
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} testcycle_id.query.required - testcycle id 
 * @param {string} testcase_id.query.required - testcase id for which execution list to be shown
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.list = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['testcycle_id'] = req.query.testcycle_id;
		data['testcase_id'] = req.query.testcase_id;
		let regionData = await regionsSetup(data);
		let result = await testexecutionService.list(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to get get test case run details
 * @route GET /testexecution/runDetails
 * @security JWT
 * @group TestExecution
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {string} domain_id.query.required - cloud app  domain_id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} testcycle_id.query.required - testcycle id
 * @param {string} testcase_id.query.required - testcase_id  
 * @param {string} version.query.required - version   
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.runDetails = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcycle_id'] = req.query.testcycle_id;
		data['testcase_id'] = req.query.testcase_id;
		data['version'] = req.query.version;
		let regionData = await regionsSetup(data);
		let result = await testexecutionService.runDetails(data,regionData);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to get test case list of test cycle for run
 * @route GET /testexecution/runTestList
 * @security JWT
 * @group TestExecution
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {string} domain_id.query.required - cloud app  domain_id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} testcycle_id.query.required - testcycle id 
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.runTestList = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcycle_id'] = req.query.testcycle_id;
		let regionData = await regionsSetup(data);
		let result = await testexecutionService.runTestList(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This is a route for adding a testexecution
 * @route POST /testexecution/add
 * @group TestExecution 
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

exports.addTestExecution = async (req, res) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
		let data = JSON.parse(fields.data);
		//let data = fields.data;
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",data)
		let regionData = await regionsSetup(data);
		let result =  await testexecutionService.addTestExecution(data,files,regionData);
		return response(res, result.rescode, result.msg, result.data);
    
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This is a route for adding a testexecution
 * @route PUT /testexecution/update 
 * @group TestExecution 
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

exports.updateTestExecution = async (req, res) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
		let data = JSON.parse(fields.data);
		//let data = fields.data;
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",data)
		let regionData = await regionsSetup(data);
		let result =  await testexecutionService.updateTestExecution(data,files,regionData);
		return response(res, result.rescode, result.msg, result.data);
    
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testers list
 * @route GET /testexecution/listTesters
 * @security JWT
 * @group TestExecution
 * @param {integer} project_id.query.required - Project ID 
 * @param {string} domain_id.query.required - domain ID
 * @param {string} test_type.query.required - test type
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.listTesters = async (req, res) => {
	try {
		let data = {};
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['test_type'] = req.query.test_type;
		let regionData = await regionsSetup(data);
		let result = await testexecutionService.listTesters(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get get test case new Execution
 * @route GET /testexecution/newExecution
 * @security JWT
 * @group TestExecution
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {string} domain_id.query.required - cloud app  domain_id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} testcycle_id.query - testcycle id
 * @param {string} testcase_id.query.required - testcase_id  
 * @param {string} version.query.required - version   
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.newExecution = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcycle_id'] = req.query.testcycle_id;
		data['testcase_id'] = req.query.testcase_id;
		data['version'] = req.query.version;
		let regionData = await regionsSetup(data);
		let result = await testexecutionService.newExecution(data,regionData);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used  create api for test execution for test case only 
 * @route GET /testexecution/testcaseDetails
 * @security JWT
 * @group TestExecution
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {string} domain_id.query.required - cloud app  domain_id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} testcase_id.query.required - testcase_id  
 * @param {string} version.query.required - version   
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.testcaseDetails = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcase_id'] = req.query.testcase_id;
		data['version'] = req.query.version;
		data['environment'] = req.query.environment;
		let regionData = await regionsSetup(data);
		let result = await testexecutionService.testcaseDetails(data,regionData);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used for list test execution details testcycle
 * @route GET /testexecution/executionDetailsReport
 * @security JWT
 * @group TestExecution
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {string} domain_id.query.required - cloud app  domain_id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} testcycle_id.query.required - testcycle_id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.issueDetails = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcycle_id'] = req.query.testcycle_id;	
		let regionData = await regionsSetup(data);	
		let result = await testexecutionService.issueDetails(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};