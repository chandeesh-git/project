const fieldTypeService = require('../services/field_type.service').fieldTypeService;
const {response} = require('../utils/utility');
const message = require('../utils/message');


/**
 * This function is used to get field type by id
 * @route GET /fieldType/id
 * @security JWT
 * @group FieldType
 * @param {integer} field_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.getFieldTypeById = async (req, res) => {
	try {
		let data = req.query;
		let result = await fieldTypeService.getFieldTypeById(data);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};

/**
 * This function is used to list field type
 * @route GET /fieldType/allList
 * @security JWT
 * @group FieldType
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.allFieldTypeList = async (req, res) => {
	try {
		let result = await fieldTypeService.allFieldTypeList(req.query);
		return response(res, result.rescode, result.msg, result.data);
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, {}, null)
	}
};