const testplanDao = require('../dao/testplan.dao').testplanDetails;
const folderTestplanDao = require('../dao/folder_test.dao').folderTestcase;
const userDao = require('../dao/user.dao').userDetails;
const message = require('../utils/message');
const { checkUserAccess,pdf_upload,get_signedUrl,image_delete,gcp_signedUrl } = require('../utils/utility')
var asyncLoop = require('node-async-loop');
const randomstring = require('randomstring')
const fs = require('fs');


const testplanService = {
	addTestPlan: async (data,files,regionData) => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data) {
			if(userAccess.data[0].allow_testplan_create == 1) {
				data['is_active'] = true;
				data['version'] = "1.0";
				let key_no
				let testPlanKeyDetail = await testplanDao.testPlanKeyDetail(data);
				if(testPlanKeyDetail.length){
				 key_no=testPlanKeyDetail[0].test_count
				key_no=key_no+1
				let test_key_data=data.test_key
				data['test_key'] = test_key_data + '-T'+key_no
				}
				let testplan = await testplanDao.add(data);
				if(testplan) {
					let testplanID = testplan._id.toString()
					let record = {};
					record['folder_id'] = testplan.folder_id? testplan.folder_id: null,
					record['project_id'] = testplan.project_id,
					record['domain_id'] = testplan.domain_id,
					record['test_type'] = 'testplan',
					record['doc_id'] = testplanID,
					record['updated_by'] = testplan.acct_id,
					record['created_by'] = testplan.acct_id
					await folderTestplanDao.addFolderTest(record);
					// test plan logs function start
					let testplanLogsData = {};
					testplanLogsData['test_id']=testplanID,
					testplanLogsData['created_by'] = data.acct_id,
					testplanLogsData['updated_by'] = data.acct_id,
					testplanLogsData['test_type'] ='testplan',
					testplanLogsData['description'] ='created test plan',
					await testplanDao.addTestplanLogs(testplanLogsData);
					// test plan test cycle mapping
					let cycleArray=data.testcycles
					let testcycleData=[]
					let cycle_object={}
					if(cycleArray.length){
						for (const test_element of cycleArray) {
							cycle_object.testplan_id=testplanID
							cycle_object.testcycle_id=test_element
							cycle_object.project_id=data.project_id
							cycle_object.domain_id=data.domain_id
							cycle_object.updated_by=data.acct_id
							cycle_object.created_by=data.acct_id
							testcycleData.push(cycle_object)
							cycle_object={}
						}
						await testplanDao.planCycleMapping(testcycleData);
						console.log("final_array",testcycleData)
					}
					// test plan attachment function works
					let attachmentSaverArray = [];
					let attachmentDetails = data.attachments
					if (attachmentDetails.length) {
						let attachmentCondition = {}
						attachmentCondition.project_id = data.project_id
						attachmentCondition.domain_id = data.domain_id
						attachmentCondition.testplanID = testplanID
						asyncLoop(attachmentDetails, async function(record, next_record) {
							if (files[record.file_key_name]['path']) {
								console.log("commihs sss")
								const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
								const imageBase64 = Buffer.from(bitmap).toString('base64');
								//const image_name =record.file_name
								let image_name = randomstring.generate({ length: 6, charset: 'numeric' });
								const imageName = `testplan/attachment-${image_name}.pdf`
								const file_type =record.file_type
								pdf_upload(imageBase64, imageName,file_type,regionData, (err, uploaded_image_url) => {
									if (err) {
										return { 'rescode': 401, 'msg': message.IMAGE_UPLOAD_ERROR, 'data': {} }
									} else {
										console.log("upoaddddddddddddddddd")
										var DBObject = {
											"operation": "new",
											"file_name": record.file_name,
											"file_url": imageName,
											"file_key_name": record.file_key_name,
											"uploaded_by": record.uploaded_by,
											"uploaded_on": record.uploaded_on,
											"size": record.size,
											"file_type": record.file_type,
										}
										attachmentSaverArray.push(DBObject);
										next_record();
									}
								})
							} else {
								console.log("geeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", attachmentSaverArray)
								return { 'rescode': 401, 'msg': message.IMAGE_MISSING, 'data': {} }
							}
						},
						async function(error) {
							await testplanDao.testplanAttachment(attachmentSaverArray, attachmentCondition);
							//console.log("attachmentSaverArrayattachmentSaverArray",attachmentSaverArray)

							return { 'rescode': 200, 'msg': message.TESTPLAN_ADDED, 'data': { 'testcase_id': testplan._id } };
						})
					}
					if(testPlanKeyDetail.length){
						await testplanDao.updatePlanKey(data,key_no);
					}
					return {'rescode': 200, 'msg': message.TESTPLAN_ADDED, 'data':{'testplan_id': testplan._id}};
				} else {
					return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
				}
			} else {
				return {'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {}}
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	delete: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testplan_delete === 1) {
			let testplan = await testplanDao.delete(data);
			if(testplan){
				await testplanDao.deleteTestplan(data);
		    }
			if(testplan) {
				return {'rescode': 200, 'msg': message.TESTPLAN_INACTIVE, 'data':{}};
			} else {
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
			}
		} else {
			return {'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {}}
		}
	},
	list: async data => {
		let testplans = await testplanDao.list(data);
		if(testplans) {
			return {'rescode': 200, 'msg': message.TESTPLAN_LIST, 'data': testplans};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}
	},
	testplanDetailById: async (data,regionData) => {
		let testplanData={}
		let cycles=[]
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testplan_view === 1) {
			let testplan = await testplanDao.testplanDetailById(data);
			if(testplan) {
			testplanData.testcycles=[]
			testplanData.name=testplan.name
			testplanData._id=testplan._id
			testplanData.acct_id=testplan.acct_id
			testplanData.project_id=testplan.project_id
			testplanData.domain_id=testplan.domain_id
			testplanData.folder_id=testplan.folder_id
			testplanData.description=testplan.description
			testplanData.objective=testplan.objective
			testplanData.status=testplan.status
			testplanData.owner=testplan.owner
			testplanData.folder_name=testplan.folder_name
			testplanData.label=testplan.label
			testplanData.custom_field=testplan.custom_field
			testplanData.weblinks=testplan.weblinks
			testplanData.submit_status=testplan.submit_status
			testplanData.test_key=testplan.test_key
			testplanData.priority=testplan.priority
			testplanData.is_active=testplan.is_active
			testplanData.version=testplan.version
			testplanData.createdAt=testplan.createdAt
			testplanData.updatedAt=testplan.updatedAt
			testplanData.attachments=testplan.attachments
				if(testplanData){
					console.log("hello it is main part  of this ",testplanData)
					let fetchCyclePlan = await testplanDao.fetchCyclePlan(data);
					let cycle_json={}
					if(fetchCyclePlan.length){
						for (const element of fetchCyclePlan) {
							let testcycle_ids=element.testcycle_id
							console.log("testcycle_ids testcycle_ids",testcycle_ids)
							let cycleDetails = await testplanDao.cycleDetails(testcycle_ids,data);
							cycles.push(cycleDetails)
							//console.log("cycleDetails cycleDetails",cycles)
						}
					}
						testplanData.testcycles=cycles
						console.log("hello it is main part  of this ",testplanData)
						if(testplan.attachments){
							let attachmentsData=[];
							for (const item of testplan.attachments){
								let attachmentsJson={}
								//attachmentsJson.operation=item.operation
								console.log("sssssssssssssssssssssfile_url",item.file_url)
								if (item.file_url != null && item.file_url != "") {
									let signed_url = await getSignedUrl(item.file_url,regionData);
									console.log("jaskbdkajsd",signed_url)
									attachmentsJson.operation=item.operation
									attachmentsJson.file_name=item.file_name
									attachmentsJson.file_url=item.file_url
									attachmentsJson.file_key_name=item.file_key_name
									attachmentsJson.uploaded_by=item.uploaded_by
									attachmentsJson.uploaded_on=item.uploaded_on
									attachmentsJson.size=item.size
									attachmentsJson.file_type=item.file_type
									attachmentsJson.signed_file_url=signed_url
									attachmentsData.push(attachmentsJson)
								} else {
									attachmentsJson.operation=item.operation
									attachmentsJson.file_name=item.file_name
									attachmentsJson.file_url=item.file_url
									attachmentsJson.file_key_name=item.file_key_name
									attachmentsJson.uploaded_by=item.uploaded_by
									attachmentsJson.uploaded_on=item.uploaded_on
									attachmentsJson.size=item.size
									attachmentsJson.file_type=item.file_type
									attachmentsJson.signed_file_url=null
									attachmentsData.push(attachmentsJson)
								}
							}
							console.log("attachmentsDataattachmentsDataattachmentsData",attachmentsData)
							testplanData.attachments=attachmentsData;
							return {'rescode': 200, 'msg': message.TESTPLAN_DETAIL, 'data': testplanData};
						} else{
							testplanData.attachments=[]
							return {'rescode': 200, 'msg': message.TESTPLAN_DETAIL, 'data': testplanData};
						}
				} else {
					return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
				}
			} else {
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	updateTestplan: async (data, files,regionData) => {
		data.folder_id = data.folder_id ? data.folder_id : null;
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testplan_edit === 1) {
			let updateData = {};
			let keys = Object.keys(data);
			for(key of keys) {
			    if (data.hasOwnProperty(key) && key != 'testplan_id') 
			        updateData[key] = data[key];
			}
			let testplan = await testplanDao.update(data.testplan_id, updateData);
			if(testplan) {
				let record = {};
				record['folder_id'] = data.folder_id ? data.folder_id : null,
					record['project_id'] = data.project_id,
					record['domain_id'] = data.domain_id,
					record['updated_by'] = data.acct_id
				await folderTestplanDao.updateFolderTestplan(data.testplan_id,record);
				let testplanLogsData = {};
					testplanLogsData['test_id']=data.testplan_id,
					testplanLogsData['created_by'] = data.acct_id,
					testplanLogsData['updated_by'] = data.acct_id,
					testplanLogsData['test_type'] ='testplan',
					testplanLogsData['description'] ='made changes on',
					testplanLogsData['field_data'] =data.field_data,
					await testplanDao.addTestplanLogs(testplanLogsData);
				await testplanDao.planCycleDeleteMapping(data);
				// test plan test cycle mapping
				let cycleArray=data.testcycles
				let testcycleData=[]
				let cycle_object={}
				if(cycleArray.length){
					for (const test_element of cycleArray) {
						cycle_object.testplan_id=data.testplan_id
						cycle_object.testcycle_id=test_element
						cycle_object.project_id=data.project_id
						cycle_object.domain_id=data.domain_id
						cycle_object.updated_by=data.acct_id
						cycle_object.created_by=data.acct_id
						testcycleData.push(cycle_object)
						cycle_object={}
					}
					await testplanDao.planCycleMapping(testcycleData);
					console.log("final_array",testcycleData)
				}
				let  attachmentSaverArray = [];
				let attachmentDetails=data.attachments
				if(attachmentDetails.length){
					let attachmentCondition={}
					attachmentCondition.project_id=data.project_id
					attachmentCondition.domain_id=data.domain_id
					attachmentCondition.testplanID=data.testplan_id
					asyncLoop(attachmentDetails, async function(record, next_record) {
						if(record.operation == 'new'){
							if (files[record.file_key_name]['path']) {
								console.log("commihs sss")
								const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
								const imageBase64 =  Buffer.from(bitmap).toString('base64');
								//const image_name =record.file_name
								let image_name = randomstring.generate({length: 6,charset: 'numeric'});
								const imageName = `testcase/attachment-${image_name}.pdf`
								const file_type =record.file_type
								pdf_upload(imageBase64, imageName,file_type,regionData, (err, uploaded_image_url) => {
									if (err) {
										return { 'rescode': 401, 'msg': message.IMAGE_UPLOAD_ERROR, 'data': {} }
									} else {
										console.log("upoaddddddddddddddddd")
										var DBObject = {
											"operation": "new",
											"file_name": record.file_name,
											"file_url": imageName,
											"file_key_name": record.file_key_name,
											"uploaded_by": record.uploaded_by,
											"uploaded_on": record.uploaded_on,
											"size": record.size,
											"file_type": record.file_type,
										}
										attachmentSaverArray.push(DBObject);
										next_record();
									}
								})
							} else {
								console.log("geeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",attachmentSaverArray)
								return { 'rescode': 401, 'msg': message.IMAGE_MISSING, 'data': {} }
							}
						} else if(record.operation == 'no_change'){
							var DBObject = {
								"operation": "no_change",
								"file_name": record.file_name,
								"file_url": record.file_url,
								"file_key_name": record.file_key_name,
								"uploaded_by": record.uploaded_by,
								"uploaded_on": record.uploaded_on,
								"size": record.size,
								"file_type": record.file_type,
							}
							attachmentSaverArray.push(DBObject);
							next_record();
							
						}else if(record.operation == 'remove') {
							image_delete(record.file_url, (err, delete_image_url) => {
								if (err) {
									next_record();
								} else {
									next_record();
								}
							})
						}

						//console.log("Record", record);
						//console.log(files)
						
					},
					async function(error) {
						await testplanDao.testplanAttachment(attachmentSaverArray,attachmentCondition);
						//console.log("attachmentSaverArrayattachmentSaverArray",attachmentSaverArray)
						return { 'rescode': 200, 'msg': message.TESTPLAN_UPDATE, 'data': testplan };
					})
				}
				return {'rescode': 200, 'msg': message.TESTPLAN_UPDATE, 'data': testplan};
			} else {
				return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
			}
		} else {
			return {'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {}}
		}
	},

	cycleList: async data => {
		if(data.project_id){
			let projectIds=data.project_id.split(',') 
			data['project_id'] = projectIds;
		} else{
			data['project_id'] = null;
		}
		let cycleLists = await testplanDao.cycleList(data);
		if(cycleLists) {
			return {'rescode': 200, 'msg': message.TESTCYCLE_LIST, 'data': cycleLists};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}
	},
	history: async data => {
		let historyData = await testplanDao.history(data);
		if(historyData) {
			return {'rescode': 200, 'msg': message.TESTCYCLE_LIST, 'data': historyData};
		} else {
			return {'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {}}
		}
	},

	
	
}
function getSignedUrl(fileUrl,regionData) {
    return new Promise((resolve, reject) => {
        try {
            gcp_signedUrl(fileUrl,regionData, (err, signed_data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(signed_data)
                }
            })
        }catch(err) {
            return reject(err)
        }
    })
}
module.exports = {testplanService};