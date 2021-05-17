'use strict';
module.exports = (sequelize, DataTypes) => {
	var executionLogs = sequelize.define('execution_logs', {
		execution_id: DataTypes.STRING,
		status: DataTypes.STRING,
		status_color: DataTypes.STRING,
		tested_by: DataTypes.STRING,
		detail: DataTypes.STRING,
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
        updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return executionLogs;
};


