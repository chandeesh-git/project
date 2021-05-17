const globalPriorityConfigDao = require('../dao/global_priority_config.dao').priorityConfigDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const priorityConfigService = {
	addPriorityConfig: async data => {
		data['is_active'] = true;
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await globalPriorityConfigDao.getSamePriority(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': error_message.NAME_EXIST, 'data': {}}
		} else {
			let priority = await globalPriorityConfigDao.addPriorityConfig(data);
			if(priority) 
				return {'rescode': 200, 'msg': message.DATA_ADDED, 'data':{priority}};		
			else
				return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}
		}		
    },
	getPriorityConfigById: async data => {
		let priority = await globalPriorityConfigDao.getPriorityConfigById(data);
		if(priority) {
			return {'rescode': 200, 'msg': message.DATA_FETCHED, 'data':{priority}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	getAllPriorityList: async(data) => {
		let priority = await globalPriorityConfigDao.getAllPriorityList(data);
		if(priority) 
			return {'rescode': 200, 'msg': message.ALL_LIST_FETCHED, 'data':{priority}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
	editPriorityConfig: async data => {
		data['updated_by'] = data.acct_id
		let checkName = await globalPriorityConfigDao.priorityNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let priority = await globalPriorityConfigDao.editPriorityConfig(data);
			if(priority) 
				return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':priority};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		}	
	},
	deletePriorityConfig: async data => {
		let priority = await globalPriorityConfigDao.deletePriorityConfig(data);
		if(priority) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':{priority}};		
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
}

module.exports = { priorityConfigService }