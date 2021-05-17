'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const projectDetails={
	checkProjectExist: async data => {
		return  sql_conn.projectModel.findOne({
			where: Sequelize.and(
				{ 'project_id':data.project_id},
				{'domain_id':data.domain_id}
			)
		}).catch(console.error)},		
	addProject:async data=>{
		return sql_conn.projectModel.create(data).catch(console.error);
	},
	deleteProject: async projectId=> {
		return sql_conn.projectModel.destroy({
			where: {
				'id': projectId
			}
		}).catch(console.error);
	},
	updateProject: async data => {
		return sql_conn.projectModel.update(data, {
			where: Sequelize.and(
				{ 'project_id':data.project_id},
				{'domain_id':data.domain_id}
			)
		}).catch(console.error);
	},
	getProject: async data => {
		return sql_conn.projectModel.findOne({
			where: Sequelize.and(
				{'project_id':data.project_id},
				{'domain_id':data.domain_id}
				),
			raw:true
		})
	},
	listProjects: async() => {
		return sql_conn.projectModel.findAll().catch(console.error);;
	},

	checkDomain: async data => {
		return  sql_conn.projectModel.findOne({
			where: Sequelize.and(
				{ 'domain_id':data.domain_id}
			)
		}).catch(console.error)},

	regionList: async () => {
	let result;
	const sql_statement = `
	SELECT * FROM app_credentials;`
	result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
	return result
	},

	getProjectData: async (data) => {
		let result;
		const sql_statement = `
		SELECT PP.id,PP.project_id,PP.inquest_pro_enabled as inquestPro_enabled,PP.permission_status,PP.story_enabled,PP.task_enabled,PP.bug_enabled, PP.epic_enabled,
		PP.subtask_enabled,PP.created_at, PP.updated_at,PP.domain_id,PP.acct_id,PP.region_id,APC.regions_name
		FROM project as PP
		left join app_credentials as APC on PP.region_id=APC.id
		where PP.project_id=${data.project_id} and PP.domain_id="${data.domain_id}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result
		},

};

module.exports = {projectDetails};

