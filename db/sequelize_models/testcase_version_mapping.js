'use strict'

module.exports = (sequelize, DataTypes) => {
    var testcaseVersion = sequelize.define('testcase_version_mapping', {
        testcase_detail_id: DataTypes.INTEGER,
        doc_id: DataTypes.STRING,
        version: DataTypes.STRING,
        is_lock: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        updated_by: DataTypes.STRING,
        created_by: DataTypes.STRING,
    });
    return testcaseVersion;
}