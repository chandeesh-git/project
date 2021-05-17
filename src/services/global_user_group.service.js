const userGroupDao = require('../dao/global_user_group.dao').userGroupDatails;
const message = require('../utils/message');
 
const userGroupService = {
    addUsersToGroup: async(data) => {
		data['created_by'] = data.acct_id;
		data['jira_acct_id'] = data.user_id;
		delete data.acct_id;
		delete data.user_id;
		let userGroupData = await userGroupDao.addUsersToGroup(data);
		if(userGroupData) 
			return {'rescode': 200, 'msg': message.USER_ADDED_TO_GROUP, 'data':userGroupData};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	editUserGroup: async data => {
		data['updated_by'] = data.acct_id
		let result = await userGroupDao.editUserGroup(data);

		if(result) 
			return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':result};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}		
	},
	deleteUserGroup: async data => {
		let userGroup = await userGroupDao.deleteUserGroup(data);
		if(userGroup) 
			return {'rescode': 200, 'msg': message.USER_GROUP_DELETED, 'data':userGroup};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	userGroupActiveList: async(data) => {
		let userGroups = await userGroupDao.fetchGroupId(data);
		if(userGroups[0] != null) {
			const group_ids = userGroups[0].id
			let userRecords = await userGroupDao.fetchUserListActiveGroup(group_ids); 
			return {'rescode': 200, 'msg': message.ACTIVE_LIST_FETCHED, 'data':userRecords};
		} else {
			return {'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': {}}
		}	
	}
}

module.exports = { userGroupService };