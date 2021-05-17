const testcaseService = require('../services/testcase.service').testcaseService;
const { response } = require('../utils/utility');
const message = require('../utils/message');
const formidable = require('formidable');
const fs = require('fs');
const csv = require('csv-parser');
const readXlsxFile = require('read-excel-file/node');
const regionsSetup = require('../utils/helper');

/**
 * This is a route for adding a testcase
 * @route POST /testcase
 * @group TestCase 
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
			//let data = fields.data;
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data)
			console.log("2222222222222222222222", data.acct_id)
			console.log("2222222222222222222222", data.project_id)
			let regionData = await regionsSetup(data);
			let result = await testcaseService.addTestCase(data, files,regionData);
			return response(res, result.rescode, result.msg, result.data);

		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get particular testcase detail
 * @route GET /testcase/id
 * @security JWT
 * @group TestCase
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} acct_id.query.required - acct_id Id 
 * @param {string} domain_id.query.required - domain Id
 * @param {string} testcase_id.query.required - testcase Id
 * @param {string} version.query - testcase Id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.detail = async (req, res) => {
	try {
		let data = {};
		data['domain_id'] = req.query.domain_id;
		data['project_id'] = req.query.project_id;
		data['acct_id'] = req.query.acct_id;
		data['testcase_id'] = req.query.testcase_id;
		data['version'] = req.query.version;
		let regionData = await regionsSetup(data);
		console.log("This the data of the heritage ",regionData)
		let result = await testcaseService.testcaseDetail(data,regionData);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcases list
 * @route GET /testcase/list
 * @security JWT
 * @group TestCase
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
		let result = await testcaseService.list(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcases list
 * @route GET /testcase/listOwner
 * @security JWT
 * @group TestCase
 * @param {integer} project_id.query.required - Project ID 
 * @param {string} domain_id.query.required - domain ID
 * @param {string} test_type.query.required - test type
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.listOwner = async (req, res) => {
	try {
		let data = {};
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['test_type'] = req.query.test_type;
		let result = await testcaseService.listOwner(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to delete the existing folders
 * @route DELETE /testcase
 * @security JWT 
 * @group TestCase 
 * @param {string} acct_id.query.required - acct Id of user who is deleting the testcase
 * @param {integer} project_id.query.required - project Id in which testcase to be deleted
 * @param {string} domain_id.query.required - domain Id of user who is deleting the testcase
 * @param {string} testcase_id.query.required - testcase Id that is to be deleted
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.delete = async (req, res) => {
	try {
		let data = {};
		data['testcase_id'] = req.query.testcase_id;
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = req.query.project_id;
		data['domain_id'] = req.query.domain_id;
		let result = await testcaseService.delete(data);
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
* This is a route for adding a testcase
* @route PUT /testcase
* @group TestCase 
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
			//let data = fields.data;
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data)
			console.log("2222222222222222222222", data.acct_id)
			console.log("2222222222222222222222", data.project_id)
			let regionData = await regionsSetup(data);
			let result = await testcaseService.updateTestcase(data, files,regionData);
			return response(res, result.rescode, result.msg, result.data);
		})
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * @typedef testcaseClone
 * @property {string} testcase_id.data.required - testcase_id of the testcase
 * @property {string} acct_id.data.required - cloud app acct Id
 * @property {integer} project_id.data.required - project Id
 * @property {string} domain_id.data.required - domain Id
 */

/**
 * This is a route for adding a testcase
 * @route POST /testcase/clone
 * @security JWT
 * @group TestCase
 * @param {testcaseClone.model} testcaseClone.body.required - the new point
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

exports.cloneTestCase = async (req, res) => {
	try {
		let data = req.body;
		let regionData = await regionsSetup(data);
		let result = await testcaseService.cloneTestCase(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to get testcases version list
 * @route GET /testcase/versionList
 * @security JWT
 * @group TestCase
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain in which folders are requested
 * @param {string} testcase_id.query.required - testcase_id in which folders are created
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.versionList = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcase_id'] = req.query.testcase_id;
		let result = await testcaseService.listVersion(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcases search
 * @route GET /testcase/search
 * @security JWT
 * @group TestCase
 * @param {integer} project_id.query.required - Project id of user
 * @param {string} domain_id.query.required - domain id of user
 * @param {string} test_type.query.required - test type like testcase testcycle, testplan
 * @param {string} search_string.query.required - search_string of user
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.search = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.user;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['test_type'] = req.query.test_type;
		data['search_string'] = req.query.search_string;
		let regionData = await regionsSetup(data);
		let result = await testcaseService.searchTest(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcases history
 * @route GET /testcase/history
 * @security JWT
 * @group TestCase
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain in which folders are requested
 * @param {string} testcase_id.query.required - testcase_id in which folders are created
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.testcaseHistory = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.user;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcase_id'] = req.query.testcase_id;
		let result = await testcaseService.testcaseHistory(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function will return admin id of admin
 * @route POST /testcase/importData
 * @group TestCase 
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

exports.importTestcase = async (req, res) => {
	try {
		let results = [];
		//let data = {};
		let accessData = {};
		accessData['domain_id'] = testcaseData.domain_id;
		accessData['project_id'] = testcaseData.project_id;
		accessData['acct_id'] = testcaseData.acct_id;
		let regionData = await regionsSetup(accessData);
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const testcaseData = JSON.parse(fields.data);
			if (Object.keys(files).length != 0) {
				if (files.file.name.endsWith('.csv')) {
					console.log("ccccccccsssssssssssssvvvvvvv@", files.file.name)
					fs.createReadStream(files.file.path)
						.pipe(csv())
						.on('data', (data) => {
							results.push(data);
						})
						.on('end', async () => {
							//checking if all the columns in the file exists or not
							if ('name' in results[0] && 'description' in results[0] && 'precondition' in results[0]
								&& 'status' in results[0] && 'priority' in results[0] && 'component' in results[0]
								&& 'estimated_time' in results[0] && 'label' in results[0] && 'objective' in results[0]) {
								console.log("check the data comes from the different part of the system", results)
								let result = await testcaseService.importDatas(results, testcaseData);
								return response(res, result.rescode, result.msg, result.data);
							} else {
								return response(res, 401, message.COLUMN_MISSING, {}, null);
							}
						});
				} else {
					if (files.file.name.endsWith('.xlsx' || '.xls')) {
						readXlsxFile(fs.createReadStream(files.file.path)).then(async (rows) => {
							console.log("I ned the column nahe of thus ", rows[0])
							if (rows[0].includes("name") && rows[0].includes("description") && rows[0].includes("precondition")  &&
								rows[0].includes("status") && rows[0].includes("priority") && rows[0].includes("component") && rows[0].includes("estimated_time")
								&& rows[0].includes("label") && rows[0].includes("objective")) {
								rows.shift();
								let excelData = [];
								rows.forEach((row) => {
									let tutorial = {
										name: row[0],
										description: row[1],
										precondition: row[2],
										objective: row[3],
										status: row[4],
										priority: row[5],
										component: row[6],
										estimated_time: row[7],
										label: row[8]
									};
									excelData.push(tutorial);
								});
								console.log("HELLO EXCAEL DATA ", excelData)
								let result = await testcaseService.importDatas(excelData, testcaseData);
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
 * @typedef testcaseVersion
 * @property {Array.<string>} testcase_id.data.required - testcase_id of the testcase
 * @property {integer} project_id.data.required - project Id
 * @property {string} domain_id.data.required - domain Id
 */

/**
 * This is a route for adding a testcase
 * @route POST /testcase/compareVersion
 * @security JWT
 * @group TestCase
 * @param {testcaseVersion.model} testcaseVersion.body.required - the new point
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

exports.testcaseVersionCompare = async (req, res) => {
	try {
		let data = req.body;
		data['acct_id'] = req.query.user;
		let regionData = await regionsSetup(data);
		let result = await testcaseService.testcaseVersionCompare(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * @typedef testCaseExport
 * @property {string} acct_id - acct_id of jira
 * @property {integer} project_id - project ID from jira
 * @property {string} domain_id - jira domain ID
 * @property {string} testcase_ids - coma separated value of test case id
 * @property {Array.<string>} owner_array.data.required - owner_array of the testcase
 * @property {string} file_type - file_type like csv or xlsx
 */
/**
 * This function is used to add priority
 * @route POST /testcase/exportFile
 * @security JWT
 * @group TestCase
 * @param {testCaseExport.model} testCaseExport.body.required - the new point
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
		data['testcase_ids'] = req.body.testcase_ids;
		data['owner_array'] = req.body.owner_array;
		let regionData = await regionsSetup(data);
		let result = await testcaseService.fileExports(data, res);
		//return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcases showLogs
 * @route GET /testcase/showLogs
 * @security JWT
 * @group TestCase
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain in which folders are requested
 * @param {string} testcase_id.query.required - testcase_id
 * @param {string} version.query.required - version of testcase
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.showLogs = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.user;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcase_id'] = req.query.testcase_id;
		data['version'] = req.query.version;
		let regionData = await regionsSetup(data);
		let result = await testcaseService.viewLogs(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef testcaseBulkCreate
 * @property {string} acct_id.data.required - cloud app acct Id
 * @property {integer} project_id.data.required - project Id
 * @property {string} domain_id.data.required - domain Id
 * @property {Array.<string>} name.data.required - name of the testcase
 * @property {string} status.data.required - status of the testcase
 * @property {string} priority.data.required - priority of the testcase
 * @property {string} owner.data.required - owner of the testcase
 * @property {string} label.data.required - label of the testcase
 * @property {string} component.data.required - component of the testcase
 */

/**
 * This is a route for bulk Create 
 * @route POST /testcase/bulkCreate
 * @security JWT
 * @group TestCase
 * @param {testcaseBulkCreate.model} testcaseBulkCreate.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.bulkCreate = async (req, res) => {
	try {
		let data = req.body;
		let result = await testcaseService.bulkCreate(data);
		let regionData = await regionsSetup(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get Issue details
 * @route GET /testcase/issueDetails
 * @security JWT
 * @group TestCase
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain_id of jira
 * @param {string} issue_id.query.required - issue_id of jira
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.issueDetails = async (req, res) => {
	try {
		let data = {};
		data['project_id'] = parseInt(req.query.project_id);
		data['issue_id'] = req.query.issue_id;
		data['domain_id'] = req.query.domain_id;
		let regionData = await regionsSetup(data);
		let result = await testcaseService.issueDetails(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get testcases executionList
 * @route GET /testcase/executionList
 * @security JWT
 * @group TestCase
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain in which folders are requested
 * @param {string} testcase_id.query.required - testcase_id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.executionList = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.user;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['testcase_id'] = req.query.testcase_id;
		let regionData = await regionsSetup(data);
		let result = await testcaseService.executionList(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};