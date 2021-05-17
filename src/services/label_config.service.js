const labelConfigDao = require('../dao/label_config.dao').labelConfigDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const labelConfigService = {
	addLabelConfig: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await labelConfigDao.getSameLabel(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST_WITH_PROJECT, 'data': {}}
		} else {
			let label = await labelConfigDao.addLabelConfig(data);
			if(label) 
				return {'rescode': 200, 'msg': message.LABEL_ADDED, 'data':{label}};		
			else
				return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}
		}	
    },
	getLabelConfigById: async data => {
		let label = await labelConfigDao.getLabelConfigById(data);
		if(label) {
			return {'rescode': 200, 'msg': message.LABEL_DETAIL, 'data':{label}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	getAllLabelList: async(data) => {
		let label = await labelConfigDao.getAllLabelList(data);
		if(label) 
			return {'rescode': 200, 'msg': message.LABEL_LIST_FETCHED, 'data':{label}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
    },
	deleteLabelConfig: async data => {
		let label = await labelConfigDao.deleteLabelConfig(data);
		if(label) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':{label}};		
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
}

module.exports = { labelConfigService }