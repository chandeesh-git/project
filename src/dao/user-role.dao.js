'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const user_role = require('../../db/sequelize_models/user_role');
// const sequelize = new Sequelize("mysql::memory:");
const { sequelize } = require('../../db/sequelize_models/index');

const userRoleDetails = { 
    addUserRole: async (data) => {
		return sql_conn.userRoleModel.create(data).catch(console.error);
	},
	updateUserRole: async data => {
		return sql_conn.userRoleModel.update(data,{
			where: {
				'id': data.id
			}
		}).catch(console.error);
	},
	deleteUserRole: async data => {
		return sql_conn.userRoleModel.destroy({
			where: {
				'id': data.id
			}
		}).catch(console.error);
	},
	fetchRoleId: async(data) => {
		let result;
		const query = `SELECT group_concat(id) as id FROM roles where project_id=${data.project_id} and domain_id="${data.domain_id}" `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	fetchUserList: async role_ids => {
		let result;
			const sql_statement = `
			SELECT id, user_name, role_id, is_active, jira_acct_id FROM user_role where role_id in(${role_ids})`
			result = sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
	},
	fetchUserListActive: async role_ids => {
		let result;
			const sql_statement = `
			SELECT id, user_name, role_id, is_active, jira_acct_id FROM user_role where role_id in(${role_ids}) and is_active = 1`
			result = sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
	},
	fetchGroupDetails: async role_ids => {
		let result;
		const query = `SELECT * FROM groups where role_id in(${role_ids}) `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	fetchGroupDetailsActive: async role_ids => {
		let result;
		const query = `SELECT * FROM groups where role_id in(${role_ids}) and is_active = 1`
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	userRoleList: async jira_acct_id => {
		return sql_conn.userRoleModel.findAll({
			attributes:[
				'role.id',
				'role.project_id',
				'role.domain_id',
				'role.role_name',
				'role.allow_testcase_create',
				'role.allow_testcase_read',
				'role.allow_testcase_edit',
				'role.allow_testcase_delete',
				'role.allow_testcase_archive',
				'role.allow_testcase_versions',
				'role.allow_testcase_folders',
				'role.allow_testplan_create',
				'role.allow_testplan_edit',
				'role.allow_testplan_view',
				'role.allow_testplan_delete',
				'role.allow_testplan_folders',
				'role.allow_testcycle_create',
				'role.allow_testcycle_edit',
				'role.allow_testcycle_view',
				'role.allow_testcycle_execute',
				'role.allow_testcycle_delete',
				'role.allow_testcycle_folders',
				'role.allow_reports_create',
				'role.allow_configuration',
				'role.allow_testcase_execute',
				'role.testcase_lock',
				'role.is_active',
				'role.updated_by',
				'role.created_by'
			],
			include: [{
				model: sql_conn.roleModel,
				attributes:[]
			}],
			where: {
				jira_acct_id
			},
			raw:true
		}).catch(console.error);
	},

	// //bulk insert user role values 
	// insertUserRoleAppSetup: async (userRole) => {
	// 	console.log("data userGroups==>",userRole);
	// 	console.log("DATA = "+JSON.stringify(userRole));
	// 	return sql_conn.userRoleModel.bulkCreate(userRole,{
	// 		updateOnDuplicate: ['project_id', 'domain_id']
	// 	}).catch(console.error);
	// },
}

module.exports = { userRoleDetails }