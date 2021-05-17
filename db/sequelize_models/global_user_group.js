'use strict';
module.exports = (sequelize, DataTypes) => {
	var globalUserGroup = sequelize.define('global_user_group', {
		group_id: DataTypes.INTEGER,
		user_name: DataTypes.STRING,
		jira_acct_id: DataTypes.STRING,
		is_active: {
            type:DataTypes.BOOLEAN,
            defaultValue:true
        },
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return globalUserGroup;
};
