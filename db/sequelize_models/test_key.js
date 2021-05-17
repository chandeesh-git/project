'use strict';

module.exports = (sequelize, DataTypes) => {
	var test_key = sequelize.define('test_key', {
		domain_id: DataTypes.STRING,
		project_id : DataTypes.STRING,
		test_type: DataTypes.STRING,
		test_count: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	});
	return test_key;
};
