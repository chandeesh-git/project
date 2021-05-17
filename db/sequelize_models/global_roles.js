'use strict';

module.exports = (sequelize, DataTypes) => {
	var global_role = sequelize.define('global_roles', {
		role_name: DataTypes.STRING,
		domain_id : DataTypes.STRING,
		allow_testcase_create: DataTypes.INTEGER,
		allow_testcase_read: DataTypes.INTEGER,
		allow_testcase_edit: DataTypes.INTEGER,
		allow_testcase_delete: DataTypes.INTEGER,
		allow_testcase_archive: DataTypes.INTEGER,
		allow_testcase_versions: DataTypes.INTEGER,
		allow_testcase_folders: DataTypes.INTEGER,
		testcase_lock: DataTypes.INTEGER,
		allow_testplan_create: DataTypes.INTEGER,
		allow_testplan_edit: DataTypes.INTEGER,
		allow_testplan_view: DataTypes.INTEGER,
		allow_testplan_delete: DataTypes.INTEGER,
		allow_testplan_folders: DataTypes.INTEGER,
		allow_testcycle_create: DataTypes.INTEGER,
		allow_testcycle_edit: DataTypes.INTEGER,
		allow_testcycle_view: DataTypes.INTEGER,
		allow_testcycle_execute: DataTypes.INTEGER,
		allow_testcycle_delete: DataTypes.INTEGER,
		allow_testcycle_folders: DataTypes.INTEGER,
		allow_reports_create: DataTypes.INTEGER,
		allow_configuration: DataTypes.INTEGER,
		is_active: {
            type:DataTypes.BOOLEAN,
            defaultValue:true
        },
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
	});
	return global_role;
};
