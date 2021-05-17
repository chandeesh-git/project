'use strict';

module.exports = (sequelize, DataTypes) => {
	var field_type_dropdown_master = sequelize.define('field_type_dropdown_master', {
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
		ftd_name: DataTypes.STRING,
		ftd_description: DataTypes.STRING,
		ftd_status: DataTypes.STRING,
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
	return field_type_dropdown_master;
};
