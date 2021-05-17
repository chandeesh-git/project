const roleDao = require('../dao/global_role.dao').roleDetails;
// const groupDao = require('../dao/group.dao').groupDetails;
// const userDao = require('../dao/user.dao').userDetails;
const message = require('../utils/message');

const roleService = {
	addRole: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await roleDao.getSameRole(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.ROLE_EXIST, 'data': {}}
		} else {
			let role = await roleDao.addRole(data);
			if(role) 
				return {'rescode': 200, 'msg': message.ROLE_ADDED, 'data':role};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
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
		let role = await roleDao.softDeleteRole(data);
		if(role) 
			return {'rescode': 200, 'msg': message.ROLE_INACTIVATED, 'data':role};		
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