'use strict';


var TestCase = require('../../db/mongoose_models/testcase');
var TestCycle = require('../../db/mongoose_models/testcycle');
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const reportDetails = {


	getLists: async (data) => {
		return sql_conn.globalStatusConfig.findAll({
			where: Sequelize.and(
				{ 'domain_id': data.domain_id },
				{ 'sc_type': data.sc_type },
				{ 'is_active': true },
			)
		}).catch(console.error);
	},
	testcaseDocDetails: async (docId) => {
		let testcases = await TestCase.findOne({
			'_id': docId
		});
		return testcases;
	},

	fetchConfigStatus: async (data) => {
		let result;
		const sql_statement = `
		SELECT sc_name FROM status_config_master where domain_id="${data.domain_id}" and project_id=${data.project_id} and  sc_type="testexecution" and is_active=1 `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},
	fetchCycleList: async data => {
		let endDate = new Date(data.end_date);
		endDate.setDate(endDate.getDate() + 1);
		console.log(endDate)
		let testcycles = await TestCycle.find({
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'environment': data.environment,
			'is_active': true,
			"createdAt": { $gte: new Date(data.start_date), $lte: new Date(endDate) }
		});
		return testcycles;
	},
	fetchIssueTypes: async (execution_id) => {
		let result;
		const sql_statement = `
        SELECT issue_type,issue_priority FROM jira_issues where  test_id="${execution_id}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result
	},

	fetchTestcaseCount: async (data) => {
		let count = data.count ? data.count : 10;
		if (data.search_type == "executed") {
			let result;
			const sql_statement = `
			SELECT TED.testcase_id,TSD.name,(select count(testcase_id)  from test_execution_details where testcase_id=TED.testcase_id and
			 project_id=${data.project_id} and domain_id="${data.domain_id}" ) as total_no
 			FROM test_execution_details as TED left join testcase_details as TSD on TED.testcase_id=TSD.id
			where TED.project_id=${data.project_id} and TED.domain_id="${data.domain_id}"  group by TED.testcase_id order by total_no desc limit ${count} `
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			console.log("result==>", result)
			return result
		} else {
			let result;
			const sql_statement = `
			SELECT TED.testcase_id,TSD.name,(select count(testcase_id)  from test_execution_details where testcase_id=TED.testcase_id and 
			execution_status="${data.search_type}" and project_id=${data.project_id} and domain_id="${data.domain_id}" ) as total_no FROM test_execution_details as TED left join testcase_details as TSD on TED.testcase_id=TSD.id
			where TED.project_id=${data.project_id} and TED.domain_id="${data.domain_id}"  group by TED.testcase_id order by total_no desc limit ${count}  `
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			console.log("result==>", result)
			return result
		}
	},
	logsCount: async (data) => {
		if (data.last_days == "custom") {
			let endDate = new Date(data.end_date);
			endDate.setDate(endDate.getDate() + 1);
			let end_date = endDate.toISOString().substr(0, 10)
			let result;
			const sql_statement = `
        	SELECT count(id) as total_count FROM execution_logs where project_id=${data.project_id} and domain_id="${data.domain_id}" 
			and date_format(created_at, "%Y-%m-%d")  >="${data.start_date}"  and date_format(created_at, "%Y-%m-%d")  <="${data.end_date}" order by created_at desc`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		} else {
			let result;
			const sql_statement = `
        	SELECT count(id) as total_count FROM execution_logs where project_id=${data.project_id} and domain_id="${data.domain_id}" 
			and created_at  >= (CURDATE() - INTERVAL ${data.last_days} DAY ) order by created_at desc`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		}
	},
	activityLogs: async (data) => {
		if (data.last_days == "custom") {
			let count = data.count ? data.count : 0
			let record_limit = data.record_limit ? data.record_limit : 10
			let offset = record_limit * count;
			let result;
			const sql_statement = `
       		 SELECT status,status_color,tested_by,detail,execution_id,date_format(created_at, "%Y-%m-%d") as created_at,created_at as 
			create_date FROM execution_logs where project_id=${data.project_id} and domain_id="${data.domain_id}" 
			and date_format(created_at, "%Y-%m-%d")  >="${data.start_date}"  and date_format(created_at, "%Y-%m-%d")  <="${data.end_date}"  order by create_date desc limit ${offset}, ${record_limit}`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		} else {
			let count = data.count ? data.count : 0
			let record_limit = data.record_limit ? data.record_limit : 10
			let offset = record_limit * count;
			let result;
			const sql_statement = `
       		 SELECT status,status_color,tested_by,detail,execution_id,date_format(created_at, "%Y-%m-%d") as created_at,created_at as 
			create_date FROM execution_logs where project_id=${data.project_id} and domain_id="${data.domain_id}" 
			and created_at  >= (CURDATE() - INTERVAL ${data.last_days} DAY ) order by create_date desc limit ${offset}, ${record_limit}`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		}
	},

	statisticsExecutionData: async (data) => {
		if (data.last_days == "custom") {
			let result;
			const sql_statement = `
        	SELECT execution_status,TED.updated_at,date_format(updated_at, "%Y-%m-%d") as updated_date FROM test_execution_details as TED  
			where   project_id=${data.project_id}  and domain_id="${data.domain_id}" and date_format(updated_at, "%Y-%m-%d") >="${data.start_date}" and 
			date_format(updated_at, "%Y-%m-%d")<="${data.end_date}"
			order by updated_date Desc `
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		} else {
			let result;
			const sql_statement = `
        	SELECT execution_status,TED.updated_at,date_format(updated_at, "%Y-%m-%d") as updated_date FROM test_execution_details as TED  
			where   project_id=${data.project_id}  and domain_id="${data.domain_id}" and created_at  >= (CURDATE() - INTERVAL ${data.last_days} DAY ) 
			order by updated_date Desc `
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		}
	},

	liveStatistics: async (data) => {
		if (data.last_days == "custom") {
			let result;
			const sql_statement = `
        	SELECT status,status_color,tested_by,detail,execution_id,date_format(created_at, "%Y-%m-%d") as created_at,created_at as create_date FROM execution_logs where project_id=${data.project_id} and domain_id="${data.domain_id}" 
			and date_format(created_at, "%Y-%m-%d")  >="${data.start_date}"  and date_format(created_at, "%Y-%m-%d")  <="${data.end_date}"  order by create_date desc`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		} else {
			let result;
			const sql_statement = `
        	SELECT status,status_color,tested_by,detail,execution_id,date_format(created_at, "%Y-%m-%d") as created_at,created_at as create_date FROM execution_logs where project_id=${data.project_id} and domain_id="${data.domain_id}" 
			and created_at  >= (CURDATE() - INTERVAL ${data.last_days} DAY ) order by create_date desc`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		}
	},

}

module.exports = { reportDetails };

