
'use strict';

var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");


const testcaseDetailsMaster = {
    addTestcaseDetails: async data => {
		return sql_conn.testcaseDetailsModel.create(data).catch(console.error);
	},
	updateTescaseKey: async data => {
		return sql_conn.testcaseDetailsModel.update(data,{
			where: {
				'id':data.id
			}
		}).catch(console.error);
	},
	testcaseHistory: async data =>{
		let result;
		const sql_statement = `
		SELECT TSVM.doc_id, TSVM.version, TSVM.is_lock,TSVM.created_by,TSVM.created_at,TSVM.updated_at,TSVM.testcase_detail_id
		FROM testcase_details as TSD
		left join testcase_version_mapping as TSVM on TSD.id=TSVM.testcase_detail_id
		where TSD.id=${data.testcase_id} and TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}" and TSD.is_active=1 order by TSVM.created_at desc`
		result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		if(result && result.length>0){
			return result
		} else{
			return result=[]
		}
	},
	addTestcaseLogs: async data => {
		return sql_conn.testLogs.create(data).catch(console.error);
	},

	showLogs: async data =>{
		let result;
		const sql_statement = `
		SELECT * FROM test_logs where test_id=${data.testcase_id} and version="${data.version}" and test_type="testcase" order by created_at desc`
		result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		if(result && result.length>0){
			return result
		} else{
			return result=[]
		}
	},
}

module.exports = { testcaseDetailsMaster }