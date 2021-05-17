const userDao = require('../dao/user.dao').userDetails;
const message = require('../utils/message');

const userService = {
	addUserRole: async data => {		
		var promiseall = [];
		data.roles = data.roles.map( role => {
			let userIds = [...role.users];
			let insertData = userIds.map(user => {
				let obj = {};
				obj['acct_id'] = user.acct_id;
				obj['role_id'] = role.role_id;
				return obj;
			})
			promiseall.push(userDao.insertUserAccess(insertData));
			return role;
		})

		var result = await Promise.all(promiseall);
		console.log("Result "+JSON.stringify(result));
		if(result.length)
			return {'rescode': 200, 'msg': message.USER_ACCESS_UPDATED, 'data':{}};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
	},

	getUserAccess: async data => {
		let user = await userDao.getUserAccess(data);
		console.log(JSON.stringify(user));
		if(user.length == 0) {
			let addUser = await userDao.insertUserAccess([{'acct_id': data.acct_id, 'role_id': 1}]);
			console.log("Add User = "+JSON.stringify(addUser));
			if(addUser.length)
				return {'rescode': 200, 'msg': message.USER_ACCESS_FETCHED, 'data': addUser[0]};
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		} else {
			return {'rescode': 200, 'msg': message.USER_ACCESS_FETCHED, 'data': user};
		}
	},

	addUserGroup: async data => {		
		var promiseall = [];
		data.groups = data.groups.map( group => {
			let userIds = [...group.users];
			let insertData = userIds.map(user => {
				let obj = {};
				obj['acct_id'] = user.acct_id;
				obj['group_id'] = group.group_id;
				return obj;
			})
			promiseall.push(userDao.insertUserAccess(insertData));
			return group;
		})

		var result = await Promise.all(promiseall);
		console.log("Result "+JSON.stringify(result));
		if(result.length)
			return {'rescode': 200, 'msg': message.USER_ACCESS_UPDATED, 'data':{}};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
	},
}

module.exports = {userService};