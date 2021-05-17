'use strict';

module.exports = (sequelize, DataTypes) => {
	var project = sequelize.define('project', {
		project_id: DataTypes.STRING,
		domain_id: DataTypes.STRING,
		inquestPro_enabled: DataTypes.INTEGER,
		permission_status: DataTypes.INTEGER,
		story_enabled: DataTypes.INTEGER,
		task_enabled: DataTypes.INTEGER,
		bug_enabled: DataTypes.INTEGER,
		epic_enabled: DataTypes.INTEGER,
		subtask_enabled: DataTypes.INTEGER,
		acct_id: DataTypes.STRING,
		region_id: DataTypes.INTEGER,
		created_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
		},
		updated_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
		},
	});
	return project;
};
