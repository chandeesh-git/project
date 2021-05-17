'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const { sequelize } = require('../../db/sequelize_models/index');
const customFilterDetails = {
	//Custom filter 
	createFilter: async data => {
		return sql_conn.customFilterModel.create(data).catch(console.error);
	},
	updateFilter: async data => {
		return sql_conn.customFilterModel.update({
			'filter_name': data.filter_name,
			'test_type': data.test_type,
			'filter_key': data.filter_key,
			'filter_type': data.filter_type,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and({
				'id': data.custom_filter_id,
				'project_id': data.project_id,
				'domain_id': data.domain_id,
			})
		}).catch(console.error);
	},


	userListFilter: async (data) => {
		let result;
		const query = `SELECT * FROM custom_filter where project_id =${data.project_id} and domain_id="${data.domain_id}"  and acct_id="${data.acct_id}" and test_type="${data.test_type}" `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	allListFilter: async (data) => {
		let result;
		const query = `SELECT * FROM custom_filter where project_id =${data.project_id} and domain_id="${data.domain_id}"  and filter_type="public" and test_type="${data.test_type}" `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	detailFilter: async (data) => {
		let result;
		const query = `SELECT * FROM custom_filter where project_id =${data.project_id} and domain_id="${data.domain_id}"  and id="${data.custom_filter_id}" `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	deleteFilter: async (data) => {
		return sql_conn.customFilterModel.destroy({
			where: Sequelize.and(
				{ 'id': data.custom_filter_id },
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id }
			)
		}).catch(console.error);
	},
}

module.exports = { customFilterDetails }