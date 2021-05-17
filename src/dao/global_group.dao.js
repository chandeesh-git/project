'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const groupDetails={
	addGroup: async data => {
        return sql_conn.globalGroupModel.create(data).catch(console.error);			
	},
	updateGroup: async data => {
		return sql_conn.globalGroupModel.update({
			'group_name':data.group_name,
			'is_active': data.is_active,
			'updated_by': data.acct_id
		},{
			where: {
				'id': data.group_id
			}
		}).catch(console.error);
	},
	updateGroupsRole: async data => {
		return sql_conn.globalGroupModel.update({
			'role_id':data.role_id,
			'updated_by': data.acct_id
		},{
			where: {
				'id': data.group_id
			}
		}).catch(console.error);
	},
	deleteGroup: async data => {
		return sql_conn.globalGroupModel.update({
            'is_active': false,
			'updated_by': data.acct_id
		},{
			where: {
				'id': data.group_id
			}
		}).catch(console.error);
	},
	
	activeGroupList: async(data) => {
		let result;
		const query = `SELECT GP.id,GP.group_name,GP.role_id,GP.is_active,GP.updated_by,GP.created_by,GP.domain_id,GP.is_active, URGP.user_name,
		CASE
		WHEN role_id is not null and role_id!=0 
		THEN '1'
		ELSE '0'
		END AS rbac_setting
		 FROM global_groups as GP 
		left join global_user_group as URGP on GP.id=URGP.group_id and URGP.is_active=1 
		where GP.is_active=1 and domain_id="${data.domain_id}"   group by GP.id`
		result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		console.log("get the query data****************",result)
		return result;
	  },
	
	getGroupById: async data => {
		return sql_conn.globalGroupModel.findOne({
			where: {
				'id': data.group_id,
			}
		})
	},
	domainGroupsList: async(data) => {
		let result;
		const query = `SELECT * FROM global_groups where domain_id ="${data.domain_id}" and is_active=1 `
		result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	getSameGroup: async(data) => {
        return sql_conn.globalGroupModel.findAll({
            where: Sequelize.and(
                {'group_name':data.group_name},
                {'domain_id': data.domain_id},
                {'is_active': true}
            )
        }).catch(console.error);
    }
}

module.exports = {groupDetails};

