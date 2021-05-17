'use strict';

module.exports = (sequelize, DataTypes) => {
	var global_custom_field_config = sequelize.define('global_custom_field_config', {
		domain_id: DataTypes.STRING,
		cfc_name: DataTypes.STRING,
		cfc_field_type: DataTypes.STRING,
		cfc_required_flag: DataTypes.INTEGER,
		cfc_status: DataTypes.INTEGER,
		cfc_type: DataTypes.STRING,
		cfc_options: DataTypes.STRING,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
		is_active: {
            type:DataTypes.BOOLEAN,
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
	return global_custom_field_config;
};
