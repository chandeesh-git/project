'use strict'
module.exports = (sequelize, DataTypes) => {
    var testcaseVersion = sequelize.define('testplan_testcycle_mapping', {
        testplan_id: DataTypes.STRING,
        testcycle_id: DataTypes.STRING,
        updated_by: DataTypes.STRING,
        created_by: DataTypes.STRING,
        project_id: DataTypes.STRING,
        domain_id: DataTypes.STRING,
    });
    return testcaseVersion;
}