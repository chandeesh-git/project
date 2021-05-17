const testcaseService = require('../services/testcase.service').testcaseService;
const projectService = require('../services/project.service').projectService;
const {response} = require('../utils/utility');
const message = require('../utils/message');

/**
 * @typedef project
 * @property {integer} project_id.data.required - Project Id
 * @property {string} acct_id.data.required - User's Account Id
 * @property {integer} inquestPro_enabled - enable/disable inquestPro for project
 * @property {integer} permission_status - enable/disable access permission
 * @property {string} story_enabled - enable/disable story for inquestPro
 * @property {string} task_enabled - enable/disable story for inquestPro
 * @property {string} bug_enabled - enable/disable story for inquestPro
 * @property {string} epic_enabled - enable/disable story for inquestPro
 * @property {string} subtask_enabled - enable/disable story for inquestPro
 * @property {string} domain_id - domain ID from JIRA
 * @property {string} region_id -region id of inquest_pro
 */
/**
 * This function is used to add projectInfo
 * @route POST /project
 * @security JWT
 * @group Project
 * @param {project.model} project.body.required - the new point
 * @param {string} user.query.required
 * @param {string} user_name.query
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.createProject = async (req, res) => {
	try {
		let data = {};
		data['project_id'] = req.body.project_id;
		data['acct_id'] = req.body.acct_id;
		data['inquestPro_enabled'] = req.body.inquestPro_enabled || 0;
		data['permission_status'] = req.body.permission_status || 0;
		data['story_enabled'] = req.body.story_enabled || 0;
		data['task_enabled'] = req.body.task_enabled || 0;
		data['bug_enabled'] = req.body.bug_enabled || 0;
		data['epic_enabled'] = req.body.epic_enabled || 0;
		data['subtask_enabled'] = req.body.subtask_enabled || 0;
		data['domain_id'] = req.body.domain_id || 0;
		data['user_name'] = req.query.user_name || null;
		data['region_id'] = req.body.region_id ;
		// Configuration Status table master data 
		let arrayData = [{
				domain_id: req.body.domain_id,
				sc_name: 'Draft',
				sc_description: '',
				sc_status: 0,
				sc_color: '#FFA900',
				sc_type: 'testcase',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Deprecated',
				sc_description: '',
				sc_status: 0,
				sc_color: '#4B88E7',
				sc_type: 'testcase',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Approved',
				sc_description: '',
				sc_status: 0,
				sc_color: '#008000',
				sc_type: 'testcase',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Draft',
				sc_description: '',
				sc_status: 0,
				sc_color: '#FFA900',
				sc_type: 'testplan',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Deprecated',
				sc_description: '',
				sc_status: 0,
				sc_color: '#4B88E7',
				sc_type: 'testplan',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Approved',
				sc_description: '',
				sc_status: 0,
				sc_color: '#008000',
				sc_type: 'testplan',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Not Executed',
				sc_description: '',
				sc_status: 0,
				sc_color: '#DEDEDE',
				sc_type: 'testcycle',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'In Progress',
				sc_description: '',
				sc_status: 0,
				sc_color: '#FFA900',
				sc_type: 'testcycle',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Done',
				sc_description: '',
				sc_status: 0,
				sc_color: '#3ABB4B',
				sc_type: 'testcycle',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Not Executed',
				sc_description: '',
				sc_status: 0,
				sc_color: '#DEDEDE',
				sc_type: 'testexecution',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'In Progress',
				sc_description: '',
				sc_status: 0,
				sc_color: '#FFA900',
				sc_type: 'testexecution',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Pass',
				sc_description: '',
				sc_status: 0,
				sc_color: '#3ABB4B',
				sc_type: 'testexecution',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Fail',
				sc_description: '',
				sc_status: 0,
				sc_color: '#DF4C4C',
				sc_type: 'testexecution',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				sc_name: 'Blocked',
				sc_description: '',
				sc_status: 0,
				sc_color: '#4B88E7',
				sc_type: 'testexecution',
				created_by:req.body.acct_id
			}
			]
		let priorityData = [
			{
				domain_id: req.body.domain_id,
				pc_name: 'High',
				priority_label: 'H',
				priority_color: '#DF4C4C',
				priority_type: 'testcase',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Normal',
				priority_label: 'N',
				priority_color: '#FFA900',
				priority_type: 'testcase',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Low',
				priority_label: 'L',
				priority_color: '#008000',
				priority_type: 'testcase',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'High',
				priority_label: 'H',
				priority_color: '#DF4C4C',
				priority_type: 'testplan',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Normal',
				priority_label: 'N',
				priority_color: '#FFA900',
				priority_type: 'testplan',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Low',
				priority_label: 'L',
				priority_color: '#008000',
				priority_type: 'testplan',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'High',
				priority_label: 'H',
				priority_color: '#DF4C4C',
				priority_type: 'testcycle',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Normal',
				priority_label: 'N',
				priority_color: '#FFA900',
				priority_type: 'testcycle',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Low',
				priority_label: 'L',
				priority_color: '#008000',
				priority_type: 'testcycle',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'High',
				priority_label: 'H',
				priority_color: '#DF4C4C',
				priority_type: 'testexecution',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Normal',
				priority_label: 'N',
				priority_color: '#FFA900',
				priority_type: 'testexecution',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				pc_name: 'Low',
				priority_label: 'L',
				priority_color: '#008000',
				priority_type: 'testexecution',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			}
		]
		let environmentData = [
			{
				domain_id: req.body.domain_id,
				ec_name: 'Development',
				ec_description: '',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				ec_name: 'Test',
				ec_description: '',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				ec_name: 'Acceptance',
				ec_description: '',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				ec_name: 'Production',
				ec_description: '',
				created_by:req.body.acct_id,
				updated_by:req.body.acct_id
			}
		]
		let componentData = [
			{
				domain_id: req.body.domain_id,
				cp_name: 'None',
				cp_description: '',
				cp_color: '',
				cp_type: 'testcase',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				cp_name: 'None',
				cp_description: '',
				cp_color: '',
				cp_type: 'testcycle',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				cp_name: 'None',
				cp_description: '',
				cp_color: '',
				cp_type: 'testplan',
				created_by:req.body.acct_id
			},
			{
				domain_id: req.body.domain_id,
				cp_name: 'None',
				cp_description: '',
				cp_color: '',
				cp_type: 'testexecution',
				created_by:req.body.acct_id
			}
		]
		let cycleKey={}
		cycleKey['domain_id'] = req.body.domain_id,
		cycleKey['project_id'] = req.body.project_id,
		cycleKey['test_type'] = "testcycle",
		cycleKey['test_count'] = 0;

		let planKey={}
		planKey['domain_id'] = req.body.domain_id,
		planKey['project_id'] = req.body.project_id,
		planKey['test_type'] = "testplan",
		planKey['test_count'] = 0;
		let result = await projectService.addProject(data,arrayData,priorityData,environmentData,componentData,cycleKey,planKey);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to delete project
 * @route POST /project/deleted
 * @security JWT
 * @group Project
 * @param {integer} projectId.query.required - the new point
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

exports.deleteProject = async (req, res) => {
	try {
		let data = {};
		let result = await projectService.deleteProject(req.query.projectId);
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
 * @typedef Project
 * @property {integer} project_id.data.required - Project Id
 * @property {integer} inquestPro_enabled - enable/disable inquestPro for project
 * @property {integer} permission_status - enable/disable access permission
 * @property {string} story_enabled - enable/disable story for inquestPro
 * @property {string} task_enabled - enable/disable story for inquestPro
 * @property {string} bug_enabled - enable/disable story for inquestPro
 * @property {string} epic_enabled - enable/disable story for inquestPro
 * @property {string} subtask_enabled - enable/disable story for inquestPro
 */
/**
 * This function is used to update project
 * @route PUT /project
 * @security JWT
 * @group Project
 * @param {project.model} project.body.required - the new point
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

exports.updateProject = async (req, res) => {
	try {
		let data = {};
		console.log("Project updated");
		let result = await projectService.updateProject(req.body);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to render project setting view
 * @route GET /project/projectView
 * @security JWT
 * @group Project
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

exports.getInitialView = async (req, res) => {
	try {
		if(req.query.projectId == "") {
			res.render('globalappsetup/globalapp_setup_layout', {
				'projectId': null,
				'projectKey': null,
				'selectedFolderId': null,
				'isProject': 'false'	
			});
		} else {
			res.render('intialpage/initial_setup_layout', {
				'projectId': req.query.projectId,
				'projectKey': req.query.projectKey,
				'selectedFolderId': null		
			});
		}
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getProjectView = async (req, res) => {
	try {
		if(req.query.projectId == "") {
			res.render('globalappsetup/globalapp_setup_layout', {
				'projectId': null,
				'projectKey': null,
				'selectedFolderId': null,
				'isProject': 'false'	
			});
		} else {
			res.render('appsetup/app_setup_layout', {
				'projectId': req.query.projectId,
				'projectKey': req.query.projectKey,
				'selectedFolderId': null		
			});
		}
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getGlobalProjectView = async (req, res) => {
	try {
		let isProject = 'true';
		let projectId = req.query.projectId;
		let projectKey = req.query.projectKey;

		if(req.query.projectId == "") {
			isProject = 'false';
		}

		res.render('globalappsetup/globalapp_setup_layout', {
			'projectId': projectId,
			'projectKey': projectKey,
			'selectedFolderId': null,
			'isProject': isProject	
		});
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getConfigurationView = async (req, res) => {
	try {
		let projectId = req.query.projectId;
		let projectKey = req.query.projectKey;
		res.render('configuration/configuration_layout', {
			'projectId': projectId,
			'projectKey': projectKey,
			'selectedFolderId': null	
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getGlobalsettingView = async (req, res) => {
	try {
		let isProject = 'true';
		let projectId = req.query.projectId;
		let projectKey = req.query.projectKey;

		if(req.query.projectId == "") {
			isProject = 'false';
		}

		res.render('globalsetting/globalsetting_layout', {
			'projectId': projectId,
			'projectKey': projectKey,
			'selectedFolderId': null,
			'isProject': isProject
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getTestCasesView = async (req, res) => {
	try {
		let projectId = req.query.projectId;
		let viewPage = req.query.page;
		let editId = req.query.editId;
		let projectKey = req.query.projectKey;
		let selectedFolderId = req.query.selectedFolderId;

		let version = "";
		let environment = "";
		let owner = "";
		if(viewPage == "execute")
		{
			version = req.query.version;
			environment = req.query.environment;
			owner = req.query.owner;
		}

		res.render('testcases/test_cases_layout', {
			'projectId': projectId,
			'viewPage': viewPage,
			'editId': editId,
			'projectKey': projectKey,
			'selectedFolderId': selectedFolderId,
			'version': version,
			'environment': environment,
			'owner': owner
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getTestCycleView = async (req, res) => {
	try {
		let projectId = req.query.projectId;
		let viewPage = req.query.page;
		let projectKey = req.query.projectKey;
		let selectedFolderId = req.query.selectedFolderId;
		let editId = req.query.editId;

		let environment = "";
		if(viewPage == "execute")
		{
			environment = req.query.environment;
		}

		res.render('testcycle/test_cycle_layout', {
			'projectId': projectId,
			'viewPage': viewPage,
			'projectKey': projectKey,
			'editId': editId,
			'selectedFolderId': selectedFolderId,
			'environment': environment
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getTestPlanView = async (req, res) => {
	try {
		let projectId = req.query.projectId;
		let viewPage = req.query.page;
		let projectKey = req.query.projectKey;
		let selectedFolderId = req.query.selectedFolderId;
		let editId = req.query.editId;
		res.render('testplan/test_plan_layout', {
			'projectId': projectId,
			'viewPage': viewPage,
			'projectKey': projectKey,
			'editId': editId,
			'selectedFolderId': selectedFolderId
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getReportView = async (req, res) => {
	try {
		let projectId = req.query.projectId;
		res.render('report/report_layout', {
			'projectId': projectId
        });
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

exports.getIssueView = async (req, res) => {
	try {
		let projectId = req.query.project_id;
		let issueId = req.query.issue_id;
		res.render('issues/issues_layout', {
			'projectId': projectId,
			'issueId': issueId
		});
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to render project setting view
 * @route GET /project/mainPage
 * @security JWT
 * @group Project
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

exports.getMainPage = async (req, res) => {
	try {
		if(req.query.projectId == "") {
			res.render('globalappsetup/globalapp_setup_layout', {
				'projectId': null,
				'projectKey': null,
				'selectedFolderId': null,
				'isProject': 'false'	
			});
		} else {
			res.render('appsetup/app_setup_layout', {
				'projectId': req.query.projectId,
				'selectedFolderId': null		
			});
		}
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list all projects
 * @route GET /project/list
 * @security JWT
 * @group Project
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.listProjects = async (req, res) => {
	try {
		let result = await projectService.listProjects();
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get project by id
 * @route GET /project/id
 * @security JWT
 * @group Project
 * @param {integer} project_id.query.required
 * @param {string} acct_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getProjectById = async (req, res) => {
	try {
		let result = await projectService.getProjectById(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to get project by id
 * @route GET /project/idOtherUser
 * @security JWT
 * @group Project
 * @param {integer} project_id.query.required
 * @param {string} acct_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getProjectByIdUser = async (req, res) => {
	try {
		let result = await projectService.getProjectByIdUser(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};


/**
 * This function is used to list all region of inquestPro projects
 * @route GET /project/regionList
 * @security JWT
 * @group Project
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

 exports.regionList = async (req, res) => {
	try {
		let result = await projectService.regionList();
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};