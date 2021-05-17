'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");


const datasetConfigDetails = {
    //add evnvironment
    addDatasetConfig: async data => {
        let projectData = await sql_conn.projectModel.findOne({
            where: Sequelize.and(
                { 'project_id':data.project_id },
                { 'domain_id':data.domain_id })
            })
        if(projectData){
            return sql_conn.datasetConfigModel.create(data).catch(console.error);
        } else {
            console.log("project details not found")
        }		
    },
    //get datasetironment config by ID
    getDatasetConfigById: async data => {
		return sql_conn.datasetConfigModel.findOne({
			where: Sequelize.and(
				{'id': data.dataset_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //get all dataset list
    getAllDatasetList: async data => {
		return sql_conn.datasetConfigModel.findAll({
			where: Sequelize.and(
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //update dataset
    editDatasetConfig: async data => {
        return sql_conn.datasetConfigModel.update(data,{
          where:Sequelize.and(
            {'id': data.dataset_id},
            {'project_id':data.project_id},
            {'domain_id':data.domain_id}
          )
        }).catch(console.error);
      },
    //delete dataset by id
    deleteDatasetConfig: async data => {
		return sql_conn.datasetConfigModel.destroy({
			where: Sequelize.and(
                {'id': data.dataset_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
  },
  insertDatasets: async (datasetArray) => {
		console.log("DATA = "+JSON.stringify(datasetArray));
		return sql_conn.datasetConfigModel.bulkCreate(datasetArray, {
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
  },
  getSameDataset: async(data) => {
    return sql_conn.datasetConfigModel.findAll({
        where: Sequelize.and(
            {'dc_name':data.dc_name},
            {'domain_id': data.domain_id},
            {'project_id':data.project_id}
        )
    }).catch(console.error);
  },
  datasetNameDetailsWhileUpdate: async(data) => {
    return sql_conn.datasetConfigModel.findAll({
        where: Sequelize.and(
            {'dc_name':data.dc_name},
            {'domain_id': data.domain_id},
            {'project_id':data.project_id},
            {'id': 
                {[Op.ne]: data.dataset_id}
            }
        )
    }).catch(console.error);
  },
}

module.exports = { datasetConfigDetails }