const testcycleService = require('../services/testcycle.service').testcycleService;
const { response } = require('../utils/utility');
const message = require('../utils/message');
const formidable = require('formidable');
const fs = require('fs');
const csv = require('csv-parser');
const readXlsxFile = require('read-excel-file/node');
const regionsSetup = require('../utils/helper');
/**
 * This is a route for adding a testcycle
 * @route POST /testcycle
 * @group TestCycle 
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
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data)
			console.log("2222222222222222222222", data.acct_id)
			console.log("2222222222222222222222", data.project_id)
			let regionData = await regionsSetup(data);
			let result = await testcycleService.addTestCycle(data, files);
			return response(res, result.rescode, result.msg, result.data);
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get particular testcycle detail
 * @route GET /testcycle/id
 * @security JWT
 * @group TestCycle
 * @param {string} testcycle_id.query.required - testcycle Id
 * @param {integer} project_id.query.required - project id from which testcycle belong
 * @param {string} domain_id.query.required - domain Id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.testcycleDetailById = async (req, res) => {
	try {
		let data = {};
		data['testcycle_id'] = req.query.testcycle_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		data['acct_id'] = req.query.user;
		let regionData = await regionsSetup(data);
		let result = await testcycleService.testcycleDetailById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcycle list
 * @route GET /testcycle/listTestcase
 * @security JWT
 * @group TestCycle
 * @param {string} domain_id.query.required - cloud app domain id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} user.query.required -cloud app acct id
 * @param {string} folder_id.query -folder_id
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.listTestcase = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.user;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['folder_id'] = req.query.folder_id;
		let regionData = await regionsSetup(data);
		let result = await testcycleService.listTestcase(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to delete the existing testcycle
 * @route DELETE /testcycle
 * @security JWT
 * @group TestCycle
 * @param {string} acct_id.query.required - acct Id of user who is deleting the testcycle
 * @param {integer} project_id.query.required - project Id in which testcycle to be deleted
 * @param {string} testcycle_id.query.required - testcycle Id that is to be deleted
 * @param {string} domain_id.query.required - domain Id 
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.delete = async (req, res) => {
	try {
		let data = {};
		data['testcycle_id'] = req.query.testcycle_id;
		data['acct_id'] = req.query.user;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		let regionData = await regionsSetup(data);
		let result = await testcycleService.delete(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This is a route for adding a testcycleupdate
 * @route PUT /testcycle
 * @group TestCycle 
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
		let form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			let data = JSON.parse(fields.data);
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data)
			console.log("2222222222222222222222", data.acct_id)
			console.log("2222222222222222222222", data.project_id)
			let regionData = await regionsSetup(data);
			let result = await testcycleService.updateTestcycle(data, files);
			return response(res, result.rescode, result.msg, result.data);
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef addTestCases
 * @property {string} testcycle_id.data.required - Test Cycle Id
 * @property {string} acct_id.data.required - cloud app acct Id
 * @property {integer} project_id.data.required - project Id
 * @property {Array.<object>} testcases - testcases array
 */
/**
 * This is a route for adding a testcycle
 * @route POST /testcycle/testcases
 * @security JWT
 * @group TestCycle
 * @param {addTestCases.model} addTestCases.body.required - the new point
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

exports.addTestCases = async (req, res) => {
	try {
		let data = req.body;
		console.log("Data = " + JSON.stringify(data));
		let regionData = await regionsSetup(data);
		let result = await testcycleService.addTestCases(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

// clone testcycle

/**
 * @typedef testcycleClone
 * @property {string} testcycle_id.data.required - testcycle_id of the testcycle
 * @property {integer} project_id.data.required - project Id
 * @property {string} domain_id.data.required - domain Id
 */

/**
 * This is a route for cloning a testcycle
 * @route POST /testcycle/clone
 * @security JWT
 * @group TestCycle
 * @param {testcycleClone.model} testcycleClone.body.required - the new point
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

exports.cloneTestCycle = async (req, res) => {
	try {
		let data = req.body;
		data['acct_id'] = req.query.user
		let regionData = await regionsSetup(data);
		let result = await testcycleService.cloneTestCycle(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to get particular testcycle detail
 * @route GET /testcycle/planList
 * @security JWT
 * @group TestCycle
 * @param {string} acct_id.query.required - acct Id
 * @param {string} project_id.query - project id from which testcycle belong
 * @param {string} domain_id.query.required - domain Id
 * @param {string} plan_name.query.required - test plan name
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.planList = async (req, res) => {
	try {
		let data = {};
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		data['acct_id'] = req.query.acct_id;
		data['plan_name'] = req.query.plan_name;
		let regionData = await regionsSetup(data);
		let result = await testcycleService.planList(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get test cycle history
 * @route GET /testcycle/history
 * @security JWT
 * @group TestCycle
 * @param {string} testcycle_id.query.required - testcycle Id
 * @param {integer} project_id.query.required - project id from which testcycle belong
 * @param {string} domain_id.query.required - domain Id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.history = async (req, res) => {
	try {
		let data = {};
		data['testcycle_id'] = req.query.testcycle_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		data['acct_id'] = req.query.user;
		let regionData = await regionsSetup(data);
		let result = await testcycleService.cycleHistory(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is created to upload csv file of test cycle 
 * @route POST /testcycle/importData
 * @group TestCycle 
 * @security JWT
 * @param {file} file.formData - CSV file
 * @param {feild} data.formData -{"acct_id":"","project_id":"","domain_id":""}
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.importTestcycle = async (req, res) => {
	try {
		let results = [];
		let accessData = {};
		accessData['domain_id'] = testcaseData.domain_id;
		accessData['project_id'] = testcaseData.project_id;
		accessData['acct_id'] = testcaseData.acct_id;
		let regionData = await regionsSetup(accessData);
		//let data = {};
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const testcycleData = JSON.parse(fields.data);
			if (Object.keys(files).length != 0) {
				if (files.file.name.endsWith('.csv')) {
					console.log("ccccccccsssssssssssssvvvvvvv@", files.file.name)
					fs.createReadStream(files.file.path)
						.pipe(csv())
						.on('data', (data) => {
							results.push(data);
						})
						.on('end', async () => {
							console.log("ccccccccsssssssssssssvvvvvvv@", results)
							//checking if all the columns in the file exists or not
							if ('name' in results[0] && 'description' in results[0] && 'status' in results[0] && 'environment' in results[0]
								&& 'planned_start_date' in results[0] && 'planned_end_date' in results[0]) {
								console.log("check the data comes from the different part of the system", results)
								let result = await testcycleService.importDatas(results, testcycleData);
								return response(res, result.rescode, result.msg, result.data);
							} else {
								return response(res, 401, message.COLUMN_MISSING, {}, null);
							}
						});
				} else {
					if (files.file.name.endsWith('.xlsx' || '.xls')) {
						readXlsxFile(fs.createReadStream(files.file.path)).then(async (rows) => {
							console.log("I ned the column nahe of thus ", rows[0])
							if (rows[0].includes("name") && rows[0].includes("description") && rows[0].includes("status") && rows[0].includes("environment") &&
								rows[0].includes("planned_start_date") && rows[0].includes("planned_end_date")) {
								rows.shift();
								let excelData = [];
								rows.forEach((row) => {
									let tutorial = {
										name: row[0],
										description: row[1],
										status: row[2],
										environment: row[3],
										planned_start_date: row[4],
										planned_end_date: row[5]
									};
									excelData.push(tutorial);
								});
								console.log("HELLO EXCAEL DATA ", excelData)
								let result = await testcycleService.importDatas(excelData, testcycleData);
								return response(res, result.rescode, result.msg, result.data);
							} else {
								return response(res, 401, message.COLUMN_MISSING, {}, null);
							}
						})
					} else {
						return response(res, 401, message.FILE_FORMAT, {}, null);
					}
				}
			} else {
				return response(res, 401, message.EMPTY_FILE, {}, null);
			}
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
* @typedef TestCycleExport
* @property {string} acct_id - acct_id of jira
* @property {integer} project_id - project ID from jira
* @property {string} domain_id - jira domain ID
* @property {string} testcycle_ids - coma separated value of test cycle id
* @property {Array.<string>} owner_array.data.required - owner_array of the testcase
* @property {string} file_type - file_type like csv or xlsx
*/
/**
 * This function is used to add priority
 * @route POST /testcycle/exportFile
 * @security JWT
 * @group TestCycle
 * @param {TestCycleExport.model} TestCycleExport.body.required - the new point
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
exports.exportFile = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.body.acct_id;
		data['project_id'] = parseInt(req.body.project_id);
		data['domain_id'] = req.body.domain_id;
		data['file_type'] = req.body.file_type;
		data['testcycle_ids'] = req.body.testcycle_ids;
		data['owner_array'] = req.body.owner_array;
		let regionData = await regionsSetup(data);
		let result = await testcycleService.fileExports(data, res);
		//return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to get particular test case version details
 * @route GET /testcycle/versionDetail
 * @security JWT
 * @group TestCycle
 * @param {string} acct_id.query.required - acct Id
 * @param {string} project_id.query - project id from which testcycle belong
 * @param {string} domain_id.query.required - domain Id
 * @param {string} testcase_id.query.required - test case id
 * @param {string} version.query.required - version no
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.versionDetail = async (req, res) => {
	try {
		let data = {};
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		data['acct_id'] = req.query.acct_id;
		data['testcase_id'] = req.query.testcase_id;
		data['version'] = req.query.version;
		let regionData = await regionsSetup(data);
		let result = await testcycleService.versionDetail(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};