'use strict';
module.exports = (sequelize, DataTypes) => {
	var userGroup = sequelize.define('user_group', {
		group_id: DataTypes.INTEGER,
		user_name: DataTypes.STRING,
		jira_acct_id: DataTypes.STRING,
		is_active: DataTypes.BOOLEAN,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return userGroup;
};
