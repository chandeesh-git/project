'use strict';

module.exports = (sequelize, DataTypes) => {
	var component_config_master = sequelize.define('component_config_master', {
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
		cp_name: DataTypes.STRING,
		cp_description: DataTypes.STRING,
		cp_color: DataTypes.STRING,
		cp_type: DataTypes.STRING,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
		is_active: {
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
	return component_config_master;
};