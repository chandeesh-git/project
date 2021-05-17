const testcycleDao = require('../dao/testcycle.dao').testcycleDetails;
const testcaseDao = require('../dao/testcase.dao').testcaseDetails;
const testplanDao = require('../dao/testplan.dao').testplanDetails;
const testExecutionDao = require('../dao/testexecution.dao').testExecutionDetails;
const folderDao = require('../dao/folder.dao').folderDetails;
const folderTestcaseDao = require('../dao/folder_test.dao').folderTestcase;
const userDao = require('../dao/user.dao').userDetails;
const message = require('../utils/message');
const { checkUserAccess,getFormateDateForEdit,isValidDate } = require('../utils/utility')
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const excel = require("exceljs");
const fs = require('fs');
var asyncLoop = require('node-async-loop');
const moment = require('moment');
const testcycleService = {
	addTestCycle: async (data,files) => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data) {
			if (userAccess.data[0].allow_testcycle_create == 1) {
				data['is_active'] = true;
				let key_no
				let testKeyDetail = await testcycleDao.testKeyDetail(data);
				if(testKeyDetail.length){
					 key_no=testKeyDetail[0].test_count
					key_no=key_no+1
					let test_key_data=data.test_key
					data['test_key'] = test_key_data + '-T'+key_no
				}
				let testcycle = await testcycleDao.add(data);
				if (testcycle) {
					let testcycleID = testcycle._id.toString()
					let record = {};
					record['folder_id'] = testcycle.folder_id ? testcycle.folder_id : null,
						record['project_id'] = testcycle.project_id,
						record['domain_id'] = testcycle.domain_id,
						record['test_type'] = 'testcycle',
						record['doc_id'] = testcycleID,
						record['updated_by'] = testcycle.acct_id,
						record['created_by'] = testcycle.acct_id
						console.log(record)
					await folderTestcaseDao.addFolderTest(record);
					let testcycleLogsData = {};
					testcycleLogsData['test_id']=testcycleID,
					testcycleLogsData['created_by'] = data.acct_id,
					testcycleLogsData['updated_by'] = data.acct_id,
					testcycleLogsData['test_type'] ='testcycle',
					testcycleLogsData['description'] ='test cycle created',
					await testcycleDao.addTestcycleLogs(testcycleLogsData);
					if(data.issues){
						let issuesData={}
						for (const issuesElement of data.issues) {
							issuesData.issue_id=issuesElement.issue_id
							issuesData.issue_type=issuesElement.issue_type
							issuesData.issue_name=issuesElement.issue_name    
							issuesData.issue_key=issuesElement.issue_key
							issuesData.issue_to_link=issuesElement.issue_to_link
							issuesData.issue_status=issuesElement.issue_status
							issuesData.issue_icon=issuesElement.issue_icon
							issuesData.test_type=issuesElement.test_type
							issuesData.test_id=testcycleID
							issuesData.project_id=data.project_id
							issuesData.domain_id=data.domain_id
							issuesData.created_by=data.acct_id
							issuesData.updated_by=data.acct_id
							issuesData.version=data.version
							await testcaseDao.addIssues(issuesData);
						console.log(issuesElement);
						console.log(issuesData);
						}
					}
					// test plan test cycle mapping
					let planArray=data.testplans
					let testplanData=[]
					let cycle_object={}
					if(planArray.length){
						for (const test_element of planArray) {
							cycle_object.testplan_id=test_element
							cycle_object.testcycle_id=testcycleID
							cycle_object.project_id=data.project_id
							cycle_object.domain_id=data.domain_id
							cycle_object.updated_by=data.acct_id
							cycle_object.created_by=data.acct_id
							testplanData.push(cycle_object)
							cycle_object={}
						}
						await testplanDao.planCycleMapping(testplanData);
						console.log("final_array",testplanData)
					}

					let casesArray=data.testcases
					let testcaseData=[]
					let case_object={}
					if(casesArray.length){
						for (const testcase_element of casesArray) {
							case_object.testcycle_id=testcycleID
							case_object.testcase_id=testcase_element.testcase_id
							case_object.version=testcase_element.version
							case_object.tester=testcase_element.tester
							case_object.doc_id=testcase_element.doc_id
							case_object.project_id=data.project_id
							case_object.domain_id=data.domain_id
							case_object.updated_by=data.acct_id
							case_object.created_by=data.acct_id
							testcaseData.push(case_object)
							case_object={}
						}
						await testcycleDao.cycleCaseMapping(testcaseData);
						console.log("final_array",testcaseData)
					}
					if(testKeyDetail.length){
						await testcycleDao.updateCycleKey(data,key_no);
					}
					return { 'rescode': 200, 'msg': message.TEST_CYCLE_ADDED, 'data': { 'testcycle_id': testcycle._id } };
				} else {
					return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
				}
			} else {
				return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
			}

		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	delete: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcycle_delete === 1) {
			let testcycle = await testcycleDao.delete(data);
			if(testcycle){
				await testcycleDao.deleteTestcycle(data);
		    }
			if (testcycle) {
				return { 'rescode': 200, 'msg': message.TESTCYCLE_INACTIVE, 'data': {testcycle} };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	listTestcase: async data => {
		let responseData = {};
		let folderLists;
		let idDoc
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcycle_view === 1) {
			if(data.folder_id){
				folderLists = await testcycleDao.subFolderLists(data);
				responseData.folderList = folderLists
				let testcasesData = await testcycleDao.subListTestcase(data);
				for (const element of testcasesData) {
					idDoc =element.doc_id
					dataTest = await testcaseDao.testcaseDocDetails(idDoc,data)
					element.version=dataTest.version
					element.owner=dataTest.owner
					element.status=dataTest.status
					console.log(element);
				  }
				let filterTestcase = testcasesData.filter(filteredDatas => filteredDatas.status == "Approved");
				responseData.testDetail = filterTestcase
					if (responseData) {
						return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': responseData };
					} else {
						return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
					} 
			} else {
				folderLists = await testcycleDao.listFolder(data);
				responseData.folderList = folderLists
				let testcasesData = await testcycleDao.listTestcase(data);

				for (const element of testcasesData) {
					idDoc =element.doc_id
					dataTest = await testcaseDao.testcaseDocDetails(idDoc,data)
					element.version=dataTest.version
					element.owner=dataTest.owner
					element.status=dataTest.status
					console.log(element);
				  }
				let filterTestcase = testcasesData.filter(filteredDatas => filteredDatas.status == "Approved");
				responseData.testDetail = filterTestcase
				if (responseData) {
					return { 'rescode': 200, 'msg': message.TESTCYCLE_LIST, 'data': responseData };
				} else {
					return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
				} 
			}
		} else {
			return {'rescode': 401, 'msg':message.INSUFFICIENT_ACCESS, 'data': {}}
		}
	},
	testcycleDetailById: async data => {
		let planArray=[]
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcycle_view === 1) {
			let testcycle = await testcycleDao.testcycleDetailById(data);
			if (testcycle) {
			testcycle.testplans=[]
			let fetchIssues = await testcycleDao.cycleIssues(data);
            let issuesData={}
            if(fetchIssues.length){
                testcycle.issues=fetchIssues
            } else{
                testcycle.issues=[]
			}
			let fetchCyclePlan = await testcycleDao.cyclePlanList(data);
			if(fetchCyclePlan.length){
				for (const element of fetchCyclePlan) {
					let testplan_ids=element.testplan_id
					let cycleDetails = await testplanDao.planCycleDetails(testplan_ids,data);
					planArray.push(cycleDetails)
				}
			}
			testcycle.testplans=planArray
			let testcaseArrays=[]
			let fetchCycleCases = await testcycleDao.cycleCasesFetch(data);
			let testcaseJson={}
			if(fetchCycleCases.length){
				for (const element_case of fetchCycleCases) {
					let testcase_ids=element_case.testcase_id
					let docId=element_case.doc_id
					let version=element_case.version
					let detailTestcase = await testcycleDao.testcasesData(testcase_ids,version);
					let testcasesData = await testcaseDao.testcaseDocDetails(docId,data);
					testcaseJson.id=testcase_ids
					testcaseJson.version=element_case.version
					testcaseJson.name=testcasesData.name
					testcaseJson.test_key=detailTestcase[0].test_key
					testcaseJson.priority=testcasesData.priority
					testcaseJson.last_execution=detailTestcase[0].last_execution
					testcaseJson.updated_by=testcasesData.updated_by
					testcaseJson.created_by=testcasesData.created_by
					testcaseJson.created_at=detailTestcase[0].created_at
					testcaseJson.updated_at=detailTestcase[0].updated_at
					testcaseJson.doc_id=testcasesData._id
					testcaseJson.objective=testcasesData.objective
					testcaseJson.precondition=testcasesData.precondition
					testcaseJson.estimated_time=testcasesData.estimated_time
					testcaseJson.status=testcasesData.status
					testcaseJson.label=testcasesData.label
					testcaseJson.description=testcasesData.description
					testcaseJson.customFields=testcasesData.customFields
					testcaseJson.component=testcasesData.component
					testcaseJson.owner=element_case.tester
					testcaseArrays.push(testcaseJson)
					testcaseJson={}
				}
				testcycle.testcases=testcaseArrays
			} else{
				testcycle.testcases=[]	
			}
	
				return { 'rescode': 200, 'msg': message.TESTCYCLE_DETAIL, 'data': testcycle };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return {'rescode': 401, 'msg':message.INSUFFICIENT_ACCESS, 'data': {}}
		}
	},
	updateTestcycle: async (data,files) => {
		data.folder_id = data.folder_id ? data.folder_id : null;
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcycle_edit === 1) {
			let updateData = {};
			let keys = Object.keys(data);
			for (key of keys) {
				if (data.hasOwnProperty(key) && key != 'testcycle_id')
					updateData[key] = data[key];
			}
			let testcycle = await testcycleDao.update(data.testcycle_id, updateData);
			if (testcycle) {
				let record = {};
				record['folder_id'] = data.folder_id ? data.folder_id : null,
					record['project_id'] = data.project_id,
					record['domain_id'] = data.domain_id,
					record['updated_by'] = data.acct_id
					console.log("record",record)
				await folderTestcaseDao.updateFolderTestcycle(data.testcycle_id,record);

				let testcycleLogsData = {};
				testcycleLogsData['test_id']=data.testcycle_id
				testcycleLogsData['created_by'] = data.acct_id,
				testcycleLogsData['updated_by'] = data.acct_id,
				testcycleLogsData['test_type'] ='testcycle',
				testcycleLogsData['description'] ='made changes on',
				testcycleLogsData['field_data'] =data.field_data,
				await testcycleDao.addTestcycleLogs(testcycleLogsData);
				
				// to delete the old issue 
				await testcycleDao.cycleDeleteIssues(data);

				if(data.issues){
					let issuesData={}
					for (const issuesElement of data.issues) {
						issuesData.issue_id=issuesElement.issue_id
						issuesData.issue_type=issuesElement.issue_type
						issuesData.issue_name=issuesElement.issue_name    
						issuesData.issue_key=issuesElement.issue_key
						issuesData.issue_to_link=issuesElement.issue_to_link
						issuesData.issue_status=issuesElement.issue_status
						issuesData.issue_icon=issuesElement.issue_icon
						issuesData.test_type=issuesElement.test_type
						issuesData.test_id=data.testcycle_id
						issuesData.project_id=data.project_id
						issuesData.domain_id=data.domain_id
						issuesData.created_by=data.acct_id
						issuesData.updated_by=data.acct_id
						issuesData.version=data.version
						await testcaseDao.addIssues(issuesData);
					console.log(issuesElement);
					console.log(issuesData);
					}
				}
				// Test cycle plan mapping
				await testcycleDao.cyclePlanDeleteMapping(data);
				let planArray=data.testplans
				let testplanData=[]
				let cycle_object={}
				if(planArray.length){
					for (const test_element of planArray) {
						cycle_object.testplan_id=test_element
						cycle_object.testcycle_id=data.testcycle_id
						cycle_object.project_id=data.project_id
						cycle_object.domain_id=data.domain_id
						cycle_object.updated_by=data.acct_id
						cycle_object.created_by=data.acct_id
						testplanData.push(cycle_object)
						cycle_object={}
					}
					await testplanDao.planCycleMapping(testplanData);
					console.log("final_array",testplanData)
				}
				// test cycle and test case mapping 
				await testcycleDao.cycleCaseDeleteMapping(data);
				let casesArray=data.testcases
					let testcaseData=[]
					let case_object={}
					if(casesArray.length){
						for (const testcase_element of casesArray) {
							case_object.testcycle_id=data.testcycle_id
							case_object.testcase_id=testcase_element.testcase_id
							case_object.version=testcase_element.version
							case_object.tester=testcase_element.tester
							case_object.doc_id=testcase_element.doc_id
							case_object.project_id=data.project_id
							case_object.domain_id=data.domain_id
							case_object.updated_by=data.acct_id
							case_object.created_by=data.acct_id
							testcaseData.push(case_object)
							case_object={}
						}
						await testcycleDao.cycleCaseMapping(testcaseData);
						console.log("final_array",testcaseData)
					}
				return { 'rescode': 200, 'msg': message.TESTCYCLE_UPDATE, 'data': testcycle };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	addTestCases: async data => {
		let checkPermission = await userDao.getUserAccess({ 'acct_id': data.acct_id, 'project_id': data.project_id });
		if (checkPermission.length && checkPermission[0].allow_testcycle_edit === 1) {
			let executionData = [];
			let testcaseIds = data.testcases.map(testcase => {
				let obj = {};
				obj['testcase_id'] = testcase._id;
				obj['is_active'] = true;
				obj['environment'] = testcase.environment;
				obj['testcycle_id'] = data.testcycle_id;
				obj['project_id'] = data.project_id;
				obj['assigned_to'] = testcase.assigned_to;
				obj['execution_status'] = 0;
				executionData.push(obj);
				return testcase._id;
			});
			data['testcaseIds'] = testcaseIds;
			let testcases = await testcaseDao.updateTestCycle(data);
			if (testcases.nModified > 0) {
				//Create Test Execution
				let testExecution = await testExecutionDao.addTestExecutions(executionData);
				if (testExecution)
					return { 'rescode': 200, 'msg': message.TESTEXECUTION_CREATED, 'data': testExecution };
				else
					return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},

	cloneTestCycle: async data => {
		let cloneTestData = {}
		let testDetailData = {}
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcycle_create === 1) {
			// insert the testcase data in testcase_detail table
			let testcycle = await testcycleDao.testcycleDetailById(data);
			if (testcycle) {	
			let cycle_name=testcycle.name
			cycle_name=	`${cycle_name}(cloned)`,
			cloneTestData.name = cycle_name
			cloneTestData.acct_id = testcycle.acct_id
			cloneTestData.project_id = testcycle.project_id
			cloneTestData.domain_id = testcycle.domain_id
			cloneTestData.folder_id = testcycle.folder_id
			cloneTestData.description = testcycle.description
			cloneTestData.owner = testcycle.owner
			cloneTestData.status = testcycle.status
			cloneTestData.environment = testcycle.environment
			cloneTestData.folder_name = testcycle.folder_name ? testcycle.folder_name : ""
			cloneTestData.label = testcycle.label ? testcycle.label : ""
			cloneTestData.weblinks = testcycle.weblinks
			cloneTestData.issues = testcycle.issues
			cloneTestData.testcases = testcycle.testcases
			cloneTestData.testplans = testcycle.testplans
			cloneTestData.planned_start_date = testcycle.planned_start_date
			cloneTestData.planned_end_date = testcycle.planned_end_date
			cloneTestData.attachments = testcycle.attachments ? testcycle.attachments :""
			cloneTestData.customFields = testcycle.customFields
			cloneTestData.is_active = testcycle.is_active
			cloneTestData.submit_status = testcycle.submit_status
			cloneTestData.version = testcycle.version
			cloneTestData.last_execution = testcycle.last_execution ? testcycle.last_execution: ""
			cloneTestData.test_key = testcycle.test_key ? testcycle.test_key:""
			let testcycleAdd = await testcycleDao.add(cloneTestData);
				// get the test detail from folder_test_mapping table
				let testcycleData = await testcycleDao.fetchTestcycleData(data);
				let docID = testcycleAdd._id.toString()
				testDetailData.doc_id = docID
				testDetailData.domain_id=testcycleData[0].domain_id
				testDetailData.project_id=testcycleData[0].project_id
				testDetailData.folder_id=testcycleData[0].folder_id
				testDetailData.test_type=testcycleData[0].test_type
				testDetailData.created_by=data.acct_id
				testDetailData.updated_by=data.acct_id 
				await folderTestcaseDao.addFolderTest(testDetailData);
				// add issues in test cycle
				// to clone the jira issue of testcase
				fetchIssues = await testcycleDao.fetchCycleIssues(data);
				if(fetchIssues.length){
					console.log("@@@@@@@@@@@@@@@@@@@@@@123333333333333")
					let issuesData={}
					let bulkIssuesData=[]
					for (const issuesElement of fetchIssues) {
						issuesData.issue_id=issuesElement.issue_id
						issuesData.issue_type=issuesElement.issue_type
						issuesData.issue_name=issuesElement.issue_name    
						issuesData.issue_key=issuesElement.issue_key
						issuesData.issue_to_link=issuesElement.issue_to_link
						issuesData.issue_status=issuesElement.issue_status
						issuesData.issue_icon=issuesElement.issue_icon
						issuesData.test_type=issuesElement.test_type
						issuesData.test_id=docID
						issuesData.project_id=data.project_id
						issuesData.domain_id=data.domain_id
						issuesData.created_by=data.acct_id
						issuesData.updated_by=data.acct_id
						issuesData.version=cloneTestData.version
						bulkIssuesData.push(issuesData)
						issuesData={}
					console.log("final data insert the "+bulkIssuesData);
					}
					await testcycleDao.addBulkIssues(bulkIssuesData);
					}
					// for testplan of test cycle 
					cloneCyclePlan = await testcycleDao.cloneCyclePlan(data);
					if(cloneCyclePlan.length){
						let cyclePlanObj={}
						let cyclePlanArray=[]
						for (const planElement of cloneCyclePlan) {
							cyclePlanObj.testcycle_id=docID
							cyclePlanObj.testplan_id=planElement.testplan_id
							cyclePlanObj.project_id=data.project_id
							cyclePlanObj.domain_id=data.domain_id
							cyclePlanObj.created_by=data.acct_id
							cyclePlanObj.updated_by=data.acct_id
							cyclePlanArray.push(cyclePlanObj)
							cyclePlanObj={}
						console.log("final data insert the "+cyclePlanArray);
						}
						await testcycleDao.addBulkCyclePlan(cyclePlanArray);
					}

					// add test case of test cycle
					cloneCycleCases = await testcycleDao.cloneCycleCases(data);
					if(cloneCycleCases.length){
						let cycleCasesObj={}
						let cycleCasesArray=[]
						for (const caseElement of cloneCycleCases) {
							cycleCasesObj.testcycle_id=docID
							cycleCasesObj.testcase_id=caseElement.testcase_id
							cycleCasesObj.version=caseElement.version
							cycleCasesObj.tester=caseElement.tester
							cycleCasesObj.doc_id=caseElement.doc_id
							cycleCasesObj.project_id=data.project_id
							cycleCasesObj.domain_id=data.domain_id
							cycleCasesObj.created_by=data.acct_id
							cycleCasesObj.updated_by=data.acct_id
							cycleCasesArray.push(cycleCasesObj)
							cycleCasesObj={}
						console.log("final data insert the "+cycleCasesArray);
						}
						await testcycleDao.addBulkCycleCases(cycleCasesArray);
					}
				
				return { 'rescode': 200, 'msg': message.CLONE_ADD, 'data': testcycleAdd};
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	planList: async data => {
		if(data.project_id){
			let projectIds=data.project_id.split(',') 
			data['project_id'] = projectIds;
		} else{
			data['project_id'] = null;
		}
		let testcycle = await testplanDao.fetchPlanList(data);
		if (testcycle) {
			return { 'rescode': 200, 'msg': message.TESTPLAN_LIST, 'data': testcycle };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},

	cycleHistory: async data => {
		let testcycle = await testcycleDao.cycleHistory(data);
			if (testcycle) {
				return { 'rescode': 200, 'msg': message.TESTCYCLE_DETAIL, 'data': testcycle };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
	},

	importDatas: async (results,testcaseData) => {
		console.log("in the nextx ",results)
		let unInsertData=0
		let unInsertJson={}
		let unInsertArray=[]
        let accessData = {};
        accessData['domain_id'] = testcaseData.domain_id;
        accessData['project_id'] = testcaseData.project_id;
		accessData['acct_id'] = testcaseData.acct_id;
        let userAccess = await checkUserAccess(accessData);
        if (userAccess.data && userAccess.data[0].allow_testcycle_create === 1) {
            for (const item of results) {
				console.log("checkUserAcces11s", item)
				item['is_active'] = true;
				item['version'] = "1.0";
				item['submit_status'] = false;
				item['owner'] = null;
				item['folder_id'] = null;
				item['last_execution'] = null;
				item['issues'] = [];
				item['testplans'] = [];
				item['testcases'] = [];
				item['customFields'] = "[]";
				item['weblinks'] = "[]";
				item['domain_id'] = testcaseData.domain_id
				item['project_id'] = testcaseData.project_id;
				item['acct_id'] = testcaseData.acct_id;
				item['test_key'] = testcaseData.test_key;

				let planned_start_date=item.planned_start_date
				let planned_end_date=item.planned_end_date
				let start_date=moment(planned_start_date, "YYYY-MM-DD",true).isValid()
					if(start_date==false){
					 start_date=moment(planned_start_date, "YYYY-MM-DDTHH:mm:ss.SSSZ",true).isValid()
					}

				let end_date=moment(planned_end_date, "YYYY-MM-DD",true).isValid()
				if(end_date==false){
				 end_date=moment(planned_end_date, "YYYY-MM-DDTHH:mm:ss.SSSZ",true).isValid()
				}
				if (start_date == true && end_date == true) {
					console.log("change plan start date", planned_start_date)
					item['planned_start_date'] = item.planned_start_date;
					item['planned_end_date'] = item.planned_end_date;
				} else{
					unInsertData++
					item['planned_start_date'] = null;
					item['planned_end_date'] = null;
				}
					let testcycle = await testcycleDao.add(item);
					let testcycleID = testcycle._id.toString()
					let record = {};
					record['folder_id'] = testcycle.folder_id ? testcycle.folder_id : null,
						record['project_id'] = testcycle.project_id,
						record['domain_id'] = testcycle.domain_id,
						record['test_type'] = 'testcycle',
						record['doc_id'] = testcycleID,
						record['updated_by'] = testcycle.acct_id,
						record['created_by'] = testcycle.acct_id
					console.log(record)
					await folderTestcaseDao.addFolderTest(record);
				
			}
			if (unInsertData == 0) {
				return { 'rescode': 200, 'msg': message.TEST_CYCLE_ADDED, 'data': [] };
			} else {
				return { 'rescode': 200, 'msg': message.DATE_FORMAT_ISSUE, 'data': [] };
			}
        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
	},

	fileExports: async (data,res) => {
		console.log("dtaatatatatta",data)
        let downloadData={}
        let csvData
        let userAccess = await checkUserAccess(data);
        if (userAccess.data && userAccess.data[0].allow_testcycle_view === 1) {
            let testcycleLists = await testcycleDao.testcaseLists(data);
            if (testcycleLists.length) {
				let responseArray = [];
				asyncLoop(testcycleLists, async function(testCycle, next) {
                    let testData={}
					let ownerArray = JSON.parse(data.owner_array);
                    testData.name = testCycle.name;
                    testData.acct_id = testCycle.acct_id;
                    testData.project_id = testCycle.project_id;
                    testData.domain_id = testCycle.domain_id;
                    testData.description = testCycle.description;
                    testData.owner = testCycle.owner;
					testData.status = testCycle.status;
					testData.customFields = testCycle.customFields;
					let startDate = await getFormateDateForEdit(testCycle.planned_start_date);
					let endtDate = await getFormateDateForEdit(testCycle.planned_end_date);
					console.log(startDate)
					testData.planned_start_date = startDate;
                    testData.planned_end_date = endtDate;
                    testData.label = testCycle.label;
                    testData.environment = testCycle.environment;
                    testData.is_active = testCycle.is_active;
                    testData.createdAt = testCycle.createdAt;
					testData.updatedAt = testCycle.updatedAt;
					const ownerData = ownerArray.filter(ownerName => ownerName.accountId ==testCycle.owner);
					if(ownerData.length){
						testData.owner =ownerData[0].name ;
					}
                    responseArray.push(testData);
                    next();
                }, function(error){
					if(data.file_type=="xlsx"){
						console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@11111111111@")
						let workbook = new excel.Workbook();
						let worksheet = workbook.addWorksheet("responseArray");
						worksheet.columns = [
							{ header: "name", key: "name"},
							{ header: "description", key: "description"},
							{ header: "status", key: "status"},
							{ header: "owner", key: "owner"},
							{ header: "environment", key: "environment"},
							{ header: "planned_start_date", key: "planned_start_date"},
							{ header: "planned_end_date", key: "planned_end_date"},
							{ header: "customFields", key: "customFields"},
						  ];
							   // Add Array Rows
							worksheet.addRows(responseArray);
							console.log("worksheetworksheetworksheetworksheet",workbook.xlsx)
								fs.writeFile('./csv_file/testcaseData.csv', workbook.xlsx, function(err) {
								 if (err) {
									 return { 'rescode': 401, 'msg': message.download_error, 'data': {} }
								 }  else{
										
								 }
								})
							res.setHeader(
								"Content-Type",
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
							  );
							  res.setHeader(
								"Content-Disposition",
								"attachment; filename=" + "testcycle.xlsx"
							  );
							  return workbook.xlsx.write(res).then(function () {
								res.status(200).end();
							  });
					} else{
						const fields = [
							{ value: 'name', label: 'name' },
							{ value: 'description', label: 'Description' },
							{ value: 'status', label: 'status' },
							{ value: 'owner', label: 'owner' },
							{ value: 'environment', label: 'environment' },
							{ value: 'planned_start_date', label: 'planned_start_date' },
							{ value: 'planned_end_date', label: 'planned_end_date' },
							{ value: 'customFields', label: 'customFields' },
						]
						const json2csvParser = new Parser({ fields });
						csvData = json2csvParser.parse(responseArray);
						res.setHeader("Content-Type", "text/csv");
						res.setHeader("Content-Disposition", "attachment; filename=testcycle.csv");
						res.status(200).end(csvData);
					}
				})
                //return { 'rescode': 200, 'msg': message.TESTCASE_VERSION_HISTORY, 'data': downloadData };
            } else {
                return response (res,401,  message.INVALID_DETAILS, {}, null)
            }
        } else {
            return response (res,401, message.INSUFFICIENT_ACCESS, {}, null)
        }
	},
	versionDetail: async data => {
		let versionData = await testcycleDao.versionDetail(data);
		if (versionData) {
			return { 'rescode': 200, 'msg': message.VERSION_LIST, 'data': versionData[0] };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},
	
}

module.exports = { testcycleService };