'use strict';
module.exports = (sequelize, DataTypes) => {
	var userRole = sequelize.define('user_role', {
		user_name: DataTypes.STRING,
		jira_acct_id: DataTypes.STRING,
		role_id: DataTypes.INTEGER,
		is_active: DataTypes.BOOLEAN,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return userRole;
};
