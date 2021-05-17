'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const issueDetails={	
	addIssue:async data=>{
		return sql_conn.issueModel.create(data).catch(console.error);
	},
	deleteIssue:async issue_id=>{
		return sql_conn.issueModel.destroy({
			where: {
				'issue_id': issue_id
			}
		}).catch(console.error);
	},
};

module.exports = {issueDetails};

