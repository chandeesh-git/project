'use strict';

module.exports = (sequelize, DataTypes) => {
	var globalIssueType = sequelize.define('global_issue_type', {
		domain_id: DataTypes.STRING,
		permission_status: DataTypes.INTEGER,
		story_enabled: DataTypes.INTEGER,
		task_enabled: DataTypes.INTEGER,
		bug_enabled: DataTypes.INTEGER,
		epic_enabled: DataTypes.INTEGER,
		subtask_enabled: DataTypes.INTEGER,
		created_by: DataTypes.STRING,
		updated_by: DataTypes.STRING,
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		created_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
		},
		updated_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
		},
	});
	return globalIssueType;
};
