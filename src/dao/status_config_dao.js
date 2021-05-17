'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const statusDetails = {
	addTest: async data => {
		if (data.project_id) {
			let statusData = await sql_conn.projectModel.findOne({
				where: Sequelize.and({
					'project_id': data.project_id
				},
					{ 'domain_id': data.domain_id }
				)
			})
			if (statusData) {
				return sql_conn.statusConfigModel.create(data).catch(console.error);
			} else {
				console.log("project details not found")
			}
		}
	},

	getLists: async (data) => {
		return sql_conn.statusConfigModel.findAll({
			where: Sequelize.and(
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id },
				{ 'sc_type': data.sc_type },
				{ 'is_active': 1 },
			)
		}).catch(console.error);
	},

	updateConfigStatus: async data => {
		return sql_conn.statusConfigModel.update({
			'sc_name': data.sc_name,
			'sc_description': data.sc_description,
			'sc_color': data.sc_color,
			'updated_by': data.acct_id
		}, {
			where:Sequelize.and({
				'id': data.config_status_id,
				'project_id': data.project_id,
				'domain_id': data.domain_id,
			})
		}).catch(console.error);
	},

	removeConfigStatus: async data => {
		return sql_conn.statusConfigModel.update({
			'is_active': 2,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and(
                {'id': data.config_status_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},
	insertConfigStatus: async (arrayData) => {
		console.log("DATA = "+JSON.stringify(arrayData));
		return sql_conn.statusConfigModel.bulkCreate(arrayData, {
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
	},

	getStatusById: async data => {
		return sql_conn.statusConfigModel.findOne({
			where: Sequelize.and(
				{'id': data.config_status_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
	},
	getSameStatus: async(data) => {
        return sql_conn.statusConfigModel.findAll({
            where: Sequelize.and(
                {'sc_name':data.sc_name},
				{'domain_id': data.domain_id},
				{'project_id':data.project_id},
                {'sc_type':data.sc_type},
                {'is_active': true}
            )
        }).catch(console.error);
    },
    statusNameDetailsWhileUpdate: async(data) => {
        return sql_conn.statusConfigModel.findAll({
            where: Sequelize.and(
                {'sc_name':data.sc_name},
				{'sc_type':data.sc_type},
				{'project_id':data.project_id},
                {'is_active': true},
                {'domain_id': data.domain_id},
                {'id': 
                    {[Op.ne]: data.config_status_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { statusDetails };

