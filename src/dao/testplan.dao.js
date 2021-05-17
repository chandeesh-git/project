'use strict';

var TestPlan = require('../../db/mongoose_models/testplan');
var TestCycle = require('../../db/mongoose_models/testcycle');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
var sql_conn = require('../../db/sequelize_models');

const testplanDetails = {
	add: async data => {
		let testplan = await new TestPlan(data).save();
		return testplan;
	},
	testplanDetailById: async data => {
		let testplan = await TestPlan.findOne({
			'_id': data.testplan_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true
		});
		return testplan;
	},
	list: async data => {
		let testplans = await TestPlan.find({
			'acct_id': data.acct_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true
		});
		return testplans;
	},
	delete: async data => {
		let testplan = await TestPlan.updateOne({
			'_id': data.testplan_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id
		}, {
			$set: {
				'is_active': false
			}
		});
		return testplan;
	},
	deleteTestplan: async (data) => {
		return sql_conn.folderTestMapping.update({
			'is_active': false,
			'updated_by': data.acct_id
		}, {
			where: {
				'doc_id': data.testplan_id
			}
		}).catch(console.error);
	},
	update: async (testplan_id, data) => {
		console.log(JSON.stringify(data));
		let testplan = await TestPlan.updateOne({
			'_id': testplan_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id
		}, {
			$set: data
		});
		return testplan;
	},
	testplanSearch: async data => {
		let testplan = await TestPlan.find({
			'acct_id': data.acct_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true,
			'name': new RegExp(data.search_string, 'i')
		});
		return testplan;
	},
	addTestplanLogs: async data => {
		console.log("heelo we rrrrrrrrrrrrrrrrrrrrrrrr")
		return sql_conn.testLogs.create(data).catch(console.error);
	},

	testplanAttachment: async (attachmentSaverArray, attachmentCondition) => {
		console.log("attachmentSaverArray in the dao file ", attachmentSaverArray)
		console.log("attachmentCondition in the dao file ", attachmentCondition)
		let testplan = await TestPlan.updateOne({
			'_id': attachmentCondition.testplanID,
			'project_id': attachmentCondition.project_id,
			'domain_id': attachmentCondition.domain_id
		}, {
			$set: {
				'attachments': attachmentSaverArray
			}
		});
		console.log("update the attachments", testplan)
		return testplan;
	},

	planCycleMapping: async (testcycleData) => {
		console.log("USER DATA = " + JSON.stringify(testcycleData));
		return sql_conn.planCycleModel.bulkCreate(testcycleData, {
		}).catch(console.error);
	},
	planCycleDeleteMapping: async (data) => {
		return sql_conn.planCycleModel.destroy({
			where: Sequelize.and(
				{ 'testplan_id': data.testplan_id },
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id },
			)
		}).catch(console.error);
	},


	// fetchCyclePlan: async (data) => {
	// 	let result;
	// 	const sql_statement = `
	// 	SELECT group_concat(testcycle_id) as testcycle_ids  FROM testplan_testcycle_mapping where project_id=${data.project_id} and 
	// 	domain_id="${data.domain_id}" and testplan_id="${data.testplan_id}" `
	// 	result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
	// 	console.log("result==>",result)
	// 	return result
	// },

	fetchCyclePlan: async (data) => {
		let result;
		const sql_statement = `
		SELECT *  FROM testplan_testcycle_mapping where project_id=${data.project_id} and 
		domain_id="${data.domain_id}" and testplan_id="${data.testplan_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},

	cycleList: async (data) => {
		if (data.project_id) {
			console.log("project id is not null")
			let testcycle = await TestCycle.find({
				'project_id': { "$in": data.project_id },
				'domain_id': data.domain_id,
				'is_active': true,
				'name': new RegExp(data.cycle_name, 'i')
			});
			return testcycle
		} else {
			console.log("project id is null")
			let testcycle = await TestCycle.find({
				'domain_id': data.domain_id,
				'is_active': true,
				'name': new RegExp(data.cycle_name, 'i')
			});
			return testcycle
		}
	},


	cycleDetails: async (testcycle_ids, data) => {
		//console.log("it is comings here in the feilds")
		let testcycle = await TestCycle.findOne({
			'_id': testcycle_ids,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true
		});
		//	console.log("it is comings here in the feilds",testcycle)
		return testcycle;
	},
	history: async (data) => {
		let result;
		const sql_statement = `
		SELECT * FROM test_logs where test_type ="testplan" and test_id="${data.testplan_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},

	fetchPlanList: async (data) => {
		if (data.project_id) {
			console.log("project id is not null")
			let testplan = await TestPlan.find({
				'project_id': { "$in": data.project_id },
				'domain_id': data.domain_id,
				'is_active': true,
				'name': new RegExp(data.plan_name, 'i')
			});
			return testplan
		} else {
			console.log("project id is null")
			let testplan = await TestPlan.find({
				'domain_id': data.domain_id,
				'is_active': true,
				'name': new RegExp(data.plan_name, 'i')
			});
			return testplan
		}
	},

	planCycleDetails: async (testplan_ids, data) => {
		console.log("it is comings here ", testplan_ids)
		let testplan = await TestPlan.findOne({
			'_id': testplan_ids,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true
		});
		console.log("it is comings here in the feilds", testplan)
		return testplan;
	},
	testPlanKeyDetails: async planKey => {
		return sql_conn.testKeyModel.create(planKey).catch(console.error);
	},
	testPlanKeyDetail: async data => {
		let result;
		const sql_statement = `SELECT * FROM test_key where domain_id = "${data.domain_id}"  and project_id=${data.project_id} and test_type="testplan"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	updatePlanKey: async (data, key_no) => {
		return sql_conn.testKeyModel.update({
			'test_count': key_no,
		}, {
			where: Sequelize.and({
				'domain_id': data.domain_id,
				'project_id': data.project_id,
				'test_type': "testplan",
			})
		}).catch(console.error);
	},
};

module.exports = { testplanDetails };

