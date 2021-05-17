'use strict';

var TestExecution = require('../../db/mongoose_models/testexecution');
var TestCycle = require('../../db/mongoose_models/testcycle');
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const testExecutionDetails = {
	addTestExecutions: async data => {
		return TestExecution.insertMany(data).catch(console.error);
	},
	addTestExecution: async data => {
		return new TestExecution(data).save();
	},
	markTestExecutionComplete: async testcaseId => {
		return TestExecution.updateMany({
			'testcase_id': testcaseId
		}, {
			$set: {
				'is_active': false
			}
		}).catch(console.error);
	},
	updateTestExecution: async (testexecutionId, data) => {
		return TestExecution.updateOne({
			'_id': testexecutionId
		}, {
			$set: data
		}).catch(console.error);
	},
	list: async data => {
		let testexecutions = await TestExecution.find({
			'assigned_to': data.acct_id,
			'project_id': data.project_id,
			'testcycle_id': data.testcycle_id,
			'testcase_id': data.testcase_id
		});
		return testexecutions;
	},

	runDetails: async data => {
		let testcycle = await TestCycle.findOne({
			'_id': data.testcycle_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true
		});
		return testcycle;
	},

	checkExecutionExists: async data => {
        let result;
        const sql_statement = `SELECT *  FROM 
        test_execution_details where testcycle_id="${data.testcycle_id}"  and
        testcase_id="${data.testcase_id}"  and  version="${data.version}" order by created_at desc`
        result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        return result;
    },

	testExecutionDetails: async (data,test_execution_id) => {
		let testexecution = await TestExecution.findOne({
			'_id': test_execution_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
		});
		return testexecution;
	},

	fetchIssue: async (data, test_execution_id) => {
		let result;
		const sql_statement = `
		SELECT * FROM jira_issues where domain_id="${data.domain_id}" and project_id=${data.project_id} and test_id="${test_execution_id}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},

	testexecutionAttachment: async (attachmentSaverArray, attachmentCondition) => {
		console.log("attachmentSaverArray in the dao file ", attachmentSaverArray)
		console.log("attachmentCondition in the dao file ", attachmentCondition)
		let testexecution = await TestExecution.updateOne({
			'_id': attachmentCondition.testExecutionID,
			'project_id': attachmentCondition.project_id,
			'domain_id': attachmentCondition.domain_id
		}, {
			$set: {
				'attachments': attachmentSaverArray
			}
		});
		console.log("update the attachments", testexecution)
		return testexecution;
	},
	addExecutionMapping: async data => {
		return sql_conn.testexecutionDetailsModel.create(data).catch(console.error);
	},
	testExecutionAdd: async data => {
		let testexecution = await new TestExecution(data).save();
		return testexecution;
	},

	updateTestExecution: async (testexecution_id, data) => {
		console.log(JSON.stringify(data));
		let testexecution = await TestExecution.updateOne({
			'_id': testexecution_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id
		}, {
			$set: data
		});
		return testexecution;
	},

	updateExecutionMapping: async (data) => {
		return sql_conn.testexecutionDetailsModel.update({
			'recorded_time':data.recorded_time,    
			'version':data.version,
			'execution_status': data.execution_status,
			'environment': data.environment,
			'updated_by': data.acct_id
		},{
			where:Sequelize.and({
				'testexecution_id': data.testexecution_id,
				'testcycle_id': data.testcycle_id,
				'testcase_id': data.testcase_id,
				'version': data.version,
			})
		}).catch(console.error);
	},

	updateCaseExecutionMapping: async (data) => {
		return sql_conn.testexecutionDetailsModel.update({
			'recorded_time':data.recorded_time,    
			'version':data.version,
			'execution_status': data.execution_status,
			'environment': data.environment,
			'updated_by': data.acct_id
		},{
			where:Sequelize.and({
				'testexecution_id': data.testexecution_id,
				'testcase_id': data.testcase_id,
				'version': data.version,
			})
		}).catch(console.error);
	},

	deleteIssues: async (data) => {
		return sql_conn.issueModel.destroy({
			where: Sequelize.and(
                {'test_id':data.testexecution_id },
                {'project_id':data.project_id},
				{'domain_id':data.domain_id},
			)
		}).catch(console.error);
	},

	userFromRole: async(data) => {
		let result;
		const sql_statement = `
		SELECT RS.id, user_name, jira_acct_id FROM roles  as RS
		left join user_role as USR on RS.id=USR.role_id 
		where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and USR.is_active=1 and RS.allow_testcycle_execute = 1`
		result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		if(result && result.length>0){
			return result
		} else{
			return result=[]
		}
	},

	usersFromGroup: async(data) => {
		let result;
		const sql_statement = `
		SELECT group_concat(GRP.id) as groupIds FROM roles as RS
		left join groups as GRP on RS.id=GRP.role_id 
		where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and GRP.is_active=1 and RS.allow_testcycle_execute=1`
		result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		if(result[0].groupIds!=null){
			let group_ids=result[0].groupIds
			let result_1
			const sql_statement = `
			SELECT * FROM user_group where group_id in (${group_ids})`
			result_1 =await  sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			if(result_1 && result_1.length>0){
				return result_1
			} else {
				return result=[]
			}
		} else{
			return result=[]
		}
	},
	checkUserRole: async (data) => {
        let result;
        const sql_statement = `
        SELECT * FROM cloudapp_users where acct_id="${data.acct_id}"`
        result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        console.log("result==>", result)
        return result
    },

    checkTestcaseAssigned: async (testcase_ids, version,data) => {
        let result;
        const sql_statement = `
        SELECT * FROM testcycle_testcase_mapping  where testcycle_id="${data.testcycle_id}" and testcase_id=${testcase_ids} and 
        version="${version}" and tester="${data.acct_id}"`
        result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        console.log("result==>", result)
        return result
	},
	testcaseExecutionRecord: async data => {
        let result;
        const sql_statement = `SELECT *  FROM 
		test_execution_details where  testcase_id="${data.testcase_id}"  and  version="${data.version}" and environment="${data.environment}" and  (testcycle_id='' or testcycle_id is null)
		order by created_at desc`
        result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        return result;
	},
	executionCasesDetails: async data => {
		let result;
		const sql_statement = `SELECT TSD.id,TSD.name, TSD.priority, TSD.is_active, TSD.created_at,TSD.updated_at, TSD.test_key,
		TSVM.doc_id , TSVM.version , TSVM.is_lock  FROM testcase_details as TSD 
	   left join testcase_version_mapping as TSVM on  TSD.id=TSVM.testcase_detail_id 
	   where  TSD.id=${data.testcase_id} and TSVM.version="${data.version}"`
		result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	fetchExecutionDetails: async testExecution_id => {
		let testexecutions = await TestExecution.findOne({
			'_id': testExecution_id
		});
		return testexecutions;
	},
	fetchFolderName: async folder_id => {
		let result;
		const sql_statement = `SELECT * FROM folder where id=${folder_id}`
		result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	testcaseDetailsFromCycle: async(data) => {
		let testcase = await TestCycle.findOne({
			'_id': data.testcycle_id
		});
		console.log("no of testcase",testcase);
		return testcase;	
	},
	testcaseDetailsFromMapping:async (testcase_id,data) => {
		let result;
		const sql_statement = `SELECT * FROM test_execution_details where testcase_id = ${testcase_id} and testcycle_id = "${data.testcycle_id}" order by created_at desc;`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		if(result && result.length > 0){
			return result;
		} else {
			return result = []
		}
	},
	testExecutionData: async(testcycle_id) => {
		let testExecution = await TestExecution.findOne({
			'_id':testcycle_id
		})
		console.log("testExecution===>",testExecution);
		return testExecution;
	},

	addExecutionActivity: async data => {
		return sql_conn.executionLogsModel.create(data).catch(console.error);
	},

	lastExecutionTestcase: async (data) => {
		return sql_conn.testCycleCaseMapping.update({
			'last_execution':data.last_execution,
			'updated_by': data.acct_id
		},{
			where:Sequelize.and({
				'testcycle_id': data.testcycle_id,
				'testcase_id': data.testcase_id,
				'version': data.version,
			})
		}).catch(console.error);
	},


};

module.exports = { testExecutionDetails };

