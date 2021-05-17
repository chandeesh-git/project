'use strict'
module.exports = (sequelize, DataTypes) => {
    var executionDetails = sequelize.define('test_execution_details', {
        testexecution_id: DataTypes.STRING,
        testcycle_id: DataTypes.STRING,
        testcase_id: DataTypes.STRING,
        version: DataTypes.STRING,
        recorded_time: DataTypes.STRING,
        execution_status: DataTypes.STRING,
        environment: DataTypes.STRING,
        updated_by: DataTypes.STRING,
        created_by: DataTypes.STRING,
        project_id: DataTypes.STRING,
        domain_id: DataTypes.STRING,
    });
    return executionDetails;
}