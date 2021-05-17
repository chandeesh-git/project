'use strict';

module.exports = (sequelize, DataTypes) => {
	var global_priority_config = sequelize.define('global_priority_config', {
		domain_id: DataTypes.STRING,
		pc_name: DataTypes.STRING,
		priority_label:DataTypes.STRING,
		priority_color:DataTypes.STRING,
		priority_type:DataTypes.STRING,
		updated_by: DataTypes.STRING,
        created_by: DataTypes.STRING,
        is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue:true
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
	return  global_priority_config;
};