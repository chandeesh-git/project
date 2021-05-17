'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");

const labelConfigDetails = {
    //add label
    addLabelConfig: async data => {
        let projectData = await sql_conn.projectModel.findOne({
            where: Sequelize.and(
                { 'project_id':data.project_id },
                { 'domain_id':data.domain_id })
            })
        if(projectData){
            return sql_conn.labelConfigModel.create(data).catch(console.error);
        } else {
            console.log("project details not found")
        }		
    },
    //get label config by ID
    getLabelConfigById: async data => {
		return sql_conn.labelConfigModel.findOne({
			where: Sequelize.and(
				{'id': data.label_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //get all label list
    getAllLabelList: async data => {
		return sql_conn.labelConfigModel.findAll({
			where: Sequelize.and(
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //delete label by id
    deleteLabelConfig: async data => {
		return sql_conn.labelConfigModel.destroy({
			where: Sequelize.and(
                {'id': data.label_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
    },
    insertLabels: async (labelArray) => {
		console.log("DATA = "+JSON.stringify(labelArray));
		return sql_conn.labelConfigModel.bulkCreate(labelArray, {
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
  },
  getSameLabel: async(data) => {
    return sql_conn.labelConfigModel.findAll({
        where: Sequelize.and(
            {'lc_name':data.lc_name},
            {'domain_id': data.domain_id},
            {'project_id':data.project_id}
        )
    }).catch(console.error);
}
}

module.exports = { labelConfigDetails }