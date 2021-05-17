'use strict'

module.exports = (sequelize, DataTypes) => {
    var testcaseDetails = sequelize.define('testcase_details', {
        project_id: DataTypes.STRING,
        domain_id: DataTypes.STRING,
        folder_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        priority: DataTypes.STRING,
        test_key: DataTypes.STRING,
        last_execution: DataTypes.DATE,
        updated_by: DataTypes.STRING,
        created_by: DataTypes.STRING,
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        submit_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });
    return testcaseDetails;
}