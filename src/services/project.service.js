const projectDao = require('../dao/project.dao').projectDetails;
const userDao = require('../dao/user.dao').userDetails;
const userGroupDao = require('../dao/user-group.dao').userGroupDatails;
const userRoleDao = require('../dao/user-role.dao').userRoleDetails;
const statusDao = require('../dao/status_config_dao').statusDetails;
const priorityDao = require('../dao/priority_config.dao').priorityConfigDetails;
const environmentDao = require('../dao/environment_config.dao').envConfigDetails;
const componentDao = require('../dao/component_config.dao').componentDetails;
const message = require('../utils/message');
const { checkUserAccess } = require('../utils/utility');
const globalStatusDao = require('../dao/global_status_config.dao').statusDetails;
const globalPriorityDao = require('../dao/global_priority_config.dao').priorityConfigDetails;
const globalEnvironmentDao = require('../dao/global_environment_config.dao').globalEnvConfigDetails;
const globalComponentDao = require('../dao/global_component_config.dao').componentDetails;
const globalLabelConfigDao = require('../dao/global_label_config.dao').labelConfigDetails;
const globalDatasetConfigDao = require('../dao/global_dataset_config.dao').datasetConfigDetails;
const globalCustomFieldConfigDao = require('../dao/global_custom_field.dao').customFieldConfigDetails;
const datasetConfigDao = require('../dao/dataset_config.dao').datasetConfigDetails;
const labelConfigDao = require('../dao/label_config.dao').labelConfigDetails;
const customFieldConfigDao = require('../dao/custom_field_config.dao').customFieldConfigDetails;
const roleDao = require('../dao/role.dao').roleDetails;
const globalRoleDao = require('../dao/global_role.dao').roleDetails;
const groupDao = require('../dao/group.dao').groupDetails;
const globalGroupDao = require('../dao/global_group.dao').groupDetails;
const testcycleDao = require('../dao/testcycle.dao').testcycleDetails;
const testplanDao = require('../dao/testplan.dao').testplanDetails;
// const globalUserGroupDao = require('../dao/global_user_group.dao').domainUserGroupList;
// const globalUserRoleDao = require('../dao/global_user_role.dao').domainUserRoleList;

const projectService = {
	addProject: async (data,arrayData,priorityData,environmentData,componentData,cycleKey,planKey) => {
		//ADD user into DB who is configuring the Project
		let checkUserExist = await userDao.checkUserExist(data);
		if(checkUserExist == null) {
			let user = await userDao.insertUserAccess([{'acct_id': data.acct_id, 'role_id': 2,'project_id':data.project_id,'domain_id':data.domain_id,'user_name':data.user_name}]);
		}
		let checkDomain = await projectDao.checkDomain(data);
		if(checkDomain==null){
			await globalStatusDao.insertGlobalConfigStatus(arrayData)
			await globalPriorityDao.insertDefaultPriority(priorityData);
			await globalEnvironmentDao.insertDefaultEnvironment(environmentData);
			await globalComponentDao.insertDefaultComponent(componentData);
		}
		let projectDetails = await projectDao.checkProjectExist(data);
		if(projectDetails == null) {
			let project = await projectDao.addProject(data);
			statusDomainDetails =await globalStatusDao.statusDomainDetails(data)
			let statusObj={}
			let statusArray=[]
			if(statusDomainDetails){
				statusDomainDetails.forEach(function (element) {
					statusObj.project_id=data.project_id;
					statusObj.domain_id=element.domain_id;
					statusObj.sc_name=element.sc_name;
					statusObj.sc_description=element.sc_description;
					statusObj.sc_color=element.sc_color;
					statusObj.sc_type=element.sc_type;
					statusObj.sc_status=element.sc_status;
					statusObj.is_active=element.is_active;
					statusObj.updated_by=data.acct_id;
					statusObj.created_by=data.acct_id;
					statusArray.push(statusObj)
					statusObj={}
				});
				await statusDao.insertConfigStatus(statusArray);
			}
			let priorityObj={}
			let priorityArray=[]
			priorityDaoDomainDetails =	await globalPriorityDao.priorityDaoDomainDetails(data);
			if(priorityDaoDomainDetails){
				priorityDaoDomainDetails.forEach(function (element) {
					priorityObj.project_id=data.project_id;
					priorityObj.domain_id=element.domain_id;
					priorityObj.pc_name=element.pc_name;
					priorityObj.priority_label=element.priority_label;
					priorityObj.priority_type=element.priority_type;
					priorityObj.priority_color=element.priority_color;
					priorityObj.is_active=element.is_active;
					priorityObj.updated_by=data.acct_id;
					priorityObj.created_by=data.acct_id;
					priorityArray.push(priorityObj)
					priorityObj={}
				});
				await priorityDao.insertDefaultPriority(priorityArray);
			}
			let environmentObj={}
			let environmentArray=[]
			environmentDomainDetails=	await globalEnvironmentDao.environmentDomainDetails(data);
			if(environmentDomainDetails){
				environmentDomainDetails.forEach(function (element) {
					environmentObj.project_id=data.project_id;
					environmentObj.domain_id=element.domain_id;
					environmentObj.ec_name=element.ec_name;
					environmentObj.ec_description=element.ec_description;
					environmentObj.is_active=element.is_active;
					environmentObj.updated_by=data.acct_id;
					environmentObj.created_by=data.acct_id;
					environmentArray.push(environmentObj)
					environmentObj={}
				});
				await environmentDao.insertEnvironment(environmentArray);
			}
			let componentObj={}
			let componentArray=[]
			componentDomainDetails = await globalComponentDao.componentDomainDetails(data);
			if(componentDomainDetails){
				componentDomainDetails.forEach(function (element) {
					componentObj.project_id=data.project_id;
					componentObj.domain_id=element.domain_id;
					componentObj.cp_name=element.cp_name;
					componentObj.cp_description=element.cp_description;
					componentObj.cp_color=element.cp_color;
					componentObj.cp_type=element.cp_type;
					componentObj.is_active=element.is_active;
					componentObj.updated_by=data.acct_id;
					componentObj.created_by=data.acct_id;
					componentArray.push(componentObj)
					componentObj={}
				});
				await componentDao.insertComponent(componentArray);
			}

			let labelObj={}
			let labelArray=[]
			labelDomainDetails = await globalLabelConfigDao.labelDomainDetails(data);
			if(labelDomainDetails.length){
				labelDomainDetails.forEach(function (element) {
					labelObj.project_id=data.project_id;
					labelObj.domain_id=element.domain_id;
					labelObj.lc_name=element.lc_name;
					labelObj.is_active=element.is_active;
					labelObj.updated_by=data.acct_id;
					labelObj.created_by=data.acct_id;
					labelArray.push(labelObj)
					labelObj={}
				});
				await labelConfigDao.insertLabels(labelArray);
			}

			let datasetObj={}
			let datasetArray=[]
			datasetDomainDetails = await globalDatasetConfigDao.datasetDomainDetails(data);
			if(datasetDomainDetails.length){
				datasetDomainDetails.forEach(function (element) {
					datasetObj.project_id=data.project_id;
					datasetObj.domain_id=element.domain_id;
					datasetObj.dc_name=element.dc_name;
					datasetObj.is_active=element.is_active;
					datasetObj.updated_by=data.acct_id;
					datasetObj.created_by=data.acct_id;
					datasetArray.push(datasetObj)
					datasetObj={}
				});
				await datasetConfigDao.insertDatasets(datasetArray);
			}

			let customObj={}
			let customArray=[]
			customDomainDetails = await globalCustomFieldConfigDao.customDomainDetails(data);
			if(customDomainDetails.length){
				customDomainDetails.forEach(function (element) {
					customObj.project_id=data.project_id;
					customObj.domain_id=element.domain_id;
					customObj.cfc_name=element.cfc_name;
					customObj.cfc_field_type=element.cfc_field_type;
					customObj.cfc_required_flag=element.cfc_required_flag;
					customObj.cfc_status=element.cfc_status;
					customObj.cfc_type=element.cfc_type;
					customObj.cfc_options=element.cfc_options;
					customObj.is_active=element.is_active;
					customObj.updated_by=data.acct_id;
					customObj.created_by=data.acct_id;
					customArray.push(customObj)
					customObj={}
				});
				await customFieldConfigDao.insertCustoms(customArray);
			}

			let roleObj={}
			let roleArray=[]
			roleDomainDetails = await globalRoleDao.domainRoleList(data);
			console.log("roleDomainDetails===>",roleDomainDetails);
			if(roleDomainDetails.length){
				roleDomainDetails.forEach(function (element) {
					roleObj.project_id=data.project_id;
					roleObj.domain_id=element.domain_id;
					roleObj.role_name= element.role_name;
					roleObj.allow_testcase_create= element.allow_testcase_create 
					roleObj.allow_testcase_read= element.allow_testcase_read 
					roleObj.allow_testcase_edit= element.allow_testcase_edit
					roleObj.allow_testcase_delete= element.allow_testcase_delete
					roleObj.allow_testcase_archive= element.allow_testcase_archive 
					roleObj.allow_testcase_versions= element.allow_testcase_versions 
					roleObj.allow_testcase_folders= element.allow_testcase_folders
					roleObj.testcase_lock= element.testcase_lock
					roleObj.allow_testplan_create= element.allow_testplan_create
					roleObj.allow_testplan_edit= element.allow_testplan_edit
					roleObj.allow_testplan_view= element.allow_testplan_view 
					roleObj.allow_testplan_delete= element.allow_testplan_delete 
					roleObj.allow_testplan_folders= element.allow_testplan_folders 
					roleObj.allow_testcycle_create= element.allow_testcycle_create 
					roleObj.allow_testcycle_edit= element.allow_testcycle_edit 
					roleObj.allow_testcycle_view= element.allow_testcycle_view 
					roleObj.allow_testcycle_execute= element.allow_testcycle_execute
					roleObj.allow_testcycle_delete= element.allow_testcycle_delete 
					roleObj.allow_testcycle_folders= element.allow_testcycle_folders 
					roleObj.allow_reports_create= element.allow_reports_create 
					roleObj.allow_configuration= element.allow_configuration 
					roleObj.is_active = element.is_active;
					roleObj.updated_by=data.acct_id;
					roleObj.created_by=data.acct_id;
					roleArray.push(roleObj)
					roleObj={}
				});
				await roleDao.insertRolesAppSetup(roleArray);
			}

			let groupObj={}
			let groupArray=[]
			groupDomainDetails = await globalGroupDao.domainGroupsList(data);
			console.log("groupDomainDetails===>",groupDomainDetails);
			if(groupDomainDetails.length){
				groupDomainDetails.forEach(function (element) {
					groupObj.project_id=data.project_id;
					groupObj.domain_id=element.domain_id;
					groupObj.group_name= element.group_name
					groupObj.role_id= element.role_id
					groupObj.is_active=element.is_active;
					groupObj.updated_by=data.acct_id;
					groupObj.created_by=data.acct_id;
					groupArray.push(groupObj)
					groupObj={}
				});
				await groupDao.insertGroupsAppSetup(groupArray);
			}
			await testcycleDao.testCycleKeyDetails(cycleKey);
			await testplanDao.testPlanKeyDetails(planKey);
			// let userRoleObj={}
			// let userRoleArray=[]
			// roleDomainDetails = await globalUserRoleDao.domainUserRoleList(data);
			// if(groupDomainDetails.length){
			// 	groupDomainDetails.forEach(function (element) {
			// 		userRoleObj.project_id=data.project_id;
			// 		userRoleObj.domain_id=element.domain_id;
			// 		userRoleObj.role_id = element.role_id
			// 		userRoleObj.user_name = element.user_name
			// 		userRoleObj.jira_acct_id = element.jira_acct_id
			// 		userRoleObj.is_active=element.is_active;
			// 		userRoleObj.updated_by=data.acct_id;
			// 		userRoleObj.created_by=data.acct_id;
			// 		userRoleArray.push(userRoleObj)
			// 		userRoleObj={}
			// 	});
			// 	await userGroupDao.insertGroupsAppSetup(userRoleArray);
			// }

			// let userGroupObj={}
			// let userGroupArray=[]
			// groupDomainDetails = await globalUserGroupDao.domainGroupsList(data);
			// if(groupDomainDetails.length){
			// 	groupDomainDetails.forEach(function (element) {
			// 		userGroupObj.project_id=data.project_id;
			// 		userGroupObj.domain_id=element.domain_id;
			// 		userGroupObj.group_id = element.group_id
			// 		userGroupObj.user_name = element.user_name
			// 		userGroupObj.jira_acct_id = element.jira_acct_id
			// 		userGroupObj.is_active=element.is_active;
			// 		userGroupObj.updated_by=data.acct_id;
			// 		userGroupObj.created_by=data.acct_id;
			// 		userGroupArray.push(userGroupObj)
			// 		userGroupObj={}
			// 	});
			// 	await userGroupDao.insertGroupsAppSetup(userGroupArray);
			// }		

			if(project) {
				return {'rescode': 200, 'msg': message.PROJECT_ADDED, 'data':project};
			} else {
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
			}
		} else {
			return {'rescode': 401, 'msg': message.PROJECT_EXIST, 'data': {}}
		}
	},
	deleteProject: async data => {
		let records = await projectDao.deleteProject(data);
		if(records) {
			return  {'rescode': 200, 'msg': message.PROJECT_DELETED, 'data':{records}};
		} else {
			return {'rescode': 401, 'msg': message.ID_NOT_FOUND, 'data': {}}
		}
	},
	updateProject: async data => {
		let project = await projectDao.updateProject(data);
		if(project) {
			return {'rescode': 200, 'msg': message.PROJECT_UPDATED, 'data':project};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}
	},
	getProject: async data => {
		let project = await projectDao.getProject(data);
		if(project) {
			return {'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data':project};
		} else {
			return {'rescode': 401, 'msg': message.ID_NOT_FOUND, 'data': {}};
		}
	},
	listProjects: async() => {
		let projects = await projectDao.listProjects();
		if(projects.length){
			return {'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data':projects};
		} else {
			return {'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': {}}
		}
	},
	getProjectById: async data => {
		const { project_id, acct_id,domain_id } = data; 
		let project = await projectDao.getProjectData(data);
		//check project exist
		if(project[0]) {
			let userRoleAccess = await checkUserAccess(data);
			if(userRoleAccess.data){
				project[0].userRole = userRoleAccess.data
			} else {
				project[0].userRole = []
			}
		   return {'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data':project[0]};
		} else {
			return {'rescode': 401, 'msg': message.ID_NOT_FOUND, 'data': {}};
		}
	},
	getProjectByIdUser: async data => {
		const { acct_id } = data; 
		let project = await projectDao.getProject(data);
		
		//check project exist
		//if exist get roles from user and group and return roles with project
		//else return error response
		if(project) {
			let userRoleList = await userRoleDao.userRoleList(acct_id);
			if(!userRoleList.length){
				userRoleList=[]
			}
			let groupRoleList = await userGroupDao.userGroupRoleList(acct_id);
			if(!groupRoleList.length){
				groupRoleList=[]
			}
			const roles = [...userRoleList, ...groupRoleList].reduce((unique, o) => {
				if(!unique.some(obj => obj.id === o.id)) {
				  unique.push(o);
				}
				return unique;
			},[]);
			project.roles = roles;
			let userRoleAccess = await checkUserAccess(data);
			if(userRoleAccess.data){
				project.userRole = userRoleAccess.data
			} else {
				project.userRole = []
			}
		   return {'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data':project};
		} else {
			return {'rescode': 401, 'msg': message.ID_NOT_FOUND, 'data': {}};
		}
	},

	regionList: async() => {
		let regionLists = await projectDao.regionList();
		if(regionLists.length){
			return {'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data':regionLists};
		} else {
			return {'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': {}}
		}
	},
}

module.exports = {projectService};