'use strict';

module.exports = (sequelize, DataTypes) => {
	var cloudapp_user = sequelize.define('cloudapp_users', {
		acct_id: DataTypes.STRING,
		user_name: DataTypes.STRING,
		project_id: DataTypes.INTEGER,
		domain_id: DataTypes.STRING,
		group_id: DataTypes.INTEGER,
		role_id: DataTypes.INTEGER,
		created_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
		},
		updated_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
		},
	});
	return cloudapp_user;
};
