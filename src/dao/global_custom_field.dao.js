'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const customFieldConfigDetails = {
    //add custom field
    addCustomFieldConfig: async data => {
        if(data.domain_id){
            return sql_conn.globalCustomFieldConfig.create(data).catch(console.error);
        } else {
            console.log("domain details not found")
        }		
    },
    editCustomFieldConfig: async data => {
        return sql_conn.globalCustomFieldConfig.update(data,{
          where:Sequelize.and(
            {'id': data.global_cfield_id},
            {'domain_id':data.domain_id}
          )
        }).catch(console.error);
      },
    //get custom field config by ID
    getCustomFieldgById: async data => {
      return sql_conn.globalCustomFieldConfig.findOne({
        where: Sequelize.and(
          {'id': data.global_cfield_id},
          {'domain_id':data.domain_id}
          )
      })
    },
    //get all custom field list
    getAllCustomFieldList: async data => {
		return sql_conn.globalCustomFieldConfig.findAll({
			where: Sequelize.and(
          {'domain_id':data.domain_id},
          {'cfc_type':data.cfc_type},
          {'is_active': true}
        )
		}).catch(console.error);
    },
    //delete custom field by id
    deleteCustomFieldConfig: async data => {
      return sql_conn.globalCustomFieldConfig.update(
          {
            'is_active':false,
            'updated_by': data.acct_id
          },
          {
        where: Sequelize.and(
          {'id': data.global_cfield_id},
          {'domain_id':data.domain_id}
        )
      }).catch(console.error);
    },
    customDomainDetails: async(data) => {
      let result;
      const query = `SELECT * FROM global_custom_field_config where domain_id ="${data.domain_id}" and is_active=1 `
      result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      return result;
  },
  getSameCf: async(data) => {
    return sql_conn.globalCustomFieldConfig.findAll({
        where: Sequelize.and(
            {'cfc_name':data.cfc_name},
            {'domain_id': data.domain_id},
            {'cfc_type':data.cfc_type},
            {'cfc_field_type':data.cfc_field_type},
            {'is_active': true}
        )
    }).catch(console.error);
  },
  cfNameDetailsWhileUpdate: async(data) => {
      return sql_conn.globalCustomFieldConfig.findAll({
          where: Sequelize.and(
              {'cfc_name':data.cfc_name},
              {'cfc_type':data.cfc_type},
              {'is_active': true},
              {'cfc_field_type':data.cfc_field_type},
              {'domain_id': data.domain_id},
              {'id': 
                  {[Op.ne]: data.global_cfield_id}
              }
          )
      }).catch(console.error);
  },

}

module.exports = { customFieldConfigDetails }