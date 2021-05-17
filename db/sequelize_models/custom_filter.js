'use strict';

module.exports = (sequelize, DataTypes) => {
	var custom_filter = sequelize.define('custom_filter', {
		acct_id: DataTypes.STRING,
		project_id: DataTypes.INTEGER,
		domain_id: DataTypes.STRING,
		test_type : DataTypes.STRING,
	    filter_name: DataTypes.STRING,
		filter_key: DataTypes.STRING,
        filter_type: DataTypes.STRING,
        updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return custom_filter;
};


