'use strict'
module.exports = (sequelize, DataTypes) => {
    var cycleCaseMapping = sequelize.define('testcycle_testcase_mapping', {
        testcycle_id: DataTypes.STRING,
        testcase_id: DataTypes.STRING,
        version: DataTypes.STRING,
        tester: DataTypes.STRING,
        doc_id: DataTypes.STRING,
        last_execution: DataTypes.DATE,
        updated_by: DataTypes.STRING,
        created_by: DataTypes.STRING,
        project_id: DataTypes.STRING,
        domain_id: DataTypes.STRING,
    });
    return cycleCaseMapping;
}