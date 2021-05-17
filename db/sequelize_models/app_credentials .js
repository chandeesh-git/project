'use strict';

module.exports = (sequelize, DataTypes) => {
	var app_credentials  = sequelize.define('app_credentials', {
		regions_name: DataTypes.STRING,
		mongo_db_url: DataTypes.STRING,
		bucket_name: DataTypes.STRING,
		storage_destination: DataTypes.STRING,
		gcp_project_id: DataTypes.STRING,
		gcp_file_name: DataTypes.STRING
	});
	return app_credentials ;
};


