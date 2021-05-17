const Sequelize = require('sequelize');
const dbConfig = require('./config/config_detail');

const sequelize = new Sequelize(dbConfig.db_name, dbConfig.db_user_name, dbConfig.db_password, {
	host: dbConfig.db_host,
	dialect: dbConfig.db_dialect,
	operatorsAliases: false,
	define: {
		freezeTableName: true,
		underscored: true,
		timestamps: true
	},
	pool: {
		max: dbConfig.db_pool.max,
		min: dbConfig.db_pool.min,
		acquire: dbConfig.db_pool.acquire,
		idle: dbConfig.db_pool.idle
	}
});

const db = {};
db.sequelize = sequelize;
db.projectModel = require('./project')(sequelize, Sequelize);
db.issueModel = require('./issue')(sequelize, Sequelize);
db.cloudappModel = require('./cloudapp_users')(sequelize, Sequelize);
db.roleModel = require('./roles')(sequelize, Sequelize);
db.groupModel = require('./groups')(sequelize, Sequelize);
db.userRoleModel = require('./user_role')(sequelize, Sequelize);
db.userGroupModel = require('./user_group')(sequelize, Sequelize);
db.environmentConfigModel = require('./environment_config_master')(sequelize, Sequelize);
db.customFieldConfigModel = require('./custom_field_config_master')(sequelize, Sequelize);
db.datasetConfigModel = require('./dataset_config_master')(sequelize, Sequelize);
db.fieldTypeModel = require('./field_type_dropdown_master')(sequelize, Sequelize);
db.labelConfigModel = require('./label_config_master')(sequelize, Sequelize);
db.statusConfigModel = require('./status_config_master')(sequelize, Sequelize);
db.priorityConfigModel = require('./priority_config_master')(sequelize, Sequelize);
db.componentConfigModel = require('./component_config_master')(sequelize, Sequelize);

db.folderModel = require('./folder')(sequelize, Sequelize);
db.folderTestMapping  = require('./folder_test_mapping')(sequelize, Sequelize);
db.testcaseDetailsModel = require('./testcase_details')(sequelize, Sequelize);
db.testcaseVersionModel = require('./testcase_version_mapping')(sequelize,Sequelize);
db.testLogs = require('./test_logs')(sequelize,Sequelize);
db.planCycleModel = require('./testplan_testcycle_mapping')(sequelize,Sequelize);
db.testCycleCaseMapping = require('./testcycle_testcase_mapping')(sequelize, Sequelize);
db.testexecutionDetailsModel = require('./test_execution_details')(sequelize, Sequelize);
db.executionLogsModel = require('./execution_logs')(sequelize,Sequelize);
db.testKeyModel = require('./test_key')(sequelize,Sequelize);
db.customFilterModel = require('./custom_filter')(sequelize,Sequelize);
db.credentialsModel = require('./app_credentials ')(sequelize,Sequelize);
// db.cloudappModel.belongsTo(db.roleModel, {foreignKey: 'role_id'});
// db.roleModel.hasMany(db.cloudappModel, {foreignKey: 'id'});
//db.cloudappModel.belongsTo(db.groupModel, {foreignKey: 'group_id'});
// db.groupModel.hasMany(db.cloudappModel, {foreignKey: 'id'});

db.roleModel.hasMany(db.userRoleModel, {foreignKey: 'role_id'});
db.userRoleModel.belongsTo(db.roleModel, {foreignKey: 'role_id'});

db.groupModel.hasMany(db.userGroupModel, {foreignKey: 'group_id'});
db.userGroupModel.belongsTo(db.groupModel, {foreignKey: 'group_id'});

// db.roleModel.hasMany(db.groupModel, {foreignKey: 'role_id'});
// db.groupModel.belongsTo(db.roleModel, {foreignKey: 'role_id'});

//db.groupModel.hasMany(db.userGroupModel, {foreignKey: 'id'});

// db.projectModel.hasMany(db.roleModel, {foreignKey: 'project_id'});
// db.projectModel.hasMany(db.groupModel, {foreignKey: 'project_id'});
db.globalEnvironmentConfig = require('./global_environment_config')(sequelize,Sequelize);
db.globalDatasetConfig = require('./global_dataset_config')(sequelize,Sequelize);
db.globalLabelConfig = require('./global_label_config')(sequelize,Sequelize);
db.globalPriorityConfig = require('./global_priority_config')(sequelize,Sequelize);
db.globalStatusConfig = require('./global_status_config')(sequelize,Sequelize);
db.globalCustomFieldConfig = require('./global_custom_field_config')(sequelize,Sequelize);
db.globalComponentConfig = require('./global_component_config')(sequelize,Sequelize);
db.globalGroupModel = require('./global_groups')(sequelize,Sequelize);
db.globalRoleModel = require('./global_roles')(sequelize,Sequelize);
db.globalUserRoleModel = require('./global_user_role')(sequelize,Sequelize);
db.globalUserGroupModel = require('./global_user_group')(sequelize,Sequelize);
db.globalIssueTypeModel = require('./global_issue_type')(sequelize,Sequelize);
module.exports = db;

