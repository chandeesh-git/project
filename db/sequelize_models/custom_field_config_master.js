'use strict';

module.exports = (sequelize, DataTypes) => {
	var custom_field_config_master = sequelize.define('custom_field_config_master', {
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
		cfc_name: DataTypes.STRING,
		cfc_field_type: DataTypes.STRING,
		cfc_required_flag: DataTypes.INTEGER,
		cfc_status: DataTypes.INTEGER,
		cfc_type: DataTypes.STRING,
		cfc_options: DataTypes.STRING,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
		is_active: DataTypes.BOOLEAN,
		created_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
		},
		updated_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
		},
	});
	return custom_field_config_master;
};
