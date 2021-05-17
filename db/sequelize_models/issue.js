'use strict';

module.exports = (sequelize, DataTypes) => {
	var issue = sequelize.define('jira_issues', {
		issue_id: DataTypes.INTEGER,
		issue_type: DataTypes.STRING,
		issue_name: DataTypes.STRING,
		issue_key: DataTypes.STRING,
		issue_to_link: DataTypes.STRING,
		project_id: DataTypes.INTEGER,
		domain_id: DataTypes.STRING,
		issue_status: DataTypes.STRING,
		test_type: DataTypes.STRING,   
		issue_icon: DataTypes.STRING,  
		issue_priority: DataTypes.STRING, 
		test_id : DataTypes.STRING,
		version : DataTypes.STRING,
		updated_by: DataTypes.STRING,
		created_by: DataTypes.STRING,
		created_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
		},
		updated_at: {
			type: DataTypes.DATE(3),
			defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
		},
	});
	return issue;
};
