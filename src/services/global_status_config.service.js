const statusDao = require('../dao/global_status_config.dao').statusDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const statusService = {
	addTest: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await  statusDao.getSameStatus(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let addStatus = await statusDao.addTest(data);
			if(addStatus) 
				return {'rescode': 200, 'msg': message.STATUS_ADDED, 'data':addStatus};		
			else
				return {'rescode': 401, 'msg': message.INVALID_PROJECT_DETAILS, 'data': {}}
		}	
    },
    listStatus: async(data) => {
        let statusLists = await statusDao.getLists(data);
        if(statusLists){
			return {'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data':statusLists};
		} else {
			return {'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': {}}
		}
    },
    updateConfigStatus: async data => {
		let checkName = await statusDao.statusNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let updateStatus = await statusDao.updateConfigStatus(data);
			if(updateStatus) 
				return {'rescode': 200, 'msg': message.STATUS_UPDATED, 'data':updateStatus};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}	
    },
    
    deleteConfigStatus: async data => {
		let deleteStatus = await statusDao.removeConfigStatus(data);
        if(deleteStatus){
            return {'rescode': 200, 'msg': message.DATA_DELETED, 'data':null};
        }else{
            return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
        }		
	},

	getStatusById: async data => {
		let StatusById = await statusDao.getStatusById(data);
		if(StatusById) {
			return {'rescode': 200, 'msg': message.DATA_FETCHED, 'data':StatusById};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	
}

module.exports = {statusService};