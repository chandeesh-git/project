const roleDao = require('../dao/role.dao').roleDetails;
const groupDao = require('../dao/group.dao').groupDetails;
const userDao = require('../dao/user.dao').userDetails;
const message = require('../utils/message');

const roleService = {
	addRole: async data => {
		data['is_active'] = true;
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await roleDao.getSameRole(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.ROLE_EXIST_IN_PROJECT, 'data': {}}
		} else {
			let role = await roleDao.addRole(data);
			if(role) 
				return {'rescode': 200, 'msg': message.ROLE_ADDED, 'data':role};		
			else
				return {'rescode': 401, 'msg': message.INVALID_PROJECT_DETAILS, 'data': {}}
		}	
	},
	updateUserRole: async data => {
		var promiseAll = [];
		data.roleUpdate = JSON.parse(data.roleUpdate);

		data.roleUpdate = data.roleUpdate.map( async role => {
			role['updated_by'] = data.acct_id;
			promiseAll.push(roleDao.updateRole(role));
			return role;
		})

		var result = await Promise.all(promiseAll);
		if(result.length) 
			return {'rescode': 200, 'msg': message.ROLE_UPDATED, 'data':result};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}		
	},
	deleteUserRole: async data => {
		let role = await roleDao.removeRole(data);
		if(role) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':role};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	userRoleList: async(data) => {
		let roles = await roleDao.roleList(data);
		if(roles) {
			for (const element of roles) {
				element.delete_flag=0
			   	if(element.group_name!=null){
				 element.delete_flag=1
			  	 }
			   	if(element.user_name!=null){
				 element.delete_flag=1
			   	}
			   	if(element.rbac_setting==1){
				 element.delete_flag=1
			   	}
			   
			 }
			return {'rescode': 200, 'msg': message.ROLE_LIST_FETCHED, 'data':roles};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		}	
	},
	usersListWithRole: async() => {
		let roles = await roleDao.roleUsersList();
		if(roles) 
			return {'rescode': 200, 'msg': message.ROLE_LIST_WITH_USER_FETCHED, 'data':roles};
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
	},
	assignRole: async(data) => {
		var promiseall = [];
		let userIds = [...data.roles[0].users];
		let groupIds = [...data.roles[0].groups];
		userIds = userIds.map(user => {
			return user.acct_id;
		})
		groupIds = groupIds.map(group => {
			return group.id;
		})
		let [groupList, userList] = await Promise.all([groupDao.list(groupIds), userDao.list(userIds)]);
		let usersExist = userList.map( user => {
			return user.acct_id;
		})
		let newUsers = userIds.filter(acct_id => {
			if(usersExist.indexOf(acct_id) == -1) {
				return acct_id;
			}
		})
		console.log(newUsers);
		data.roles = data.roles.map( role => {
			let insertUserData = userList.map(user => {
				user.role_id = role.role_id;
				return user;
			})
			if(insertUserData.length) {
				promiseall.push(userDao.insertUserAccess(insertUserData));
			}
			let newUserData = newUsers.map(acct_id => {
				let obj = {};
				obj['acct_id'] = acct_id;
				obj['role_id'] = role.role_id
				return obj;
			})
			if(newUserData.length) {
				promiseall.push(userDao.insertUserAccess(newUserData));
			}
			let insertGroupData = groupList.map(group => {
				group.role_id = role.role_id;
				return group;
			})
			console.log("InsertGroupData = "+JSON.stringify(insertGroupData));
			if(insertGroupData) {
				promiseall.push(groupDao.insertGroupAccess(insertGroupData));
			}
			return role;
		})

		var result = await Promise.all(promiseall);
		console.log("Result "+JSON.stringify(result));
		if(result.length)
			return {'rescode': 200, 'msg': message.ACCESS_UPDATED, 'data':{}};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
	},
	getRoleById: async data => {
		let role = await roleDao.getRoleById(data);
		if(role) {
			return {'rescode': 200, 'msg': message.ROLE_DETAIL, 'data':role};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}};
		}
	},
}

module.exports = {roleService};