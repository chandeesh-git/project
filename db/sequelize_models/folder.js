'use strict';

module.exports = (sequelize, DataTypes) => {
	var folder = sequelize.define('folder', {
		acct_id: DataTypes.STRING,
		project_id: DataTypes.INTEGER,
		domain_id: DataTypes.STRING,
		parent_folder_id : DataTypes.STRING,
		folder_name: DataTypes.STRING,
		folder_type: DataTypes.STRING,
		folder_category: DataTypes.STRING,
		document_count: DataTypes.INTEGER,
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue:true
		},
        updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return folder;
};


