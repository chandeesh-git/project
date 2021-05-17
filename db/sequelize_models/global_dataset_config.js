'use strict';

module.exports = (sequelize, DataTypes) => {
	var global_dataset_config = sequelize.define('global_dataset_config', {
		domain_id: DataTypes.STRING,
		dc_name: DataTypes.STRING,
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
	return global_dataset_config;
};
