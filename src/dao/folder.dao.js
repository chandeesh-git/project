'use strict';

var Folder = require('../../db/mongoose_models/folder');
var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const { sequelize } = require('../../db/sequelize_models/index');
var TestCase = require('../../db/mongoose_models/testcase');
var TestPlan = require('../../db/mongoose_models/testplan');
var TestCycle = require('../../db/mongoose_models/testcycle');
//const sequelize = new Sequelize("mysql::memory:");

const folderDetails={
	add: async data => {
		if (data.project_id) {
			let statusData = await sql_conn.projectModel.findOne({
				where: Sequelize.and({
					'project_id': data.project_id
				},
					{ 'domain_id': data.domain_id }
				)
			})
			if (statusData) {
				return sql_conn.folderModel.create(data).catch(console.error);
			} else {
				console.log("project details not found")
			}
		}
	},

	list: async(data) => {
		let result;
		const query = `SELECT FD.id, folder_name,
		(SELECT COUNT(id) FROM folder_test_mapping WHERE folder_id = FD.id AND test_type ="${data.folder_category}" and is_active=1 ) AS test_count
		FROM folder AS FD WHERE parent_folder_id = '' AND FD.project_id =${data.project_id} AND FD.domain_id ="${data.domain_id}" and FD.is_active=1 and FD.folder_category= "${data.folder_category}" `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	  },
	
	  update: async data => {
		if (data.project_id) {
			let statusData = await sql_conn.projectModel.findOne({
				where: Sequelize.and({
					'project_id': data.project_id
				},
					{ 'domain_id': data.domain_id }
				)
			})
			if (statusData) {
				return sql_conn.folderModel.update({
					'folder_name': data.folder_name,
					'updated_by': data.acct_id
				}, {
					where: Sequelize.and({
						'id': data.folder_id,
						'project_id': data.project_id,
						'domain_id': data.domain_id,
					})
				}).catch(console.error);
			} else {
				console.log("project details not found")
			}
		}
	},
	delete: async data => {
		let folder = await Folder.deleteMany({
			$or: [{'parent_folder_id': data.folder_id},{'_id': data.folder_id}]
		});
		return folder;
	}, 
	folderDetail: async data => {
		let folder = await Folder.find({
			'$or': [{'_id': data.folder_id}, {'parent_folder_id': data.folder_id}]
		});
		return folder;
	},
	
	subFolderList: async(data) => {
		let result;
		const query = `SELECT FD.id, folder_name,
		(SELECT COUNT(id) FROM folder_test_mapping WHERE folder_id = FD.id AND test_type ="${data.folder_category}" and is_active=1 ) AS test_count
		FROM folder AS FD WHERE parent_folder_id =${data.parent_folder_id} AND FD.project_id =${data.project_id} AND FD.domain_id ="${data.domain_id}" and FD.is_active=1 and FD.folder_category= "${data.folder_category}"`
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	  },

	  testWithoutFolder: async(data) => {
		let result;
		const query = `SELECT group_concat(doc_id)  as doc_ids FROM folder_test_mapping where 
		(folder_id IS NULL or folder_id ='') and test_type='test_plan' `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	  },
	  getTestList: async (data) => {
		  if(data.folder_category=="testplan"){
			let testplans =  await TestPlan.find({  
				'project_id': data.project_id,
				'domain_id': data.domain_id,
				'is_active': true,
				'folder_id': null
			});
			return testplans;
		  } else if(data.folder_category=="testcase"){
			let testcases =  await TestCase.find({  
				'project_id': data.project_id,
				'domain_id': data.domain_id,
				'is_active': true,
				'folder_id': {"$eq" : ""}
			});
			return testcases;
		  } else {
			let testcycle =  await TestCycle.find({  
				'project_id': data.project_id,
				'domain_id': data.domain_id,
				'is_active': true,
				'folder_id':null
			});
			return testcycle;
		  }
	},
	testListSubFolder: async (data) => {
		if(data.folder_category=="testplan"){
		  let testplans =  await TestPlan.find({  
			  'project_id': data.project_id,
			  'domain_id': data.domain_id,
			  'is_active': true,
			  'folder_id': data.parent_folder_id
		  });
		  return testplans;
		} else if(data.folder_category=="testcase"){
			console.log("data in query",data);
		  let testcases =  await TestCase.find({  
			  'project_id': data.project_id,
			  'domain_id': data.domain_id,
			  'is_active': true,
			  'folder_id': data.parent_folder_id
		  });
		  return testcases;
		} else {
		  let testcycle =  await TestCycle.find({  
			  'project_id': data.project_id,
			  'domain_id': data.domain_id,
			  'is_active': true,
			  'folder_id': data.parent_folder_id
		  });
		  return testcycle;
		}
	},
	folderListCountTestcase: async(data) => {
		let result;
		const query = `SELECT FD.id, folder_name,
		(SELECT COUNT(id) FROM testcase_details WHERE folder_id = FD.id and is_active=1 ) AS test_count
		FROM folder AS FD WHERE parent_folder_id = '' AND FD.project_id =${data.project_id} AND FD.domain_id ="${data.domain_id}" and FD.is_active=1 and FD.folder_category= "${data.folder_category}"`
		result = sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	getTestcaseList: async(data) => {
		let result;
		const query = `SELECT TSD.id,TSD.test_key,TSD.name,TSD.priority,PCM.priority_color,TSD.last_execution,TSD.is_active,TSD.created_at,TSD.created_by,TSD.updated_by,TSD.updated_at,TSD.folder_id,TSD.project_id,TSD.domain_id,
		(SELECT doc_id FROM testcase_version_mapping as TSVM where TSVM.testcase_detail_id=TSD.id order by TSVM.created_at desc limit 1) as doc_id
		FROM testcase_details as TSD
		left join priority_config_master as PCM on PCM.pc_name = TSD.priority and PCM.project_id = TSD.project_id and PCM.domain_id = TSD.domain_id and PCM.priority_type ="testcase" and PCM.is_active =1
		where TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}" and TSD.is_active=1 and (folder_id is null or folder_id= '')`
		result = sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	subFolderCountTestcase: async(data) => {
		let result;
		const query = `SELECT FD.id, folder_name,
		(SELECT COUNT(id) FROM testcase_details WHERE folder_id = FD.id and is_active=1 ) AS test_count
		FROM folder AS FD WHERE parent_folder_id =${data.parent_folder_id} AND FD.project_id =${data.project_id} AND FD.domain_id ="${data.domain_id}" and FD.is_active=1 and FD.folder_category= "${data.folder_category}"`
		result = sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	  },
	testcaseListWithFolder :async(data) => {
		let result;
		const query = `SELECT TSD.id,TSD.test_key,TSD.name,TSD.priority,PCM.priority_color,TSD.last_execution,TSD.is_active,TSD.created_at,TSD.created_by,TSD.updated_by,TSD.updated_at,TSD.folder_id,TSD.project_id,TSD.domain_id,
		(SELECT doc_id FROM testcase_version_mapping as TSVM where TSVM.testcase_detail_id=TSD.id order by TSVM.created_at desc limit 1) as doc_id
		FROM testcase_details as TSD
		left join priority_config_master as PCM on PCM.pc_name = TSD.priority and PCM.project_id = TSD.project_id and PCM.domain_id = TSD.domain_id and PCM.priority_type ="testcase" and PCM.is_active=1
		where TSD.project_id = ${data.project_id} and TSD.domain_id = "${data.domain_id}" and TSD.is_active=1 and folder_id =${data.parent_folder_id}`
		result = sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	testcaseFlag :async(data) => {
		let result;
		const query = `SELECT * FROM testcase_details where project_id=${data.project_id} and domain_id='${data.domain_id}' and is_active=1`
		result = sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	otherTestFlag :async(data) => {
		let result;
		const query = `SELECT * FROM folder_test_mapping where project_id=${data.project_id} and domain_id="${data.domain_id}" and is_active=1 and test_type="${data.test_type}"`
		result = sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	},

	folderTestcase: async(data) => {
		let result;
		const query = `
		SELECT * FROM folder as FD left join testcase_details as FSD on FD.id=FSD.folder_id where 
		(FD.parent_folder_id=${data.folder_id} and FD.is_active=1)  or FSD.folder_id=${data.folder_id}  `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	  },

	  folderTestOther: async(data) => {
		let result;
		const query = `
		SELECT * FROM folder as FD left join folder_test_mapping as FTM on FD.id=FTM.folder_id
		 where (FD.parent_folder_id=${data.folder_id} and FD.is_active=1) or FTM.folder_id=${data.folder_id} `
		result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
		return result;
	  },
	  deleteFolder: async (data) => {
		return sql_conn.folderModel.update({
			'is_active':false,
			'updated_by': data.acct_id
		},{
			where: {
				'id': data.folder_id
			}
		}).catch(console.error);
	},
	testcaseDocID: async(testcase_ids,data) => {
		let testcases =  await TestCase.findOne({
			'project_id': data.project_id,
			'domain_id': data.domain_id,
			'_id': testcase_ids
		});
		return testcases;
	},
	fetchCycleCases: async testcycle_id => {
		let result;
		const sql_statement = `SELECT *  FROM 
		testcycle_testcase_mapping where testcycle_id="${testcycle_id}"`
		result =await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
		return result;
	},
	fetchExecutionData: async (testcase_ids,testcycle_id,version) => {
        let result;
        const sql_statement = `SELECT *  FROM 
        test_execution_details where testcycle_id="${testcycle_id}"  and
        testcase_id="${testcase_ids}"  and  version="${version}" order by created_at desc limit 1`
        result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        return result;
    },
	
};


module.exports = {folderDetails};

