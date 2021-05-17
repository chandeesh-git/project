const groupDao = require('../dao/group.dao').groupDetails;
const message = require('../utils/message');

const groupService = {
	addGroup: async data => {
		data['is_active'] = true;
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await groupDao.getSameGroup(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.GROUP_EXIST_IN_PROJECT, 'data': {}}
		} else {
			let group = await groupDao.addGroup(data);
			if(group) 
				return {'rescode': 200, 'msg': message.GROUP_ADDED, 'data':group};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}	
	},
	updateGroup: async data => {
		let group = await groupDao.updateGroup(data);
		if(group) 
			return {'rescode': 200, 'msg': message.GROUP_UPDATED, 'data':group};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}		
	},
	updateGroupsRole: async data => {
		let group = await groupDao.updateGroupsRole(data);
		if(group) 
			return {'rescode': 200, 'msg': message.GROUP_ROLE_UPDATED, 'data':group};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}		
	},
	deleteGroup: async data => {
		let group = await groupDao.deleteGroup(data);
		if(group) 
			return {'rescode': 200, 'msg': message.GROUP_DELETED, 'data':{}};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	activeGroupList: async(data) => {
		let groups = await groupDao.activeGroupList(data);
		if(groups) {
			for (const element of groups) {
				element.delete_flag=0
			   	if(element.user_name!=null){
				 element.delete_flag=1
			  	 }
			   	if(element.rbac_setting==1){
				 element.delete_flag=1
			   	}
			   
			}
			return {'rescode': 200, 'msg': message.GROUP_LIST_FETCHED, 'data':groups};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		}
	},
	allGroupList: async(data) => {
		let groups = await groupDao.allGroupList(data);
		if(groups) 
			return {'rescode': 200, 'msg': message.GROUP_LIST_FETCHED, 'data':groups};
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	groupListWithUsers: async() => {
		let groups = await groupDao.groupListWithUser();
		if(groups) 
			return {'rescode': 200, 'msg': message.GROUP_LIST_WITH_USER_FETCHED, 'data':groups};
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	groupListWithoutRole: async(data) => {
		let groups = await groupDao.groupListWithoutRole(data);
		if(groups) 
			return {'rescode': 200, 'msg': message.GROUP_LIST_FETCHED, 'data':groups};
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	getGroupById: async data => {
		let group = await groupDao.getGroupById(data);
		if(group) {
			return {'rescode': 200, 'msg': message.GROUP_DETAIL, 'data':group};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}};
		}
	},
}

module.exports = {groupService};