const customFilterDao = require('../dao/custom_filter.dao').customFilterDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const customFilterService = {
	createFilter: async data => {
		let createFilter = await customFilterDao.createFilter(data);
		if (createFilter) {
			return { 'rescode': 200, 'msg': message.CUSTOM_FILTER_ADD, 'data': createFilter };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} };
		}
	},
	updateFilter: async data => {
		let filterUpdate = await customFilterDao.updateFilter(data);
		if (filterUpdate) {
			return { 'rescode': 200, 'msg': message.CUSTOM_FILTER_ADD, 'data': filterUpdate };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} };
		}
	},

	lisFilter: async data => {
		let useFilterList = await customFilterDao.userListFilter(data);
		let allFilterList = await customFilterDao.allListFilter(data);
		let combineArray = [...useFilterList, ...allFilterList]
		const key = 'id';
		const arrayUniqueByKey = [...new Map(combineArray.map(item =>
			[item[key], item])).values()];
		if (arrayUniqueByKey) {
			return { 'rescode': 200, 'msg': message.FILTER_LIST, 'data': arrayUniqueByKey };
		} else {
			return { 'rescode': 200, 'msg': message.FILTER_LIST, 'data': [] };
		}
	},
	detailFilter: async data => {
		let detailFilter = await customFilterDao.detailFilter(data);
		if (detailFilter) {
			return { 'rescode': 200, 'msg': message.FILTER_LIST, 'data': detailFilter };
		} else {
			return { 'rescode': 200, 'msg': message.FILTER_LIST, 'data': [] };
		}
	},
	deleteFilter: async data => {
		let deleteFilter = await customFilterDao.deleteFilter(data);
		return { 'rescode': 200, 'msg': message.FILTER_DELETE, 'data': null };
	},
}

module.exports = { customFilterService }