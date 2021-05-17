'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const globalEnvConfigDetails = {
    //add global evnvironment
    addGlobalEnvConfig: async data => {
        if(data.domain_id){
            return sql_conn.globalEnvironmentConfig.create(data).catch(console.error);
        } else {
            console.log("Domain details not found");
        }		
    },
    //get global environment config by ID
    globalEnvConfigId: async data => {
		return sql_conn.globalEnvironmentConfig.findOne({
			where: Sequelize.and(
				{'id': data.global_env_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //get all global env list
    allGlobalEnvList: async data => {
		return sql_conn.globalEnvironmentConfig.findAll({
			where: Sequelize.and(
                {'is_active':true},
                {'domain_id':data.domain_id}
            )
		})
    },
    //update global Env
    editGlobalEnvConfig: async data => {
        return sql_conn.globalEnvironmentConfig.update(data,{
            where:Sequelize.and(
            {'id': data.global_env_id},
            {'domain_id':data.domain_id}
            )
        }).catch(console.error);
    },
    //delete global env by id
    deleteGlobalEnvConfig: async data => {
		return sql_conn.globalEnvironmentConfig.update({
            'is_active':false,
            'updated_by':data.acct_id
        },{
			where: Sequelize.and(
                {'id': data.global_env_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
    },
    //bulk insert default values 
    insertDefaultEnvironment: async (environmentData) => {
        console.log("DATA = "+JSON.stringify(environmentData));
        return sql_conn.globalEnvironmentConfig.bulkCreate(environmentData,{
            updateOnDuplicate: ['domain_id']
        }).catch(console.error);
    },
    environmentDomainDetails: async(data) => {
        let result;
        const query = `SELECT * FROM global_environment_config where domain_id ="${data.domain_id}" and is_active=1 `
        result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result;
      },
    
    getSameEnv: async(data) => {
        return sql_conn.globalEnvironmentConfig.findAll({
            where: Sequelize.and(
                {'ec_name':data.ec_name},
                {'domain_id': data.domain_id},
                {'is_active': true}
            )
        }).catch(console.error);
    },
    envNameDetailsWhileUpdate: async(data) => {
        return sql_conn.globalEnvironmentConfig.findAll({
            where: Sequelize.and(
                {'ec_name':data.ec_name},
                {'is_active': true},
                {'domain_id': data.domain_id},
                {'id': 
                    {[Op.ne]: data.global_env_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { globalEnvConfigDetails }