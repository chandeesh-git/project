'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");

const customFieldConfigDetails = {
    //add custom field
    addCustomFieldConfig: async data => {
        let projectData = await sql_conn.projectModel.findOne({
            where: Sequelize.and(
                { 'project_id':data.project_id },
                { 'domain_id':data.domain_id })
            })
        if(projectData){
            return sql_conn.customFieldConfigModel.create(data).catch(console.error);
        } else {
            console.log("project details not found")
        }		
    },
    editCustomFieldConfig: async data => {
        return sql_conn.customFieldConfigModel.update(data,{
          where:Sequelize.and(
            {'id': data.cfield_id},
            {'project_id':data.project_id},
            {'domain_id':data.domain_id}
          )
        }).catch(console.error);
      },
    //get custom field config by ID
    getCustomFieldgById: async data => {
		return sql_conn.customFieldConfigModel.findOne({
			where: Sequelize.and(
				{'id': data.cfield_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //get all custom field list
    getAllCustomFieldList: async data => {
		return sql_conn.customFieldConfigModel.findAll({
			where: Sequelize.and(
                {'project_id':data.project_id},
                {'domain_id':data.domain_id},
                {'cfc_type':data.cfc_type},
                {'is_active': true}
            )
		}).catch(console.error);
    },
    //delete custom field by id
    deleteCustomFieldConfig: async data => {
		return sql_conn.customFieldConfigModel.update(
            {
                'is_active':false
            },
            {
			where: Sequelize.and(
                {'id': data.cfield_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
  },
  insertCustoms: async (customArray) => {
		console.log("DATA = "+JSON.stringify(customArray));
		return sql_conn.customFieldConfigModel.bulkCreate(customArray, {
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
  },
  getSameCf: async(data) => {
    return sql_conn.customFieldConfigModel.findAll({
        where: Sequelize.and(
            {'cfc_name':data.cfc_name},
            {'domain_id': data.domain_id},
            {'project_id': data.project_id},
            {'cfc_type':data.cfc_type},
            {'cfc_field_type':data.cfc_field_type},
            {'is_active': true}
        )
    }).catch(console.error);
  },
  cfNameDetailsWhileUpdate: async(data) => {
      return sql_conn.customFieldConfigModel.findAll({
          where: Sequelize.and(
              {'cfc_name':data.cfc_name},
              {'cfc_type':data.cfc_type},
              {'is_active': true},
              {'cfc_field_type':data.cfc_field_type},
              {'domain_id': data.domain_id},
              {'project_id': data.project_id},
              {'id': 
                  {[Op.ne]: data.cfield_id}
              }
          )
      }).catch(console.error);
  },
}

module.exports = { customFieldConfigDetails }