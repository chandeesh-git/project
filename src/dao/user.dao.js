'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const { sequelize } = require('../../db/sequelize_models/index');
//const sequelize = new Sequelize("mysql::memory:");

const userDetails={
	getUserAccess: async data => {
		var userAccess = await sql_conn.cloudappModel.findAll({
			// include: [{
			// 	model: sql_conn.roleModel
			// }],
			where: Sequelize.and(
				{'project_id': data.project_id},
				{'acct_id': data.acct_id}
			)
		}).catch(console.error);
		console.log("userAccess",userAccess);
		// if(userAccess.length === 0) {
		// 	console.log("if userAccess")
		// 	userAccess = await sql_conn.cloudappModel.findAll({
		// 		include: [{
		// 			model: sql_conn.groupModel,
		// 			include: [{
		// 				model: sql_conn.roleModel
		// 			}]
		// 		}],
		// 		where: {
		// 			'project_id': data.project_id,
		// 			'acct_id': data.acct_id
		// 		}
		// 	}).catch(console.error);
		// 	return userAccess;
		// } else {
			return userAccess;
		// }
	},
	insertUserAccess: async (data) => {
		console.log("USER DATA = "+JSON.stringify(data));
		return sql_conn.cloudappModel.bulkCreate(data, {
			updateOnDuplicate: ['acct_id', 'role_id', 'group_id']
		}).catch(console.error);
	},
	list: async (userIds) => {
		return sql_conn.cloudappModel.findAll({
			where: {
				acct_id:{[Op.in]: userIds}
			}
		}).catch(console.error);
	},
	checkUserExist: async (data) => {
		return sql_conn.cloudappModel.findOne({
			where: Sequelize.and(
				{'acct_id': data.acct_id},
                {'project_id':data.project_id}
            )
		}).catch(console.error);
	},
	accessThroughCloudUser: async data => {
        let result;
        const sql_statement = `
          SELECT CAS.role_id, role_name, allow_testcase_create, allow_testcase_read, allow_testcase_edit, allow_testcase_delete, allow_testcase_archive, 
            allow_testcase_versions, allow_testcase_folders, allow_testplan_create, allow_testplan_edit, allow_testplan_view,
            allow_testplan_delete, allow_testplan_folders, allow_testcycle_create, allow_testcycle_edit, allow_testcycle_view, 
            allow_testcycle_execute, allow_testcycle_delete, allow_testcycle_folders, allow_reports_create,allow_testcase_execute, allow_configuration, is_active,testcase_lock
            FROM cloudapp_users as  CAS 
            left join roles as RLS on CAS.role_id=RLS.id where CAS.acct_id= "${data.acct_id}" and CAS.project_id=${data.project_id}`
		result =await sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        return result
	},
	
	accessThroughUserRole: async data => {
        let result;
        const sql_statement = `
		SELECT * FROM roles  as RS
		left join user_role as USR on RS.id=USR.role_id 
		where RS.project_id=${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and USR.jira_acct_id="${data.acct_id}" and USR.is_active=1`
        result = await sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        return result
	},
	
	accessThroughUserGroup: async data => {
        let result;
        const sql_statement = `
		SELECT group_concat(role_id) as role_ids   FROM groups  as GRS
		left join user_group UGS on GRS.id=UGS.group_id
		where project_id=${data.project_id} and domain_id="${data.domain_id}" and GRS.is_active=1 and  UGS.jira_acct_id="${data.acct_id}" and UGS.is_active=1`
		result = await sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		if(result[0].role_ids!=null){
			let roles_id=result[0].role_ids
			console.log("I am getting the ids")
			let result_1
			const sql_statement = `
			SELECT * FROM roles where id in (${roles_id})`
			result_1 =await sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result_1
		} else{
			return result=[]
		}
    },
	
}

module.exports = {userDetails};

