'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");

const envConfigDetails = {
    //add evnvironment
    addEnvConfig: async data => {
        let projectData = await sql_conn.projectModel.findOne({
            where: Sequelize.and(
                { 'project_id':data.project_id },
                { 'domain_id':data.domain_id })
            })
        if(projectData){
            return sql_conn.environmentConfigModel.create(data).catch(console.error);
        } else {
            console.log("project details not found")
        }		
    },
    //get environment config by ID
    getEnvConfigById: async data => {
		return sql_conn.environmentConfigModel.findOne({
			where: Sequelize.and(
				{'id': data.env_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //get all env list
    getAllEnvList: async data => {
		return sql_conn.environmentConfigModel.findAll({
			where: Sequelize.and(
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //update Env
    editEnvConfig: async data => {
        return sql_conn.environmentConfigModel.update(data,{
            where:Sequelize.and(
            {'id': data.env_id},
            {'project_id':data.project_id},
            {'domain_id':data.domain_id}
            )
        }).catch(console.error);
    },
    //delete env by id
    deleteEnvConfig: async data => {
		return sql_conn.environmentConfigModel.destroy({
			where: Sequelize.and(
                {'id': data.env_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
    },
    insertEnvironment: async (environmentData) => {
		console.log("DATA = "+JSON.stringify(environmentData));
		return sql_conn.environmentConfigModel.bulkCreate(environmentData, {
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
    },
    getSameEnv: async(data) => {
        return sql_conn.environmentConfigModel.findAll({
            where: Sequelize.and(
                {'ec_name':data.ec_name},
                {'domain_id': data.domain_id},
                {'project_id':data.project_id}
            )
        }).catch(console.error);
    },
    envNameDetailsWhileUpdate: async(data) => {
        return sql_conn.environmentConfigModel.findAll({
            where: Sequelize.and(
                {'ec_name':data.ec_name},
                {'domain_id': data.domain_id},
                {'project_id':data.project_id},
                {'id': 
                    {[Op.ne]: data.env_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { envConfigDetails }