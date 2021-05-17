'use strict';

module.exports = (sequelize, DataTypes) => {
	var folder_test_mapping = sequelize.define('folder_test_mapping', {
		project_id: DataTypes.INTEGER,
		domain_id: DataTypes.STRING,
		folder_id: DataTypes.INTEGER,
		test_type: DataTypes.STRING,
		doc_id : DataTypes.STRING,
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue:true
		},
        updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return folder_test_mapping;
};
