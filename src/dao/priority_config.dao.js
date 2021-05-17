'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");

const priorityConfigDetails = {
    //add label
    addPriorityConfig: async data => {
        let projectData = await sql_conn.projectModel.findOne({
            where: Sequelize.and(
                { 'project_id':data.project_id },
                { 'domain_id':data.domain_id })
            })
        if(projectData){
            return sql_conn.priorityConfigModel.create(data).catch(console.error);
        } else {
            console.log("project details not found")
        }		
    },
    //get priority config by ID
    getPriorityConfigById: async data => {
		return sql_conn.priorityConfigModel.findOne({
			where: Sequelize.and(
				{'id': data.priority_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //get all priority list
    getAllPriorityList: async data => {
		return sql_conn.priorityConfigModel.findAll({
			where: Sequelize.and(
                {'project_id':data.project_id},
                {'domain_id':data.domain_id},                
                {'priority_type':data.priority_type},
                {'is_active': true}
            )
		})
    },
    //bulk insert default values 
    insertDefaultPriority: async (priorityData) => {
        console.log("data priority==>",priorityData);
		console.log("DATA = "+JSON.stringify(priorityData));
		return sql_conn.priorityConfigModel.bulkCreate(priorityData,{
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
	},
    //update Priority
    editPriorityConfig: async data => {
        return sql_conn.priorityConfigModel.update(data,{
            where:Sequelize.and(
            {'id': data.priority_id},
            {'project_id':data.project_id},
            {'domain_id':data.domain_id}
            )
        }).catch(console.error);
    },
    //delete priority by id
    deletePriorityConfig: async data => {
		return sql_conn.priorityConfigModel.update(
            {
                'is_active':false
            },
            {
			where: Sequelize.and(
                {'id': data.priority_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
    },
    getSamePriority: async(data) => {
        return sql_conn.priorityConfigModel.findAll({
            where: Sequelize.and(
                {'pc_name':data.pc_name},
				{'domain_id': data.domain_id},
				{'project_id':data.project_id},
                {'priority_type':data.priority_type},
                {'is_active': true}
            )
        }).catch(console.error);
    },
    priorityNameDetailsWhileUpdate: async(data) => {
        return sql_conn.priorityConfigModel.findAll({
            where: Sequelize.and(
                {'pc_name':data.pc_name},
				{'priority_type':data.priority_type},
                {'project_id':data.project_id},
                {'domain_id': data.domain_id},
                {'is_active': true},
                {'id': 
                    {[Op.ne]: data.priority_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { priorityConfigDetails }