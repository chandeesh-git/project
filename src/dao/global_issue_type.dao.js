'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const issueTypeDetails = {
    //add global issue type
    addIssueType: async data => {
        return sql_conn.globalIssueTypeModel.create(data).catch(console.error);
    },
    //get global issue type by ID
    getIssueTypeById: async data => {
		return sql_conn.globalIssueTypeModel.findOne({
			where: {
                'domain_id':data.domain_id
            }
		}).catch(console.error);
    },
    //update global issue type
    editIssueType: async data => {
        return sql_conn.globalIssueTypeModel.update(data,{
            where:{
                'domain_id':data.domain_id
            }
        }).catch(console.error);
    },
    //get all list
    getList: async data => {
        return sql_conn.globalIssueTypeModel.findOne({
            where: Sequelize.and(
                {'domain_id':data.domain_id},
                {'is_active':true}
            )
        }).catch(console.error);
    },
}

module.exports = { issueTypeDetails }