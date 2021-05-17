'use strict';
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const labelConfigDetails = {
    //add label
    addLabelConfig: async data => {
        if(data.domain_id){
            return sql_conn.globalLabelConfig.create(data).catch(console.error);
        } else {
            console.log("Domain not found")
        }		
    },
    //get label config by ID
    getLabelConfigById: async data => {
		return sql_conn.globalLabelConfig.findOne({
			where: Sequelize.and(
				{'id': data.global_label_id},
                {'domain_id':data.domain_id}
            )
		})
    },
    //get all label list
    getAllLabelList: async data => {
		return sql_conn.globalLabelConfig.findAll({
			where: Sequelize.and(
                {'domain_id':data.domain_id},
                {'is_active':true}
            )
		})
    },
    //delete label by id
    deleteLabelConfig: async data => {
		return sql_conn.globalLabelConfig.update(
            {
                'is_active':false,
                'updated_by':data.acct_id
            },{
			where: Sequelize.and(
                {'id': data.global_label_id},
                {'domain_id':data.domain_id}
			)
		}).catch(console.error);
    },
    labelDomainDetails: async(data) => {
        let result;
        const query = `SELECT * FROM global_label_config where domain_id ="${data.domain_id}" and is_active=1 `
        result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result;
    },
    getSameLabel: async(data) => {
        return sql_conn.globalLabelConfig.findAll({
            where: Sequelize.and(
                {'lc_name':data.lc_name},
                {'domain_id': data.domain_id},
                {'is_active': true}
            )
        }).catch(console.error);
    }
}

module.exports = { labelConfigDetails }