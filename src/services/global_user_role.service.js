const userRoleDao = require('../dao/global_user_role.dao').userRoleDetails;
// const roleDao = require('../dao/global_role.dao').userRoleDetails;
const message = require('../utils/message');
 
const userRoleService = {
    createUserRole: async(data) => {
		data['created_by'] = data.acct_id;
		data['jira_acct_id'] = data.user_id;
		delete data.acct_id
		delete data.user_id;
		let userRoleData = await userRoleDao.addUserRole(data);
		if(userRoleData) 
			return {'rescode': 200, 'msg': message.ROLE_ADDED, 'data':userRoleData};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	editUserRole: async data => {

		data['updated_by'] = data.acct_id
		let result = await userRoleDao.updateUserRole(data);

		if(result) 
			return {'rescode': 200, 'msg': message.ROLE_UPDATED, 'data':result};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}		
	},
	deleteUserRole: async data => {
		let role = await userRoleDao.deleteUserRole(data);
		if(role) 
			return {'rescode': 200, 'msg': message.USER_ROLE_DELETED, 'data':role};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	listUserRole: async(data) => {
		let responseData = {}
		let userRoles = await userRoleDao.fetchRoleId(data);
		if(userRoles[0] != null) {
			const role_ids = userRoles[0].id
			let userRecords = await userRoleDao.fetchUserListActive(role_ids);
			let groupRecords = await userRoleDao.fetchGroupDetailsActive(role_ids);
			responseData.userData=userRecords;
			responseData.groupData=groupRecords;
			return {'rescode': 200, 'msg': message.ROLE_LIST_FETCHED, 'data':responseData};
		} else {
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		}
	},
	// userRoleListAll: async(data) => {
	// 	let responseData = {}
	// 	let userRoles = await userRoleDao.fetchRoleId(data);
	// 	if(userRoles[0] != null) {
	// 		const role_ids = userRoles[0].id
	// 		let userRecords = await userRoleDao.fetchUserList(role_ids);
	// 		let groupRecords = await userRoleDao.fetchGroupDetails(role_ids);
	// 		responseData.userData=userRecords;
	// 		responseData.groupData=groupRecords;
	// 		return {'rescode': 200, 'msg': message.ROLE_LIST_FETCHED, 'data':responseData};
	// 	} else {
	// 		return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	// 	}
	// }
}

module.exports = { userRoleService };