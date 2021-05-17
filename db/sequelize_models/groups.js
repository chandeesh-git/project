'use strict';

module.exports = (sequelize, DataTypes) => {
	var group = sequelize.define('groups', {
		group_name: DataTypes.STRING,
		project_id: DataTypes.INTEGER,
		domain_id : DataTypes.STRING,
		role_id: DataTypes.INTEGER,
		is_active: DataTypes.BOOLEAN,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return group;
};
