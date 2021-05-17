'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");


const datasetConfigDetails = {
    //add global dataset
    addDatasetConfig: async data => {
        if(data.domain_id){
          return sql_conn.globalDatasetConfig.create(data).catch(console.error);
        } else {
          console.log("Please enter valid dimain")
        }		
    },
    //get dataset config by ID
    getDatasetConfigById: async data => {
      return sql_conn.globalDatasetConfig.findOne({
        where: Sequelize.and(
          {'id': data.global_dataset_id},
          {'domain_id':data.domain_id}
        )
      }).catch(console.error);
    },
    //get all dataset list
    getAllDatasetList: async data => {
      return sql_conn.globalDatasetConfig.findAll({
        where: Sequelize.and(
          {'domain_id':data.domain_id},
          {'is_active':true}
        )
      }).catch(console.error);
    },
    //update dataset
    editDatasetConfig: async data => {
      return sql_conn.globalDatasetConfig.update(data,{
        where:Sequelize.and(
          {'id': data.global_dataset_id},
          {'domain_id':data.domain_id}
        )
      }).catch(console.error);
    },
    //delete dataset by id
    deleteDatasetConfig: async data => {
      return sql_conn.globalDatasetConfig.update({
          'is_active':false,
          'updated_by':data.acct_id
        },{
        where: Sequelize.and(
          {'id': data.global_dataset_id},
          {'domain_id':data.domain_id}
        )
      }).catch(console.error);
    },
    
    datasetDomainDetails: async(data) => {
      let result;
      const query = `SELECT * FROM global_dataset_config where domain_id ="${data.domain_id}" and is_active=1 `
      result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      return result;
    },
    getSameDataset: async(data) => {
      return sql_conn.globalDatasetConfig.findAll({
          where: Sequelize.and(
              {'dc_name':data.dc_name},
              {'domain_id': data.domain_id},
              {'is_active': true}
          )
      }).catch(console.error);
    },
    datasetNameDetailsWhileUpdate: async(data) => {
      return sql_conn.globalDatasetConfig.findAll({
          where: Sequelize.and(
              {'dc_name':data.dc_name},
              {'is_active': true},
              {'domain_id': data.domain_id},
              {'id': 
                  {[Op.ne]: data.global_dataset_id}
              }
          )
      }).catch(console.error);
    },
}

module.exports = { datasetConfigDetails }