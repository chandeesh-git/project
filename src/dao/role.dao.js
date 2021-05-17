'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const roleDetails={
	addRole: async data => {
	    if(data.project_id){
			let projectData = await sql_conn.projectModel.findOne({
				where: Sequelize.and({
					'project_id':data.project_id},
					{'domain_id':data.domain_id}
				)
			})
			if(projectData){
				return sql_conn.roleModel.create(data).catch(console.error);
			} else {
				console.log("project details not found")
			}
		}
	},
	updateRole: async data => {
		return sql_conn.roleModel.update(data, {
			where: {
				'id': data.role_id
			}
		}).catch(console.error);
	},
	softDeleteRole: async data => {
		return sql_conn.roleModel.update({
			'is_active': false,
			'updated_by': data.acct_id
		}, {
			where: {
				'id': data.role_id
			}
		}).catch(console.error);
	},
	removeRole: async data => {
		return sql_conn.roleModel.destroy({
			where: {
				'id': data.role_id
			}
		}).catch(console.error);
	},

	roleList: async(data) => {
		let result;
		const query = `SELECT  RS.id, RS.role_name, GP.group_name,user_name,allow_testcase_create,allow_testcase_read,allow_testcase_edit,allow_testcase_delete,allow_testcase_archive
		allow_testcase_versions,allow_testcase_folders,allow_testplan_create,allow_testplan_edit,allow_testplan_view,allow_testplan_delete,allow_testplan_folders,
        allow_testcycle_create,allow_testcycle_edit,allow_testcycle_view,allow_testcycle_execute,allow_testcycle_delete,allow_testcycle_folders, allow_reports_create,allow_testcase_execute, testcase_lock,
        allow_configuration,RS.is_active,
		CASE
    	WHEN allow_testcase_create is not null or allow_testcase_read  is not null or allow_testcase_edit is not null or  allow_testcase_delete is not null or 
    	allow_testcase_archive is not null or allow_testcase_versions is not null or allow_testcase_folders is not null or allow_testplan_create is not null or 
   		allow_testplan_edit is not null or allow_testplan_view is not null or allow_testplan_delete is not null  or allow_testplan_folders is not null or 
    	allow_testcycle_create is not null or allow_testcycle_edit is not null or allow_testcycle_view is not null or allow_testcycle_execute is not null or 
    	allow_testcycle_delete is not null or allow_testcycle_folders is not null or allow_reports_create is not null or  allow_testcase_execute is not null or  allow_configuration is not null
    	THEN '1'
    	ELSE '0'
		END AS rbac_setting
		FROM roles as RS 
		left join groups as GP on RS.id=GP.role_id and  GP.is_active
		left join user_role as USR on RS.id=USR.role_id and  USR.is_active
		where  RS.is_active=1 and RS.project_id=${data.project_id} and RS.domain_id="${data.domain_id}"  group by RS.id`
		result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		console.log("get the query data****************",result)
		return result;
	  },
	roleUsersList: async () => {
		return sql_conn.roleModel.findAll({
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
	getRoleById: async data => {
		return sql_conn.roleModel.findOne({
			where: {
				'id':data.role_id,
				'created_by':data.acct_id
			}
		})
	},
	//bulk insert role values 
	insertRolesAppSetup: async (roles) => {
		console.log("data role==>",roles);
		console.log("DATA = "+JSON.stringify(roles));
		return sql_conn.roleModel.bulkCreate(roles,{
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
	},
	getSameRole: async(data) => {
        return sql_conn.roleModel.findAll({
            where: Sequelize.and(
                {'role_name':data.role_name},
				{'domain_id': data.domain_id},
				{'project_id':data.project_id},
                {'is_active': true}
            )
        }).catch(console.error);
    }	
}

module.exports = {roleDetails};

