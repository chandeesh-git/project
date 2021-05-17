const envConfigDao = require('../dao/environment_config.dao').envConfigDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const envConfigService = {
	addEnvConfig: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await envConfigDao.getSameEnv(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST_WITH_PROJECT, 'data': {}}
		} else {
			let environment = await envConfigDao.addEnvConfig(data);
			if(environment) 
				return {'rescode': 200, 'msg': message.ENV_ADDED, 'data':{environment}};		
			else
				return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}
		}		
    },
	getEnvConfigById: async data => {
		let environment = await envConfigDao.getEnvConfigById(data);
		if(environment) {
			return {'rescode': 200, 'msg': message.ENV_DETAIL, 'data':{environment}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	getAllEnvList: async(data) => {
		let environment = await envConfigDao.getAllEnvList(data);
		if(environment) 
			return {'rescode': 200, 'msg': message.ENV_LIST_FETCHED, 'data':{environment}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},

	editEnvConfig: async data => {
		data['updated_by'] = data.acct_id
		let checkName = await envConfigDao.envNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST_WITH_PROJECT, 'data': {}}
		} else {
			let environment = await envConfigDao.editEnvConfig(data);
			if(environment) 
				return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':environment};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}
	},

	deleteEnvConfig: async data => {
		let environment = await envConfigDao.deleteEnvConfig(data);
		if(environment) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':{environment}};		
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
}

module.exports = { envConfigService }