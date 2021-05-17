const componentDao = require('../dao/global_component_config.dao').componentDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');

const componentService = {
	createComponent: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let checkName = await  componentDao.getSameComponent(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let componentData = await  componentDao.createComponent(data);
			if(componentData ) 
				return {'rescode': 200, 'msg': message.COMPONENT_ADDED, 'data':componentData };		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		}	
    },
    componentLists: async(data) => {
        let componentList = await  componentDao.componentLists(data);
        if(componentList){
			return {'rescode': 200, 'msg': message.COMPONENT_LIST_FETCHED, 'data':componentList};
		} else {
			return {'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': {}}
		}
    },
    updateComponent: async data => {
		let checkName = await componentDao.compNameDetailsWhileUpdate(data);
		if(checkName.length>0){
			return {'rescode': 401, 'msg': message.NAME_EXIST, 'data': {}}
		} else {
			let compData = await  componentDao.updateComponent(data);
			if(compData) 
				return {'rescode': 200, 'msg': message.COMPONENT_UPDATED, 'data':compData};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		}	
    },
    
    deleteComponent: async data => {
		let deleteComp = await  componentDao.deleteComponent(data);
        if(deleteComp) 
            return {'rescode': 200, 'msg': message.COMPONENT_DELETED, 'data':null};
        else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}			
	},

	getComponentById: async data => {
		let compById = await  componentDao.getComponentById(data);
		if(compById) {
			return {'rescode': 200, 'msg': message.COMPONENT_DETAIL, 'data':compById};
		} else {
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}};
		}
    },
	
}

module.exports = {componentService};