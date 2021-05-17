const globalEnvConfigDao = require('../dao/global_environment_config.dao').globalEnvConfigDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const globalEnvService = {
	addGlobalEnvConfig: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await globalEnvConfigDao.getSameEnv(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let globalEnv = await globalEnvConfigDao.addGlobalEnvConfig(data);
			if(globalEnv) 
				return {'rescode': 200, 'msg': message.ENV_ADDED, 'data':{globalEnv}};		
			else
				return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}
		}		
    },
	globalEnvConfigId: async data => {
		let globalEnv = await globalEnvConfigDao.globalEnvConfigId(data);
		if(globalEnv) {
			return {'rescode': 200, 'msg': message.ENV_DETAIL, 'data':{globalEnv}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	allGlobalEnvList: async(data) => {
		let globalEnv = await globalEnvConfigDao.allGlobalEnvList(data);
		if(globalEnv) 
			return {'rescode': 200, 'msg': message.ENV_LIST_FETCHED, 'data':{globalEnv}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},

	editGlobalEnvConfig: async data => {
		data['updated_by'] = data.acct_id
		let checkName = await globalEnvConfigDao.envNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let globalEnv = await globalEnvConfigDao.editGlobalEnvConfig(data);
			if(globalEnv) 
				return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':globalEnv};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}			
		}
	},

	deleteGlobalEnvConfig: async data => {
		let globalEnv = await globalEnvConfigDao.deleteGlobalEnvConfig(data);
		if(globalEnv) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':{globalEnv}};		
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
}

module.exports = { globalEnvService }