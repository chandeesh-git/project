'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const componentDetails = {
	createComponent: async data => {
		if (data.project_id) {
			let compData = await sql_conn.projectModel.findOne({
				where: Sequelize.and({
					'project_id': data.project_id
				},
					{ 'domain_id': data.domain_id }
				)
			})
			if (compData) {
				return sql_conn.componentConfigModel.create(data).catch(console.error);
			} else {
				console.log("project details not found")
			}
		}
	},

	componentLists: async (data) => {
		return sql_conn.componentConfigModel.findAll({
			where: Sequelize.and(
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id },
				{ 'cp_type': data.cp_type },
				{ 'is_active': true },
			)
		}).catch(console.error);
	},

	updateComponent: async data => {
		return sql_conn.componentConfigModel.update({
			'cp_name': data.cp_name,
			'cp_description': data.cp_description,
			'cp_color': data.cp_color,
			'updated_by': data.acct_id
		}, {
			where:Sequelize.and({
				'id': data.component_id,
				'project_id': data.project_id,
				'domain_id': data.domain_id,
			})
		}).catch(console.error);
	},

	deleteComponent: async data => {
		return sql_conn.componentConfigModel.update({
			'is_active': false,
			'updated_by': data.acct_id
		}, {
			where: Sequelize.and(
                {'id': data.component_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},
	insertComponent: async (componentData) => {
		console.log("DATA = "+JSON.stringify(componentData));
		return sql_conn.componentConfigModel.bulkCreate(componentData, {
			updateOnDuplicate: ['project_id', 'domain_id']
		}).catch(console.error);
	},

	getComponentById: async data => {
		return sql_conn.componentConfigModel.findOne({
			where: Sequelize.and(
				{'id': data.component_id},
                {'project_id':data.project_id},
                {'domain_id':data.domain_id}
            )
		})
	},
	getSameComponent: async(data) => {
        return sql_conn.componentConfigModel.findAll({
            where: Sequelize.and(
                {'cp_name':data.cp_name},
				{'domain_id': data.domain_id},
				{'project_id':data.project_id},
                {'cp_type':data.cp_type},
                {'is_active': true}
            )
        }).catch(console.error);
    },
    compNameDetailsWhileUpdate: async(data) => {
        return sql_conn.componentConfigModel.findAll({
            where: Sequelize.and(
                {'cp_name':data.cp_name},
				{'cp_type':data.cp_type},
				{'project_id':data.project_id},
                {'is_active': true},
                {'domain_id': data.domain_id},
                {'id': 
                    {[Op.ne]: data.component_id}
                }
            )
        }).catch(console.error);
    },
}

module.exports = { componentDetails };

