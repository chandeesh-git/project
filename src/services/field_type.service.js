const fieldTypeDao = require('../dao/field_type.dao').fieldTypeDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const fieldTypeService = {
    getFieldTypeById: async data => {
		let fieldType = await fieldTypeDao.getFieldTypeById(data);
		if(fieldType) {
			return {'rescode': 200, 'msg': message.FIELD_TYPE_DETAIL, 'data':{fieldType}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	allFieldTypeList: async(data) => {
		let fieldType = await fieldTypeDao.allFieldTypeList(data);
		if(fieldType) 
			return {'rescode': 200, 'msg': message.FIELD_TYPE_DETAIL, 'data':{fieldType}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
    },
}

module.exports = {fieldTypeService}