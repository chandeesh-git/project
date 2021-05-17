'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const groupDetails={
	addGroup: async data => {
	    if(data.project_id){
			let projectData = await sql_conn.projectModel.findOne({
				where: Sequelize.and({
					'project_id':data.project_id
				},
				{'domain_id':data.domain_id})
			})
			if(projectData){
				return sql_conn.groupModel.create(data).catch(console.error);
			} else {
				console.log("details not found");
			}
		}		
	},
	updateGroup: async data => {
		return sql_conn.groupModel.update({
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
		return sql_conn.groupModel.update({
			'role_id':data.role_id,
			'updated_by': data.acct_id
		},{
			where: {
				'id': data.group_id
			}
		}).catch(console.error);
	},
	deleteGroup: async data => {
		return sql_conn.groupModel.destroy({
			where: {
				'id': data.group_id
			}
		}).catch(console.error);
	},
	
	activeGroupList: async(data) => {
		let result;
		const query = `SELECT GP.id,GP.group_name,GP.role_id,GP.is_active,GP.updated_by,GP.created_by,GP.project_id ,GP.domain_id,GP.is_active, URGP.user_name,
		CASE
		WHEN role_id is not null and role_id!=0 
		THEN '1'
		ELSE '0'
		END AS rbac_setting
		 FROM groups as GP 
		left join user_group as URGP on GP.id=URGP.group_id and URGP.is_active=1 
		where GP.is_active=1 and GP.project_id=${data.project_id} and domain_id="${data.domain_id}"   group by GP.id`
		result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		console.log("get the query data****************",result)
		return result;
	  },
	allGroupList: async(data) => {
		return sql_conn.groupModel.findAll({
			where: Sequelize.and(
			{'project_id':data.project_id},
			{'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},
	groupListWithUser: async () => {
		return sql_conn.groupModel.findAll({
			include: [{
				model: sql_conn.cloudappModel,
				attributes: ['id', 'acct_id', 'user_name']
			}],
			where: {
				//'acct_id': data.acct_id,
				'is_active': true
			}
		}).catch(console.error);
	},
	list: async (groupIds) => {
		return sql_conn.groupModel.findAll({
			where: {
				id:{[Op.in]: groupIds}
			}
		}).catch(console.error);
	},
	insertGroupAccess: async (data) => {
		console.log("DATA = "+JSON.stringify(data));
		return sql_conn.groupModel.bulkCreate(data, {
			updateOnDuplicate: ['id', 'role_id']
		}).catch(console.error);
	},
	groupListWithoutRole: async(data) => {
		return sql_conn.groupModel.findAll({
			where: Sequelize.and(
				{'role_id': null},
				{'project_id':data.project_id},
			    {'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},
	getGroupById: async data => {
		return sql_conn.groupModel.findOne({
			where: {
				'id': data.group_id,
				'created_by': data.acct_id
			}
		})
	},
	//bulk insert group values 
	insertGroupsAppSetup: async (groups) => {
		console.log("data groups==>",groups);
		console.log("DATA = "+JSON.stringify(groups));
		return sql_conn.groupModel.bulkCreate(groups,{
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
	},
	getSameGroup: async(data) => {
        return sql_conn.groupModel.findAll({
            where: Sequelize.and(
                {'group_name':data.group_name},
				{'domain_id': data.domain_id},
				{'project_id':data.project_id},
                {'is_active': true}
            )
        }).catch(console.error);
    }
}

module.exports = {groupDetails};

