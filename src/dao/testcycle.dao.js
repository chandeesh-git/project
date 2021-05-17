'use strict';

var TestCycle = require('../../db/mongoose_models/testcycle');
const { sequelize } = require('../../db/sequelize_models/index');
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
// const sequelize = new Sequelize("mysql::memory:");

const testcycleDetails = {
	add: async data => {
		let testcycle = await new TestCycle(data).save();
		return testcycle;
	},
	testcycleDetailById: async data => {
		let testcycle = await TestCycle.findOne({
			'_id': data.testcycle_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true
		});
		return testcycle;
	},
	list: async data => {
		let testcycles = await TestCycle.find({
			'acct_id': data.acct_id,
			'project_id': data.project_id,
			'is_active': true
		});
		return testcycles;
	},
	listTestcase: async data => {
		let result;
		const sql_statement = `SELECT TSD.id, TSD.priority,PCM.priority_color, TSD.test_key, TSD.name, TSD.last_execution,TSD.created_at,
		(SELECT doc_id FROM testcase_version_mapping where testcase_detail_id=TSD.id order by version desc limit 1) AS doc_id,
		(SELECT group_concat(version) FROM testcase_version_mapping where testcase_detail_id=TSD.id 
		order by version desc limit 1) AS version_list FROM testcase_details as TSD 
		left join priority_config_master as PCM on PCM.pc_name = TSD.priority and PCM.project_id = TSD.project_id and PCM.domain_id = TSD.domain_id and PCM.priority_type ="testcase" and PCM.is_active=1
		where TSD.project_id = ${data.project_id} and 
		TSD.domain_id = "${data.domain_id}" and  TSD.is_active=1 and TSD.submit_status=1 and (TSD.folder_id is null or TSD.folder_id= '')`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	delete: async data => {
		let testcycle = await TestCycle.updateOne({
			'_id': data.testcycle_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id
		}, {
			$set: {
				'is_active': false
			}
		});
		return testcycle;
	},

	deleteTestcycle: async (data) => {
		return sql_conn.folderTestMapping.update({
			'is_active': false,
			'updated_by': data.acct_id
		}, {
			where: {
				'doc_id': data.testcycle_id
			}
		}).catch(console.error);
	},
	update: async (testcycle_id, data) => {
		console.log(JSON.stringify(data));
		let testcycle = await TestCycle.updateOne({
			'_id': testcycle_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id
		}, {
			$set: data
		});
		return testcycle;
	},

	testcycleSearch: async data => {
		let testcycle = await TestCycle.find({
			'acct_id': data.acct_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true,
			'name': new RegExp(data.search_string, 'i')
		});
		return testcycle;
	},

	fetchTestcycleData: async data => {
		let result;
		const sql_statement = `
		SELECT id,doc_id, project_id, domain_id, folder_id,test_type
  		FROM folder_test_mapping
		where doc_id="${data.testcycle_id}" and project_id = ${data.project_id} and domain_id = "${data.domain_id}" and is_active = 1`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result
	},
	addTestcycleLogs: async data => {
		return sql_conn.testLogs.create(data).catch(console.error);
	},

	listFolder: async data => {
		let result;
		const sql_statement = `SELECT FD.id, folder_name,
		(SELECT COUNT(id) FROM testcase_details WHERE folder_id = FD.id and is_active=1 ) AS test_count
		FROM folder AS FD WHERE parent_folder_id = '' AND FD.project_id =${data.project_id} AND FD.domain_id ="${data.domain_id}" and FD.is_active=1 and FD.folder_category= "testcase"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	cycleCaseMapping: async (testcaseData) => {
		console.log("USER DATA = " + JSON.stringify(testcaseData));
		return sql_conn.testCycleCaseMapping.bulkCreate(testcaseData, {
		}).catch(console.error);
	},

	subFolderLists: async data => {
		let result;
		const sql_statement = `SELECT FD.id, folder_name,
		(SELECT COUNT(id) FROM testcase_details WHERE folder_id = FD.id and is_active=1 ) AS test_count
		FROM folder AS FD WHERE parent_folder_id = ${data.folder_id} AND FD.project_id =${data.project_id} AND FD.domain_id ="${data.domain_id}" and FD.is_active=1 and FD.folder_category= "testcase"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	subListTestcase: async data => {
		let result;
		const sql_statement = `SELECT TSD.id, TSD.priority,PCM.priority_color,TSD.test_key, TSD.name, TSD.last_execution,TSD.created_at,
		(SELECT doc_id FROM testcase_version_mapping where testcase_detail_id=TSD.id order by version desc limit 1) AS doc_id,
		(SELECT group_concat(version) FROM testcase_version_mapping where testcase_detail_id=TSD.id order 
		by version desc limit 1) AS version_list  FROM testcase_details as TSD 
		left join priority_config_master as PCM on PCM.pc_name = TSD.priority and PCM.project_id = TSD.project_id and PCM.domain_id = TSD.domain_id and PCM.priority_type ="testcase" and PCM.is_active=1
		where TSD.project_id = ${data.project_id} and 
		TSD.domain_id = "${data.domain_id}" and TSD.is_active=1 and TSD.submit_status=1 and TSD.folder_id=${data.folder_id}`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	cycleHistory: async data => {
		let result;
		const sql_statement = `SELECT * FROM test_logs where test_type ="testcycle" and test_id="${data.testcycle_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	cycleDeleteIssues: async (data) => {
		return sql_conn.issueModel.destroy({
			where: Sequelize.and(
				{ 'test_id': data.testcycle_id },
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id }
			)
		}).catch(console.error);
	},
	cyclePlanDeleteMapping: async (data) => {
		return sql_conn.planCycleModel.destroy({
			where: Sequelize.and(
				{ 'testcycle_id': data.testcycle_id },
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id },
			)
		}).catch(console.error);
	},
	cycleCaseDeleteMapping: async (data) => {
		return sql_conn.testCycleCaseMapping.destroy({
			where: Sequelize.and(
				{ 'testcycle_id': data.testcycle_id },
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id },
			)
		}).catch(console.error);
	},

	cycleIssues: async data => {
		let result;
		const sql_statement = `SELECT * FROM jira_issues where domain_id="${data.domain_id}" and project_id=${data.project_id} and 
		test_id="${data.testcycle_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	cyclePlanList: async data => {
		let result;
		const sql_statement = `SELECT * FROM  testplan_testcycle_mapping where testcycle_id="${data.testcycle_id}" and 
		project_id=${data.project_id} and domain_id="${data.domain_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	cycleCasesFetch: async data => {
		let result;
		const sql_statement = `SELECT *  FROM 
		testcycle_testcase_mapping where testcycle_id="${data.testcycle_id}" and project_id=${data.project_id} and domain_id="${data.domain_id}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	testcasesData: async (testcase_ids, version) => {
		let result;
		const sql_statement = `SELECT TSD.id,TSD.project_id , TSD.domain_id , TSD.name , TSD.priority , TSD.last_execution , TSD.updated_by ,TSD.created_by ,TSD.created_at 
		,TSD.updated_at ,TSVM.version, TSD.test_key,TSVM.doc_id FROM testcase_details as TSD left join testcase_version_mapping as TSVM on TSD.id=testcase_detail_id 
		where  TSD.id=${testcase_ids} and TSVM.version="${version}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	testcaseLists: async (data) => {
		if (data.testcycle_ids) {
			let testcycleIds = data.testcycle_ids.split(',')
			let testcycle = await TestCycle.find({
				'project_id': data.project_id,
				'domain_id': data.domain_id,
				'is_active': true,
				'_id': { "$in": testcycleIds }
			});
			return testcycle
		} else {
			let testcycle = await TestCycle.find({
				'project_id': data.project_id,
				'domain_id': data.domain_id,
				'is_active': true
			});
			return testcycle
		}
	},
	fetchCycleIssues: async (data) => {
		let result;
		const sql_statement = `SELECT * FROM jira_issues where domain_id="${data.domain_id}" and 
		project_id=${data.project_id} and test_id="${data.testcycle_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	addBulkIssues: async (bulkIssuesData) => {
		console.log("USER DATA = " + JSON.stringify(bulkIssuesData));
		return sql_conn.issueModel.bulkCreate(bulkIssuesData, {
		}).catch(console.error);
	},

	cloneCyclePlan: async (data) => {
		let result;
		const sql_statement = `SELECT * FROM testplan_testcycle_mapping where testcycle_id="${data.testcycle_id}" and 
		project_id=${data.project_id} and domain_id="${data.domain_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	addBulkCyclePlan: async (cyclePlanArray) => {
		console.log("USER DATA = " + JSON.stringify(cyclePlanArray));
		return sql_conn.planCycleModel.bulkCreate(cyclePlanArray, {
		}).catch(console.error);
	},

	cloneCycleCases: async (data) => {
		let result;
		const sql_statement = `SELECT * FROM testcycle_testcase_mapping where testcycle_id="${data.testcycle_id}" and 
		project_id=${data.project_id} and domain_id="${data.domain_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	addBulkCycleCases: async (cycleCasesArray) => {
		console.log("USER DATA = " + JSON.stringify(cycleCasesArray));
		return sql_conn.testCycleCaseMapping.bulkCreate(cycleCasesArray, {
		}).catch(console.error);
	},
	cycleCasesDetails: async data => {
		let result;
		const sql_statement = `SELECT *  FROM 
		testcycle_testcase_mapping where testcycle_id="${data.testcycle_id}" and project_id=${data.project_id} and domain_id="${data.domain_id}" and
		testcase_id="${data.testcase_id}"  and 	version="${data.version}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	fetchCycleDetails: async testcycle_id => {
		let testcycle = await TestCycle.findOne({
			'_id': testcycle_id,
		});
		return testcycle;
	},
	updateExecutionTime: async data => {
		let testcycle = await TestCycle.updateOne({
			'_id': data.testcycle_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id
		}, {
			$set: {
				'last_execution': data.last_execution
			}
		});
		return testcycle;
	},

	versionDetail: async data => {
		let result;
		const sql_statement = `SELECT doc_id,version FROM testcase_version_mapping where testcase_detail_id="${data.testcase_id}" and version="${data.version}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	testKeyDetail: async data => {
		let result;
		const sql_statement = `SELECT * FROM test_key where domain_id = "${data.domain_id}"  and project_id=${data.project_id} and test_type="testcycle"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	updateCycleKey: async (data, key_no) => {
		return sql_conn.testKeyModel.update({
			'test_count': key_no,
		}, {
			where: Sequelize.and({
				'domain_id': data.domain_id,
				'project_id': data.project_id,
				'test_type': "testcycle",
			})
		}).catch(console.error);
	},

	testCycleKeyDetails: async cycleKey => {
		return sql_conn.testKeyModel.create(cycleKey).catch(console.error);
	},

};

module.exports = { testcycleDetails };

