'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const priorityConfigDetails = {
    //add global priority
    addPriorityConfig: async data => {
        if(data.domain_id){
            return sql_conn.globalPriorityConfig.create(data).catch(console.error);
        } else {
            console.log("Please enter valid domain")
        }		
    },
    //get global priority config by ID
    getPriorityConfigById: async data => {
		return sql_conn.globalPriorityConfig.findOne({
			where: Sequelize.and(
				{'id': data.global_priority_id},
                {'domain_id':data.domain_id}
            )
		}).catch(console.error);
    },
    //get all global priority list
    getAllPriorityList: async data => {
		return sql_conn.globalPriorityConfig.findAll({
			where: Sequelize.and(
                {'domain_id':data.domain_id},                
                {'priority_type':data.priority_type},
                {'is_active': true}
            )
		}).catch(console.error);
    },
    priorityDomainDetailsList: async(domain_id) => {
        return sql_conn.globalPriorityConfig.findAll({
			where: {
                'domain_id': domain_id,                
                'is_active': true
            }
		}).catch(console.error);
    },
    //bulk insert default values 
    insertDefaultPriority: async (priorityData) => {
		console.log("DATA = "+JSON.stringify(priorityData));
		return sql_conn.globalPriorityConfig.bulkCreate(priorityData,{
			updateOnDuplicate: ['domain_id']
		}).catch(console.error);
	},
    //update global Priority
    editPriorityConfig: async data => {
        return sql_conn.globalPriorityConfig.update(data,{
            where:Sequelize.and(
                {'id': data.global_priority_id},
                {'domain_id':data.domain_id}
            )
        }).catch(console.error);
    },
    //delete global priority by id
    deletePriorityConfig: async data => {
		return sql_conn.globalPriorityConfig.update(
            {
                'is_active':false,
                'updated_by':data.user
            },
            {
			where: Sequelize.and(
                {'id': data.global_priority_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
    },
    
    priorityDaoDomainDetails: async(data) => {
        let result;
        const query = `SELECT * FROM global_priority_config where domain_id ="${data.domain_id}" and is_active=1 `
        result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result;
      },
    getSamePriority: async(data) => {
        return sql_conn.globalPriorityConfig.findAll({
            where: Sequelize.and(
                {'pc_name':data.pc_name},
                {'domain_id': data.domain_id},
                {'priority_type':data.priority_type},
                {'is_active': true}
            )
        }).catch(console.error);
    },
    priorityNameDetailsWhileUpdate: async(data) => {
        console.log("data",data);
        return sql_conn.globalPriorityConfig.findAll({
            where: Sequelize.and(
                {'pc_name':data.pc_name},
                {'priority_type':data.priority_type},
                {'is_active': true},
                {'domain_id': data.domain_id},
                {'id': 
                    {[Op.ne]: data.global_priority_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { priorityConfigDetails }