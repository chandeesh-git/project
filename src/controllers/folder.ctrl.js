const folderService = require('../services/folder.service').folderService;
const {response} = require('../utils/utility');
const message = require('../utils/message');
const regionsSetup = require('../utils/helper');

/**
 * @typedef folder
 * @property {string} acct_id.data.required - acct_id of cloud app
 * @property {integer} project_id.data.required - project_id of project
 * @property {string} domain_id.data.required - domain_id of project
 * @property {string} folder_name.data.required - folder name that is created   
 * @property {string} folder_category.data.required - folder category like testcase , testcycle, testplan 
 * @property {string} parent_folder_id - folder is subfolder or not
 */
/**
 * This function is used to add projectInfo
 * @route POST /folder
 * @security JWT
 * @group Folder
 * @param {folder.model} folder.body.required - the new point
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

exports.createFolder = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.body.acct_id;
		data['project_id'] = parseInt(req.body.project_id);
		data['domain_id'] = req.body.domain_id;
		data['folder_name'] = req.body.folder_name;
		data['folder_category'] = req.body.folder_category;
		data['created_by'] = req.body.acct_id;
		data['parent_folder_id'] = req.body.parent_folder_id || "";

		let result = await folderService.addFolder(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * @typedef renameFolder
 * @property {string} acct_id.data.required - acct_id of cloud app
 * @property {integer} project_id.data.required - project_id of project
 * @property {string} domain_id.data.required - domain_id of project
 * @property {string} folder_id.data.required - folder_id of folder
 * @property {string} folder_name.data.required - folder name that is created
 */
/**
 * This function is used to rename the added folder
 * @route PUT /folder
 * @security JWT
 * @group Folder
 * @param {renameFolder.model} renameFolder.body.required - the new point
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

exports.renameFolder = async (req, res) => {
	try {
		let data =req.body
		// data['folder_id'] = req.body.folder_id;
		// data['folder_name'] = req.body.folder_name;
		// data['project_id'] = req.body.project_id;
		// data['domain_id'] = req.body.domain_id;
		// data['acct_id'] = req.body.acct_id;

		let result = await folderService.updateFolder(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to delete the existing folders
 * @route DELETE /folder
 * @security JWT
 * @group Folder
 * @param {integer} project_id.query.required - Project id
 * @param {string} domain_id.query.required - domain id 
 * @param {string} folder_id.query.required - folder id
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.deleteFolder = async (req, res) => {
	try {
		let data = {};
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['folder_id'] = req.query.folder_id;
		data['acct_id'] = req.query.user;
		let result = await folderService.deleteFolder(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get list of folders 
 * @route GET /folder/list
 * @security JWT
 * @group Folder
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain_id of project
 * @param {string} folder_category.query.required -test type->testcase/testplan/testcycle/testexecution
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.listFolders = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['folder_category'] = req.query.folder_category;
		console.log(data)
		let regionData = await regionsSetup(data);
		let result = await folderService.listFolder(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get particular folder detail
 * @route GET /folder
 * @security JWT
 * @group Folder
 * @param {string} folder_id.query.required - Folders category test plan test cycle etc
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.folderDetail = async (req, res) => {
	try {
		let data = {};
		data['folder_id'] = req.query.folder_id;
		let result = await folderService.folderDetail(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};



/**
 * This function is used to get list of folders 
 * @route GET /folder/subFolder/list
 * @security JWT
 * @group Folder
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain_id of project
 * @param {string} parent_folder_id.query.required - parent_folder_id
 * @param {string} folder_category.query.required - test type->testcase/testplan/testcycle/testexecution
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.subFolder = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['parent_folder_id'] = req.query.parent_folder_id;
		data['folder_category'] = req.query.folder_category;
		let regionData = await regionsSetup(data);
		let result = await folderService.listSubFolder(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get list of folders 
 * @route GET /folder/testFlag
 * @security JWT
 * @group Folder
 * @param {string} acct_id.query.required - cloud app acct id
 * @param {integer} project_id.query.required - Project in which folders are requested
 * @param {string} domain_id.query.required - domain_id of project
 * @param {string} test_type.query.required -test type->testcase/testplan/testcycle/testexecution
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.testFlag = async (req, res) => {
	try {
		let data = {};
		data['acct_id'] = req.query.acct_id;
		data['project_id'] = parseInt(req.query.project_id);
		data['domain_id'] = req.query.domain_id;
		data['test_type'] = req.query.test_type;
		console.log(data)
		let result = await folderService.testFlag(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

