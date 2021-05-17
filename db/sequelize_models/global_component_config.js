'use strict';

module.exports = (sequelize, DataTypes) => {
	var global_component_config = sequelize.define('global_component_config', {
		domain_id: DataTypes.STRING,
		cp_name: DataTypes.STRING,
		cp_description: DataTypes.STRING,
		cp_color: DataTypes.STRING,
		cp_type: DataTypes.STRING,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
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
	return global_component_config;
};