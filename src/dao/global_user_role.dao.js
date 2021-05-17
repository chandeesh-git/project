'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const user_role = require('../../db/sequelize_models/user_role');
// const sequelize = new Sequelize("mysql::memory:");
const { sequelize } = require('../../db/sequelize_models/index');

const userRoleDetails = { 
    addUserRole: async (data) => {
		return sql_conn.globalUserRoleModel.create(data).catch(console.error);
	},
	updateUserRole: async data => {
		return sql_conn.globalUserRoleModel.update(data,{
			where: {
				'id': data.id
			}
		}).catch(console.error);
	},
	deleteUserRole: async data => {
		return sql_conn.globalUserRoleModel.destroy({
			where: {
				'id': data.id
			}
		}).catch(console.error);
	},
	fetchRoleId: async(data) => {
		let result;
		const query = `SELECT group_concat(id) as id FROM global_roles where domain_id="${data.domain_id}" `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	fetchUserListActive: async role_ids => {
		let result;
			const sql_statement = `
			SELECT id, user_name, role_id, is_active, jira_acct_id FROM global_user_role where role_id in(${role_ids}) and is_active = 1`
			result = sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
	},
	fetchGroupDetailsActive: async role_ids => {
		let result;
		const query = `SELECT * FROM global_groups where role_id in(${role_ids}) and is_active = 1`
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	// domainUserRoleList: async(data) => {
	// 	let result;
	// 	const query = `SELECT * FROM global_user_role where domain_id ="${data.domain_id}" and is_active=1 `
	// 	result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
	// 	return result;
	//   },

}

module.exports = { userRoleDetails }