const priorityConfigDao = require('../dao/priority_config.dao').priorityConfigDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const priorityConfigService = {
	addPriorityConfig: async data => {
		data['is_active'] = true;
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await priorityConfigDao.getSamePriority(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST_WITH_PROJECT, 'data': {}}
		} else {
			let priority = await priorityConfigDao.addPriorityConfig(data);
			if(priority) 
				return {'rescode': 200, 'msg': message.DATA_ADDED, 'data':{priority}};		
			else
				return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}
		}		
    },
	getPriorityConfigById: async data => {
		let priority = await priorityConfigDao.getPriorityConfigById(data);
		if(priority) {
			return {'rescode': 200, 'msg': message.DATA_FETCHED, 'data':{priority}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	getAllPriorityList: async(data) => {
		let priority = await priorityConfigDao.getAllPriorityList(data);
		if(priority) 
			return {'rescode': 200, 'msg': message.ALL_LIST_FETCHED, 'data':{priority}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
	editPriorityConfig: async data => {
		data['updated_by'] = data.acct_id
		let checkName = await priorityConfigDao.priorityNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST_WITH_PROJECT, 'data': {}}	
		} else {
			let priority = await priorityConfigDao.editPriorityConfig(data);
			if(priority) 
				return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':priority};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}	
	},
	deletePriorityConfig: async data => {
		let priority = await priorityConfigDao.deletePriorityConfig(data);
		if(priority) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':{priority}};		
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
}

module.exports = { priorityConfigService }