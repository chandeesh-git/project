'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const componentDetails = {
	createComponent: async data => {
		if (data.domain_id) {
            return sql_conn.globalComponentConfig.create(data).catch(console.error);
        } else {
            console.log("domain details not found")
        }
	},

	componentLists: async (data) => {
		return sql_conn.globalComponentConfig.findAll({
			where: Sequelize.and(
				{ 'cp_type': data.cp_type },
				{'domain_id': data.domain_id},
				{ 'is_active': true },
			)
		}).catch(console.error);
	},

	updateComponent: async data => {
		return sql_conn.globalComponentConfig.update({
			'cp_name': data.cp_name,
			'cp_description': data.cp_description,
			'cp_color': data.cp_color,
			'updated_by': data.acct_id
		}, {
			where:Sequelize.and({
				'id': data.global_component_id,
				'domain_id': data.domain_id,
			})
		}).catch(console.error);
	},

	deleteComponent: async data => {
		return sql_conn.globalComponentConfig.update({
			'is_active': false,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and(
                {'id': data.global_component_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},
	insertDefaultComponent: async (componentData) => {
		return sql_conn.globalComponentConfig.bulkCreate(componentData, {
			updateOnDuplicate: ['domain_id']
		}).catch(console.error);
	},

	getComponentById: async data => {
		return sql_conn.globalComponentConfig.findOne({
			where: Sequelize.and(
				{'id': data.global_component_id},
                {'domain_id':data.domain_id}
            )
		})
	},
	componentDomainDetailsList: async(domain_id) => {
		return sql_conn.globalComponentConfig.findAll({
			where: {
				'domain_id':domain_id,
				'is_active': true
			}
		})
	},
	componentDomainDetails: async(data) => {
        let result;
        const query = `SELECT * FROM global_component_config where domain_id ="${data.domain_id}" and is_active=1 `
        result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result;
	},
	getSameComponent: async(data) => {
        return sql_conn.globalComponentConfig.findAll({
            where: Sequelize.and(
                {'cp_name':data.cp_name},
                {'domain_id': data.domain_id},
                {'cp_type':data.cp_type},
                {'is_active': true}
            )
        }).catch(console.error);
    },
    compNameDetailsWhileUpdate: async(data) => {
        return sql_conn.globalComponentConfig.findAll({
            where: Sequelize.and(
                {'cp_name':data.cp_name},
                {'cp_type':data.cp_type},
                {'is_active': true},
                {'domain_id': data.domain_id},
                {'id': 
                    {[Op.ne]: data.global_component_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { componentDetails };

