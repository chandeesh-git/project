'use strict';

var TestCase = require('../../db/mongoose_models/testcase');
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");


const testcaseDetails = {
	add: async data => {
		let testcase = await new TestCase(data).save();
		return testcase;
	},
	addIssues: async data => {
		return sql_conn.issueModel.create(data).catch(console.error);
	},
	deleteIssues: async (data) => {
		return sql_conn.issueModel.destroy({
			where: Sequelize.and(
				{ 'test_id': data.testcase_id },
				{ 'project_id': data.project_id },
				{ 'domain_id': data.domain_id },
				{ 'version': data.version }
			)
		}).catch(console.error);
	},

	fetchIssues: async (data, version) => {
		let result;
		const sql_statement = `
		SELECT * FROM jira_issues where domain_id="${data.domain_id}" and project_id=${data.project_id} and test_id=${data.testcase_id} and version="${version}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},
	updateAttachment: async (attachmentSaverArray, attachmentCondition) => {
		console.log("attachmentSaverArray in the dao file ", attachmentSaverArray)
		console.log("attachmentCondition in the dao file ", attachmentCondition)
		let testcase = await TestCase.updateOne({
			'_id': attachmentCondition.testcaseID,
			'project_id': attachmentCondition.project_id,
			'domain_id': attachmentCondition.domain_id
		}, {
			$set: {
				'attachments': attachmentSaverArray
			}
		});
		console.log("update the attachments", testcase)
		return testcase;
	},
	detail: async data => {
		let testcase = await TestCase.findOne({
			'_id': data.doc_id,
			'is_active': true
		});
		console.log("daooooooooooooooooo", testcase)
		return testcase;
	},
	testDetailLatest: async data => {
		let result;
		const sql_statement = `
		SELECT TSD.id,TSVM.doc_id, TSVM.version, TSVM.is_lock FROM testcase_details as TSD
		left join testcase_version_mapping as TSVM on TSD.id=TSVM.testcase_detail_id where TSD.id=${data.testcase_id} and TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}" and TSD.is_active=1 order by TSVM.created_at desc`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		if (result && result.length > 0) {
			return result
		} else {
			return result = []
		}
	},
	testDetailWithVersion: async data => {
		let result;
		const sql_statement = `
		SELECT TSD.id,TSVM.doc_id, TSVM.version, TSVM.is_lock FROM testcase_details as TSD
		left join testcase_version_mapping as TSVM on TSD.id=TSVM.testcase_detail_id where TSD.id=${data.testcase_id} and TSVM.version=${data.version} and TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		if (result && result.length > 0) {
			return result
		} else {
			return result = []
		}
	},
	list: async data => {
		let testcases = await TestCase.find({
			'acct_id': data.acct_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'is_active': true,
			'submit_status': true
		});
		return testcases;
	},
	delete: async data => {
		let testcase = await TestCase.updateOne({
			'_id': data.testcase_id
		}, {
			$set: {
				'is_active': false
			}
		});
		return testcase;
	},
	update: async (testcase_doc_id, data) => {
		console.log(JSON.stringify(data));
		let testcase = await TestCase.updateOne({
			'_id': testcase_doc_id
		}, {
			$set: data
		});
		return testcase;
	},
	updateTestCycle: async (data) => {
		return TestCase.updateMany({
			'_id': { $in: data.testcaseIds }
		}, {
			$addToSet: {
				'testcycles': data.testcycle_id
			}
		}).catch(console.error);
	},
	userFromCloudApp: async (data) => {
		let result;
		const sql_statement = `
			SELECT CAS.role_id, role_name, allow_testcase_create, allow_testcase_read, allow_testcase_edit, allow_testcase_delete, allow_testcase_archive, 
			allow_testcase_versions, allow_testcase_folders, allow_testplan_create, allow_testplan_edit, allow_testplan_view,
			allow_testplan_delete, allow_testplan_folders, allow_testcycle_create, allow_testcycle_edit, allow_testcycle_view, 
			allow_testcycle_execute, allow_testcycle_delete, allow_testcycle_folders, allow_reports_create, allow_configuration, is_active,acct_id,user_name
			FROM cloudapp_users as  CAS 
			left join roles as RLS on CAS.role_id=RLS.id where CAS.domain_id= "${data.domain_id}" and CAS.project_id=${data.project_id}`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result
	},
	userFromRole: async (data) => {
		if (data.test_type = 'testcase') {
			let result;
			const sql_statement = `
			SELECT RS.id, user_name, jira_acct_id FROM roles  as RS
			left join user_role as USR on RS.id=USR.role_id 
			where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and USR.is_active=1 and (RS.allow_testcase_create = 1 or RS.allow_testcase_read = 1 or RS.allow_testcase_edit = 1 or RS.allow_testcase_delete = 1 or RS.allow_testcase_folders = 1);`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			if (result && result.length > 0) {
				return result
			} else {
				return result = []
			}
		} else if (test_type = 'testplan') {
			let result;
			const sql_statement = `
			SELECT RS.id, user_name, jira_acct_id FROM roles  as RS
			left join user_role as USR on RS.id=USR.role_id 
			where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and USR.is_active=1 and (RS.allow_testcase_create = 1 or RS.allow_testcase_read = 1 or RS.allow_testcase_edit = 1 or RS.allow_testcase_delete = 1 or RS.allow_testcase_folders = 1);`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			if (result && result.length > 0) {
				return result
			} else {
				return result = []
			}
		} else {
			let result;
			const sql_statement = `
			SELECT RS.id, user_name, jira_acct_id FROM roles  as RS
			left join user_role as USR on RS.id=USR.role_id 
			where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and USR.is_active=1 and (RS.allow_testcase_create = 1 or RS.allow_testcase_read = 1 or RS.allow_testcase_edit = 1 or RS.allow_testcase_delete = 1 or RS.allow_testcase_folders = 1);`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			if (result && result.length > 0) {
				return result
			} else {
				return result = []
			}
		}
	},
	usersFromGroup: async (data) => {
		if (data.test_type = 'testcase') {
			let result;
			const sql_statement = `
			SELECT group_concat(GRP.id) as groupIds FROM roles as RS
			left join groups as GRP on RS.id=GRP.role_id 
			where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and GRP.is_active=1 and (RS.allow_testcase_create = 1 or RS.allow_testcase_read = 1 or RS.allow_testcase_edit = 1 or RS.allow_testcase_delete = 1 or RS.allow_testcase_folders = 1)`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			if (result[0].groupIds != null) {
				let group_ids = result[0].groupIds
				let result_1
				const sql_statement = `
				SELECT * FROM user_group where group_id in (${group_ids})`
				result_1 = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
				if (result_1 && result_1.length > 0) {
					return result_1
				} else {
					return result = []
				}
			} else {
				return result = []
			}
		} else if (data.test_type = 'testplan') {
			let result;
			const sql_statement = `
			SELECT group_concat(GRP.id) as groupIds FROM roles as RS
			left join groups as GRP on RS.id=GRP.role_id 
			where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and GRP.is_active=1 and (RS.allow_testplan_create = 1 or RS.allow_testplan_view = 1 or RS.allow_testplan_edit = 1 or RS.allow_testplan_delete = 1 or RS.allow_testplan_folders = 1)`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			if (result[0].groupIds != null) {
				let group_ids = result[0].groupIds
				let result_1
				const sql_statement = `
				SELECT * FROM user_group where group_id in (${group_ids})`
				result_1 = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
				if (result_1 && result_1.length > 0) {
					return result_1
				} else {
					return result = []
				}
			} else {
				return result = []
			}
		} else {
			let result;
			const sql_statement = `
			SELECT group_concat(GRP.id) as groupIds FROM roles as RS
			left join groups as GRP on RS.id=GRP.role_id 
			where RS.project_id= ${data.project_id} and RS.domain_id="${data.domain_id}" and RS.is_active=1 and GRP.is_active=1 and (RS.allow_testcycle_create = 1 or RS.allow_testcycle_view = 1 or RS.allow_testcycle_edit = 1 or RS.allow_testcycle_delete = 1 or RS.allow_testcycle_folders = 1)`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			if (result[0].groupIds != null) {
				let group_ids = result[0].groupIds
				let result_1
				const sql_statement = `
				SELECT * FROM user_group where group_id in (${group_ids})`
				result_1 = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
				if (result_1 && result_1.length > 0) {
					return result_1
				} else {
					return result = []
				}
			} else {
				return result = []
			}
		}
	},
	checkVersion: async (data) => {
		let result;
		const query = `SELECT * FROM testcase_version_mapping where testcase_detail_id="${data.testcase_id}" and version=${data.version} `
		result = await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		console.log("get the query data****************", result)
		return result;
	},

	updateTestcaseDetail: async (data) => {
		return sql_conn.testcaseDetailsModel.update({
			'name': data.name,
			'priority': data.priority,
			'folder_id': data.folder_id,
			'submit_status': data.submit_status,
			'updated_by': data.acct_id
		}, {
			where: {
				'id': data.testcase_id
			}
		}).catch(console.error);
	},
	updateTestcaseVersion: async (testcase_doc_id, data) => {
		console.log("updateTestcaseVersion============")
		return sql_conn.testcaseVersionModel.update({
			'is_lock': data.lock,
			'updated_by': data.acct_id
		}, {
			where: {
				'doc_id': testcase_doc_id
			}
		}).catch(console.error);
	},
	deleteTestcase: async (data) => {
		return sql_conn.testcaseDetailsModel.update({
			'is_active': false,
			'updated_by': data.acct_id
		}, {
			where: {
				'id': data.testcase_id
			}
		}).catch(console.error);
	},
	versionListData: async (data) => {
		let result;
		const query = `SELECT TSD.id,TVM.version,TVM.doc_id FROM testcase_details as TSD left join testcase_version_mapping as TVM on 
		TSD.id=TVM.testcase_detail_id where TSD.id="${data.testcase_id}" order by TVM.created_at asc  `
		result = await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	fetchTestcaseData: async data => {
		let result;
		const sql_statement = `
		SELECT TSD.id, project_id, domain_id, folder_id,name,priority, testcase_detail_id,doc_id,version,is_lock
  		FROM testcase_details as TSD
		left join testcase_version_mapping as TSVM on TSD.id=TSVM.testcase_detail_id
		where TSD.id=${data.testcase_id} and is_active=1`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result
	},
	testcaseSearch: async (data) => {
		let result;
		const query = `SELECT * FROM testcase_details where project_id =${data.project_id} and 
						domain_id ="${data.domain_id}" and name like "%${data.search_string}%" `
		result = sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	testcaseVersionCompare: async (obj_ids, data) => {
		let testcases = await TestCase.find({
			'acct_id': data.acct_id,
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'_id': { "$in": obj_ids }
		});
		return testcases;
	},
	testcaseLists: async data => {
		if (data.testcase_ids) {
			let result;
			const sql_statement = `
			SELECT TSD.id,TSVM.doc_id, TSVM.version, TSVM.is_lock FROM testcase_details as TSD left join testcase_version_mapping as TSVM 
			on TSD.id=TSVM.testcase_detail_id where TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}" and 
			TSD.is_active=1  and TSD.id in (${data.testcase_ids}) order by TSVM.created_at desc`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		} else {
			let result;
			const sql_statement = `
			SELECT TSD.id,TSVM.doc_id, TSVM.version, TSVM.is_lock FROM testcase_details as TSD
			left join testcase_version_mapping as TSVM on TSD.id=TSVM.testcase_detail_id where TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}" and TSD.is_active=1 order by TSVM.created_at desc`
			result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
			return result
		}
	},
	cloneLatestTest: async data => {
		let result;
		const sql_statement = `
        SELECT TSD.id,TSVM.doc_id, TSVM.version, TSVM.is_lock,TSD.name,TSD.domain_id, TSD.project_id,TSD.folder_id,
        TSD.priority,TSD.test_key FROM testcase_details as TSD left join testcase_version_mapping as TSVM on 
        TSD.id=TSVM.testcase_detail_id where TSD.id=${data.testcase_id} and TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}" and TSD.is_active=1 order by TSVM.created_at desc`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		if (result && result.length > 0) {
			return result
		} else {
			return result = []
		}
	},
	testcaseDocDetails: async (testcase_ids, data) => {
		let testcases = await TestCase.findOne({
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'_id': testcase_ids
		});
		return testcases;
	},
	updateOldVersion: async (data) => {
		return sql_conn.testcaseVersionModel.update({
			'is_lock': 1,
			'updated_by': data.acct_id
		}, {
			where: {
				'id': data.testcase_id
			}
		}).catch(console.error);
	},

	fetchOldDocId: async (data) => {
		let result;
		const sql_statement = `
		SELECT * FROM testcase_details as TSD left join testcase_version_mapping as TSVM on TSD.id=TSVM.testcase_detail_id
		where TSD.id=${data.testcase_id} `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},
	oldVersionLockUpdate: async documentID => {
		let testcase = await TestCase.updateOne({
			'_id': documentID
		}, {
			$set: {
				'lock': true
			}
		});
		return testcase;
	},

	fetchCasesDetails: async (testcase_id) => {
		let result;
		const sql_statement = `
		SELECT * FROM testcase_details where id="${testcase_id}" `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},
	fetchIssuesDetails: async (data) => {
		let result;
		const sql_statement = `
		SELECT * FROM jira_issues where issue_id="${data.issue_id}" and project_id=${data.project_id} and domain_id="${data.domain_id}"  `
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		return result
	},
	fetchTestCases: async data => {
		let result;
		const sql_statement = `
		SELECT TSD.id,TSD.test_key,TSD.created_at,TSD.updated_at, TSVM.doc_id, TSVM.version, TSVM.is_lock FROM testcase_details as TSD
		left join testcase_version_mapping as TSVM on TSD.id=TSVM.testcase_detail_id where TSD.id=${data.testcase_id} and TSVM.version="${data.version}"`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		console.log("result==>", result)
		if (result && result.length > 0) {
			return result
		} else {
			return result = []
		}
	},
	updateCaseExecutionTime: async (data) => {
		return sql_conn.testcaseDetailsModel.update({
			'last_execution': data.last_execution,
		}, {
			where: {
				'id': data.testcase_id
			}
		}).catch(console.error);
	},
	fetchVersionAndEnv: async data => {
		let result;
		const sql_statement = `
		SELECT  *  FROM test_execution_details where testcase_id =${data.testcase_id} and  (testcycle_id='' or testcycle_id is null) group by version,environment`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result
	},

	fetchExecutionId: async (testcase_id, version, environment) => {
		let result;
		const sql_statement = `
		SELECT * FROM test_execution_details where testcase_id=${testcase_id} and version="${version}" and environment="${environment}" and 
		 (testcycle_id='' or testcycle_id is null)  order by created_at desc`
		result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result
	},
};

module.exports = { testcaseDetails };

