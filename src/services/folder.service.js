const folderDao = require('../dao/folder.dao').folderDetails;
const message = require('../utils/message');
const { checkUserAccess } = require('../utils/utility')

const folderService = {
	addFolder: async data => {
		if (data.parent_folder_id) {
			data['folder_type'] = "sub_folder";
		} else {
			data['folder_type'] = "folder";
		}
		let folder = await folderDao.add(data);
		if (folder) {
			return { 'rescode': 200, 'msg': message.FOLDER_ADDED, 'data': folder };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},
	deleteFolder: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data) {
			folderTestcase = await folderDao.folderTestcase(data);
			folderTestOther = await folderDao.folderTestOther(data);
			if (folderTestOther.length || folderTestcase.length) {
				return { 'rescode': 401, 'msg': message.FOLDER_NOT_DELETE, 'data': {} };
			} else {
				await folderDao.deleteFolder(data);
				return { 'rescode': 200, 'msg': message.FOLDER_DELETED, 'data': {} };
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}

	},
	updateFolder: async data => {
		console.log("service", data)
		let folder = await folderDao.update(data);
		if (folder) {
			return { 'rescode': 200, 'msg': message.FOLDER_UPDATED, 'data': folder };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},
	listFolder: async data => {
		let responseData = {};
		let folderLists;
		let getTestList;
		if (data.folder_category == 'testcase') {
			folderLists = await folderDao.folderListCountTestcase(data);
			responseData.folderList = folderLists
			getTestList = await folderDao.getTestcaseList(data);
			console.log(getTestList)
			let arrayTestcase =[];
			if(getTestList.length>0){
				let idDoc;
				let dataTest;
				for(let i=0; i<getTestList.length;i++ ){
					let test_data = {};
					idDoc = getTestList[i].doc_id
					console.log("doc===>",idDoc,i);
					dataTest = await folderDao.testcaseDocID(idDoc,data)
					console.log("dataTest",dataTest);
					test_data.id = getTestList[i].id
					test_data.test_key = getTestList[i].test_key
					test_data.last_execution =getTestList[i].last_execution
					test_data.created_by =getTestList[i].created_by
					test_data.updated_by =getTestList[i].updated_by
					test_data.name=getTestList[i].name
					test_data.acct_id=dataTest.acct_id
					test_data.project_id=getTestList[i].project_id
					test_data.domain_id=getTestList[i].domain_id
					test_data.folder_id=getTestList[i].folder_id
					test_data.description=dataTest.description
					test_data.precondition=dataTest.precondition ? dataTest.precondition:""
					test_data.owner=dataTest.owner
					test_data.status=dataTest.status
					test_data.priority=getTestList[i].priority
					test_data.priority_color=getTestList[i].priority_color
					test_data.component=dataTest.component
					test_data.estimated_time=dataTest.estimated_time
					test_data.folder_name=dataTest.folder_name ? dataTest.folder_name:""
					test_data.label=dataTest.label
					test_data.testscript_type=dataTest.testscript_type ? dataTest.testscript_type:""
					test_data.testscript=dataTest.testscript ? dataTest.testscript : ""
					test_data.test_data=dataTest.test_data ? dataTest.test_data: ""
					test_data.parameters=dataTest.parameters ? dataTest.parameters : ""
					test_data.weblinks=dataTest.weblinks ? dataTest.weblinks : ""
					test_data.issues=dataTest.issues ? dataTest.issues: ""
					test_data.attachments=dataTest.attachments ? dataTest.attachments : ""
					test_data.version=dataTest.version
					test_data.lock=dataTest.lock
					test_data.customFields=dataTest.customFields ? dataTest.customFields : ""
					test_data.is_active=getTestList[i].is_active
					test_data.created_at=getTestList[i].created_at
					test_data.updated_at=getTestList[i].updated_at
					test_data.submit_status=dataTest.submit_status
					arrayTestcase.push(test_data);
				}
				responseData.testDetail = arrayTestcase
			} else {
				responseData.testDetail = []
			}
		} else if (data.folder_category == 'testcycle') {
			folderLists = await folderDao.list(data);
			responseData.folderList = folderLists
			getTestList = await folderDao.getTestList(data);
			if(getTestList.length){
				let cycleJson={}
				let cycleArray=[]
				for (const cycleElement of getTestList) {
					let testcycle_id=cycleElement._id
					cycleJson._id=cycleElement._id
					cycleJson.acct_id=cycleElement.acct_id
					cycleJson.project_id=cycleElement.project_id
					cycleJson.domain_id=cycleElement.domain_id
					cycleJson.test_key=cycleElement.test_key
					cycleJson.last_execution=cycleElement.last_execution
					cycleJson.folder_id=cycleElement.folder_id
					cycleJson.name=cycleElement.name
					cycleJson.version=cycleElement.version
					cycleJson.description=cycleElement.description
					cycleJson.status=cycleElement.status
					cycleJson.owner=cycleElement.owner
					cycleJson.environment=cycleElement.environment
					cycleJson.assigned_to=cycleElement.assigned_to
					cycleJson.planned_start_date=cycleElement.planned_start_date
					cycleJson.planned_end_date=cycleElement.planned_end_date
					cycleJson.folder_name=cycleElement.folder_name
					cycleJson.weblinks=cycleElement.weblinks
					cycleJson.issues=cycleElement.issues
					cycleJson.testplans=cycleElement.testplans
					cycleJson.is_active=cycleElement.is_active
					cycleJson.submit_status=cycleElement.submit_status
					cycleJson.customFields=cycleElement.customFields
					let passExecution=0
					let failExecution=0
					let blockedExecution=0
					let notExecutedExecution=0
					let inProgressExecution=0
					fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
					let totalExecution=fetchCycleCases.length
					if(fetchCycleCases.length){
						for (const casesItem of fetchCycleCases){
							let testcase_ids = casesItem.testcase_id
							let version = casesItem.version
							fetchCycleCases = await folderDao.fetchExecutionData(testcase_ids,testcycle_id,version);
							if(fetchCycleCases.length){
								let testStatus=	fetchCycleCases[0].execution_status
								if(testStatus=="Not Executed"){
									notExecutedExecution++
								}
								if(testStatus=="In Progress"){
									inProgressExecution++
								}
								if(testStatus=="Pass"){
									passExecution++
								}
								if(testStatus=="Fail"){
									failExecution++
								}
								if(testStatus=="Blocked"){
									blockedExecution++
								}
							} else{
								notExecutedExecution++
							}
						}
					}
					cycleJson.passExecution=passExecution
					cycleJson.failExecution=failExecution
					cycleJson.blockedExecution=blockedExecution
					cycleJson.notExecutedExecution=notExecutedExecution
					cycleJson.inProgressExecution=inProgressExecution
					cycleJson.totalExecution=totalExecution
					cycleArray.push(cycleJson)
					cycleJson={}
					console.log("8888888888888888888888******************",cycleArray)
				}
				responseData.testDetail = cycleArray
			} else{
				responseData.testDetail = []
			}
		} else {
			folderLists = await folderDao.list(data);
			responseData.folderList = folderLists
			//	let testIdsWithoutFolder = await folderDao.testWithoutFolder(data);
			getTestList = await folderDao.getTestList(data);
			console.log(getTestList)
			responseData.testDetail = getTestList
		}
		if (folderLists) {
			return { 'rescode': 200, 'msg': message.FOLDER_LIST, 'data': responseData };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},
	folderDetail: async data => {
		let folders = await folderDao.folderDetail(data);
		if (folders) {
			return { 'rescode': 200, 'msg': message.FOLDER_LIST, 'data': folders };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},
	listSubFolder: async data => {
		let responseData = {};
		let subFolders;
		let testListSubFolder;
		if (data.folder_category == 'testcase') {
			subFolders = await folderDao.subFolderCountTestcase(data);
			responseData.subFolder = subFolders;
			testListSubFolder = await folderDao.testcaseListWithFolder(data);
			responseData.testDetail = testListSubFolder
			let arrayTestcaseData =[];
			if(testListSubFolder.length>0){
				let idDoc;
				let dataTest2;
				for(let i=0; i<testListSubFolder.length;i++ ){
					let test_data2 = {};
					idDoc = testListSubFolder[i].doc_id
					dataTest2 = await folderDao.testcaseDocID(idDoc,data)
					test_data2.id = testListSubFolder[i].id
					test_data2.test_key = testListSubFolder[i].test_key
					test_data2.last_execution =testListSubFolder[i].last_execution
					test_data2.created_by =testListSubFolder[i].created_by
					test_data2.updated_by =testListSubFolder[i].updated_by
					test_data2.name=testListSubFolder[i].name
					test_data2.acct_id=dataTest2.acct_id
					test_data2.project_id=testListSubFolder[i].project_id
					test_data2.domain_id=testListSubFolder[i].domain_id
					test_data2.folder_id=testListSubFolder[i].folder_id
					test_data2.description=dataTest2.description
					test_data2.precondition=dataTest2.precondition ? dataTest2.precondition:""
					test_data2.owner=dataTest2.owner
					test_data2.status=dataTest2.status
					test_data2.priority=testListSubFolder[i].priority
					test_data2.priority_color=testListSubFolder[i].priority_color
					test_data2.component=dataTest2.component
					test_data2.estimated_time=dataTest2.estimated_time
					test_data2.folder_name=dataTest2.folder_name ? dataTest2.folder_name:""
					test_data2.label=dataTest2.label
					test_data2.testscript_type=dataTest2.testscript_type ? dataTest2.testscript_type:""
					test_data2.testscript=dataTest2.testscript ? dataTest2.testscript : ""
					test_data2.test_data=dataTest2.test_data ? dataTest2.test_data: ""
					test_data2.parameters=dataTest2.parameters ? dataTest2.parameters : ""
					test_data2.weblinks=dataTest2.weblinks ? dataTest2.weblinks : ""
					test_data2.issues=dataTest2.issues ? dataTest2.issues: ""
					test_data2.attachments=dataTest2.attachments ? dataTest2.attachments : ""
					test_data2.version=dataTest2.version
					test_data2.lock=dataTest2.lock
					test_data2.customFields=dataTest2.customFields ? dataTest2.customFields : ""
					test_data2.is_active=testListSubFolder[i].is_active
					test_data2.created_at=testListSubFolder[i].created_at
					test_data2.updated_at=testListSubFolder[i].updated_at
					test_data2.submit_status=dataTest2.submit_status
					arrayTestcaseData.push(test_data2);
				}
				responseData.testDetail = arrayTestcaseData
			} else {
				responseData.testDetail = []
			}
		} else if(data.folder_category == 'testcycle') {
			subFolders = await folderDao.subFolderList(data);
			responseData.subFolder = subFolders
			testListSubFolder = await folderDao.testListSubFolder(data);
			if(testListSubFolder.length){
				let cycleJson={}
				let cycleArray=[]
				for (const cycleElement of testListSubFolder) {
					let testcycle_id=cycleElement._id
					cycleJson._id=cycleElement._id
					cycleJson.acct_id=cycleElement.acct_id
					cycleJson.project_id=cycleElement.project_id
					cycleJson.domain_id=cycleElement.domain_id
					cycleJson.test_key=cycleElement.test_key
					cycleJson.last_execution=cycleElement.last_execution
					cycleJson.folder_id=cycleElement.folder_id
					cycleJson.name=cycleElement.name
					cycleJson.version=cycleElement.version
					cycleJson.description=cycleElement.description
					cycleJson.status=cycleElement.status
					cycleJson.owner=cycleElement.owner
					cycleJson.environment=cycleElement.environment
					cycleJson.assigned_to=cycleElement.assigned_to
					cycleJson.planned_start_date=cycleElement.planned_start_date
					cycleJson.planned_end_date=cycleElement.planned_end_date
					cycleJson.folder_name=cycleElement.folder_name
					cycleJson.weblinks=cycleElement.weblinks
					cycleJson.issues=cycleElement.issues
					cycleJson.testplans=cycleElement.testplans
					cycleJson.is_active=cycleElement.is_active
					cycleJson.submit_status=cycleElement.submit_status
					cycleJson.customFields=cycleElement.customFields
					let passExecution=0
					let failExecution=0
					let blockedExecution=0
					let notExecutedExecution=0
					let inProgressExecution=0
					fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
					let totalExecution=fetchCycleCases.length
					if(fetchCycleCases.length){
						for (const casesItem of fetchCycleCases){
							let testcase_ids = casesItem.testcase_id
							let version = casesItem.version
							fetchCycleCases = await folderDao.fetchExecutionData(testcase_ids,testcycle_id,version);
							if(fetchCycleCases.length){
								let testStatus=	fetchCycleCases[0].execution_status
								if(testStatus=="Not Executed"){
									notExecutedExecution++
								}
								if(testStatus=="In Progress"){
									inProgressExecution++
								}
								if(testStatus=="Pass"){
									passExecution++
								}
								if(testStatus=="Fail"){
									failExecution++
								}
								if(testStatus=="Blocked"){
									blockedExecution++
								}
							} else{
								notExecutedExecution++
							}
						}
					}
					cycleJson.passExecution=passExecution
					cycleJson.failExecution=failExecution
					cycleJson.blockedExecution=blockedExecution
					cycleJson.notExecutedExecution=notExecutedExecution
					cycleJson.inProgressExecution=inProgressExecution
					cycleJson.totalExecution=totalExecution
					cycleArray.push(cycleJson)
					cycleJson={}
					console.log("8888888888888888888888******************",cycleArray)
				}
				responseData.testDetail = cycleArray
			} else{
				responseData.testDetail = []
			}
		} else {
			subFolders = await folderDao.subFolderList(data);
			responseData.subFolder = subFolders
			testListSubFolder = await folderDao.testListSubFolder(data);
			responseData.testDetail = testListSubFolder
		}
		if (subFolders) {
			return { 'rescode': 200, 'msg': message.FOLDER_LIST, 'data': responseData };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}

	},
	testFlag: async data => {
		let response_data = {}
		if (data.test_type == 'testcase') {
			testFlags = await folderDao.testcaseFlag(data);
			if (testFlags.length) {
				response_data.test_flag = 1
			} else {
				response_data.test_flag = 0
			}
		} else {
			testFlags = await folderDao.otherTestFlag(data);
			if (testFlags.length) {
				response_data.test_flag = 1
			} else {
				response_data.test_flag = 0
			}
		}
		return { 'rescode': 200, 'msg': message.TEST_FLAG, 'data': response_data };
	},

}

module.exports = { folderService };