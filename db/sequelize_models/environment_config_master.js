'use strict';

module.exports = (sequelize, DataTypes) => {
	var environment_config_master = sequelize.define('environment_config_master', {
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
		ec_name: DataTypes.STRING,
		ec_description: DataTypes.STRING,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
		created_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
		},
		updated_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
		},
	});
	return environment_config_master;
};
