const customFieldConfigDao = require('../dao/global_custom_field.dao').customFieldConfigDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const customFieldConfigService = {
	addCustomFieldConfig: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await customFieldConfigDao.getSameCf(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.CF_EXIST, 'data': {}}
		} else {
			let customField = await customFieldConfigDao.addCustomFieldConfig(data);
			if(customField) 
				return {'rescode': 200, 'msg': message.DATA_ADDED, 'data':{customField}};		
			else
				return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}
		}	
	},
	editCustomFieldConfig: async data => {
		data['updated_by'] = data.acct_id
		let checkName = await customFieldConfigDao.cfNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.CF_EXIST, 'data': {}}
		} else {
			let customField = await customFieldConfigDao.editCustomFieldConfig(data);

			if(customField) 
				return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':customField};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		}	
	},
	getCustomFieldgById: async data => {
		let customField = await customFieldConfigDao.getCustomFieldgById(data);
		if(customField) {
			return {'rescode': 200, 'msg': message.DATA_FETCHED, 'data':{customField}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	getAllCustomFieldList: async(data) => {
		let customField = await customFieldConfigDao.getAllCustomFieldList(data);
		if(customField) 
			return {'rescode': 200, 'msg': message.DATA_FETCHED, 'data':{customField}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
    },
	deleteCustomFieldConfig: async data => {
		let customField = await customFieldConfigDao.deleteCustomFieldConfig(data);
		if(customField) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':{customField}};		
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
}

module.exports = { customFieldConfigService }