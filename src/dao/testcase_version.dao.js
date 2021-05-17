'use strict';

var sql_conn = require('../../db/sequelize_models');


const testcaseVersion = {
    addTestcaseVersion: async data => {
		return sql_conn.testcaseVersionModel.create(data).catch(console.error);
	}
}

module.exports = { testcaseVersion }