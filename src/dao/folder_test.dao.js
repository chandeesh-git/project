'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const folderTestcase = {
	addFolderTest: async data => {
		 return sql_conn.folderTestMapping.create(data).catch(console.error);
	},
	
	deleteTestcase: async data => {
		return sql_conn.folderTestMapping.update({
			'is_active': false,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and(
                {'doc_id': data.testcase_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},

	updateFolderTest: async data => {
		return sql_conn.folderTestMapping.update({
			'folder_id': data.folder_id,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and(
                {'doc_id': data.testcase_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},

	updateFolderTestcycle: async(testcycle_id, data) => {
		console.log("data",data);
		return sql_conn.folderTestMapping.update({
			'folder_id': data.folder_id,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and(
                {'doc_id': testcycle_id},
                {'project_id':data.project_id},
				{'domain_id':data.domain_id},
				{'test_type': 'testcycle'}
			)
		}).catch(console.error);
	},

	updateFolderTestplan: async (testplan_id, data) => {
		return sql_conn.folderTestMapping.update({
			'folder_id': data.folder_id,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and(
                {'doc_id': testplan_id},
                {'project_id':data.project_id},
				{'domain_id':data.domain_id},
				{'test_type': 'testplan'}
			)
		}).catch(console.error);
	},
};

module.exports = { folderTestcase };

