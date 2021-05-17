'use strict';

module.exports = (sequelize, DataTypes) => {
	var priority_config_master = sequelize.define('priority_config_master', {
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
		pc_name: DataTypes.STRING,
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue:true
		},
		priority_color:DataTypes.STRING,
		priority_label:DataTypes.STRING,
		priority_type:DataTypes.STRING,
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
	return priority_config_master;
};