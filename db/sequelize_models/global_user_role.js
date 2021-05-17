'use strict';
module.exports = (sequelize, DataTypes) => {
	var globalUserRole = sequelize.define('global_user_role', {
		user_name: DataTypes.STRING,
		jira_acct_id: DataTypes.STRING,
		role_id: DataTypes.INTEGER,
		is_active: {
            type:DataTypes.BOOLEAN,
            defaultValue:true
        },
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return globalUserRole;
};
