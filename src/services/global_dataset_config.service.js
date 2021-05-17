const datasetConfigDao = require('../dao/global_dataset_config.dao').datasetConfigDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const datasetConfigService = {
	addDatasetConfig: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await datasetConfigDao.getSameDataset(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let dataset = await datasetConfigDao.addDatasetConfig(data);
			if(dataset) 
				return {'rescode': 200, 'msg': message.DATASET_ADDED, 'data':{dataset}};		
			else
				return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}
		}		
    },
	getDatasetConfigById: async data => {
		let dataset = await datasetConfigDao.getDatasetConfigById(data);
		if(dataset) {
			return {'rescode': 200, 'msg': message.DATASET_DETAIL, 'data':{dataset}};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	getAllDatasetList: async(data) => {
		let dataset = await datasetConfigDao.getAllDatasetList(data);
		if(dataset) 
			return {'rescode': 200, 'msg': message.DATASET_LIST_FETCHED, 'data':{dataset}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
	editDatasetConfig: async data => {
		data['updated_by'] = data.acct_id
		let checkName = await datasetConfigDao.datasetNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let dataset = await datasetConfigDao.editDatasetConfig(data);
			if(dataset) 
				return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':dataset};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}	
	},
	deleteDatasetConfig: async data => {
		let dataset = await datasetConfigDao.deleteDatasetConfig(data);
		if(dataset) 
			return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':{dataset}};		
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
	},
}

module.exports = { datasetConfigService }