const issueTypeDao = require('../dao/global_issue_type.dao').issueTypeDetails;
const message = require('../utils/message');

const issueTypeService = {
	addIssueType: async data => {
		data['created_by'] = data.acct_id;
		delete data.acct_id;
		let domainDetails = await issueTypeDao.getList(data);
		if(!domainDetails){
			let issueType = await issueTypeDao.addIssueType(data);
			if(issueType) 
				return {'rescode': 200, 'msg': message.DATA_ADDED, 'data':issueType};		
			else
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}	
		} else {
			return {'rescode': 401, 'msg': message.DOMAIN_EXIST, 'data': {}}
		}
	},
    editIssueType: async data => {
		let issueType = await issueTypeDao.editIssueType(data);
		if(issueType) 
			return {'rescode': 200, 'msg': message.DATA_UPDATED, 'data':issueType};		
		else
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}		
    },
    getIssueTypeById: async data => {
		let issueType = await issueTypeDao.getIssueTypeById(data);
		if(issueType) {
			return {'rescode': 200, 'msg': message.DATA_FETCHED, 'data': issueType};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}};
		}
	},
	getList: async(data) => {
		let issueType = await issueTypeDao.getList(data);
		if(issueType) 
			return {'rescode': 200, 'msg': message.ALL_LIST_FETCHED, 'data':{issueType}};
		else
			return {'rescode': 401, 'msg': error_message.DATA_NOT_FOUND, 'data': {}}	
    },
}

module.exports = {issueTypeService };