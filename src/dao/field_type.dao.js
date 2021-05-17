'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const fieldTypeDetails = { 
    //get field type by ID
    getFieldTypeById: async data => {
        return sql_conn.fieldTypeModel .findOne({
            where: {
                'id': data.field_id
            },
        }).catch(console.error);
    },
    //get all field type list
    allFieldTypeList: async data => {
        return sql_conn.fieldTypeModel.findAll().catch(console.error);
    },
}

module.exports = { fieldTypeDetails }