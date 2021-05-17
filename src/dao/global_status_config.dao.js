'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const statusDetails = {
	addTest: async data => {
		if (data.domain_id) {
            return sql_conn.globalStatusConfig.create(data).catch(console.error);
        } else {
            console.log("domain details not found")
        }
	},

	getLists: async (data) => {
		return sql_conn.globalStatusConfig.findAll({
			where: Sequelize.and(
				{ 'domain_id': data.domain_id },
				{ 'sc_type': data.sc_type },
				{ 'is_active': true },
			)
		}).catch(console.error);
	},

	updateConfigStatus: async data => {
		return sql_conn.globalStatusConfig.update({
			'sc_name': data.sc_name,
			'sc_description': data.sc_description,
			'sc_color': data.sc_color,
			'updated_by': data.acct_id
		}, {
			where:Sequelize.and({
				'id': data.global_status_id,
				'domain_id': data.domain_id,
			})
		}).catch(console.error);
	},

	removeConfigStatus: async data => {
		return sql_conn.globalStatusConfig.update({
			'is_active': false,
			'updated_by': data.user
		}, {
			where: Sequelize.and(
                {'id': data.global_status_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},
	insertGlobalConfigStatus: async (arrayData) => {
		console.log("DATA = "+JSON.stringify(arrayData));
		return sql_conn.globalStatusConfig.bulkCreate(arrayData, {
			updateOnDuplicate: ['domain_id']
		}).catch(console.error);
	},

	getStatusById: async data => {
		return sql_conn.globalStatusConfig.findOne({
			where: Sequelize.and(
				{'id': data.global_status_id},
                {'domain_id':data.domain_id}
            )
		})
	},
	statusDomainDetailsList: async (domain_id) => {
		return sql_conn.globalStatusConfig.findAll({
			where: {
				 'domain_id': domain_id ,
				 'is_active': true ,
			}
		}).catch(console.error);
	},
	getStatusAll: async (data) => {
		return sql_conn.globalStatusConfig.findAll({
			where: Sequelize.and(
				{ 'domain_id': data.domain_id },
				{ 'is_active': true },
			)
		}).catch(console.error);
	},

	statusDomainDetails: async(data) => {
        let result;
        const query = `SELECT * FROM global_status_config where domain_id ="${data.domain_id}" and is_active=1 `
        result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result;
	  },
	  
	getSameStatus: async(data) => {
        return sql_conn.globalStatusConfig.findAll({
            where: Sequelize.and(
                {'sc_name':data.sc_name},
                {'domain_id': data.domain_id},
                {'sc_type':data.sc_type},
                {'is_active': true}
            )
        }).catch(console.error);
    },
    statusNameDetailsWhileUpdate: async(data) => {
        return sql_conn.globalStatusConfig.findAll({
            where: Sequelize.and(
                {'sc_name':data.sc_name},
                {'sc_type':data.sc_type},
                {'is_active': true},
                {'domain_id': data.domain_id},
                {'id': 
                    {[Op.ne]: data.global_status_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { statusDetails };

