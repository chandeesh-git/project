'use strict';
module.exports = (sequelize, DataTypes) => {
	var testLogs = sequelize.define('test_logs', {
		test_id: DataTypes.STRING,
        doc_id: DataTypes.STRING,	
        test_type: DataTypes.STRING,
		field_data: DataTypes.TEXT,	
		version: DataTypes.STRING,
		description: DataTypes.STRING,	
        updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return testLogs;
};


