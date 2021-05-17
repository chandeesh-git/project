'use strict';

module.exports = (sequelize, DataTypes) => {
	var status_config_master = sequelize.define('status_config_master', {
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
		sc_name: DataTypes.STRING,
		sc_description: DataTypes.STRING,
		sc_color: DataTypes.STRING,
		sc_type: DataTypes.STRING,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
		is_active: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		sc_status: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		created_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
		},
		updated_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
		},
	});
	return status_config_master;
};
