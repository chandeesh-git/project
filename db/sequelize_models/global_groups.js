'use strict';

module.exports = (sequelize, DataTypes) => {
	var global_group = sequelize.define('global_groups', {
		group_name: DataTypes.STRING,
		domain_id : DataTypes.STRING,
		role_id: DataTypes.INTEGER,
		is_active: {
            type:DataTypes.BOOLEAN,
            defaultValue:true
        },
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return global_group;
};
