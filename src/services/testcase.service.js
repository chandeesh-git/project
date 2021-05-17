const testcaseDao = require('../dao/testcase.dao').testcaseDetails;
const testcycleDao = require('../dao/testcycle.dao').testcycleDetails;
const testplanDao = require('../dao/testplan.dao').testplanDetails;
const testExecutionDao = require('../dao/testexecution.dao').testExecutionDetails;
const folderTestcaseDao = require('../dao/folder_test.dao').folderTestcase;
const userDao = require('../dao/user.dao').userDetails;
const message = require('../utils/message');
const { checkUserAccess, pdf_upload, get_signedUrl,image_delete,gcp_signedUrl } = require('../utils/utility')
const testcaseDetailsMaster = require('../dao/testcase_details.dao').testcaseDetailsMaster;
const testcaseVersionMapping = require('../dao/testcase_version.dao').testcaseVersion;
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const excel = require("exceljs");
const fs = require('fs');
var asyncLoop = require('node-async-loop');
const randomstring = require('randomstring')
const { response } = require('../utils/utility');

const testcaseService = {
	addTestCase: async (data, files,regionData) => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data) {
			if (userAccess.data[0].allow_testcase_create == 1) {
				data['is_active'] = true;
				data['version'] = "1.0";
				let testcase = await testcaseDao.add(data);
				if (testcase) {
					let testcaseID = testcase._id.toString()
					let record = {};
					let domainStr = testcase.domain_id
					let keyValue = domainStr.substring(0, 3);
					record['folder_id'] = testcase.folder_id ? testcase.folder_id : null,
						record['project_id'] = testcase.project_id,
						record['domain_id'] = testcase.domain_id,
						record['name'] = testcase.name,
						record['test_key'] = keyValue + '-T',
						record['priority'] = testcase.priority,
						record['updated_by'] = testcase.acct_id,
						record['created_by'] = testcase.acct_id
					record['submit_status'] = testcase.submit_status
					let testcaseDetailsData = await testcaseDetailsMaster.addTestcaseDetails(record);
					if (testcaseDetailsData) {
						let updateKey = {};
						updateKey['test_key'] = testcaseDetailsData.test_key + testcaseDetailsData.id;
						updateKey['id'] = testcaseDetailsData.id;
						await testcaseDetailsMaster.updateTescaseKey(updateKey)
						let testcaseVersion = {}
						testcaseVersion['testcase_detail_id'] = testcaseDetailsData.id,
							testcaseVersion['doc_id'] = testcaseID,
							testcaseVersion['version'] = testcase.version,
							testcaseVersion['created_by'] = testcase.acct_id,
							testcaseVersion['updated_by'] = testcase.acct_id
						await testcaseVersionMapping.addTestcaseVersion(testcaseVersion);
						// let testcaseLogsData = {};
						// testcaseLogsData['doc_id']= testcaseID,
						// testcaseLogsData['test_id']=testcaseDetailsData.id,
						// testcaseLogsData['description']='created test case on  ',
						// testcaseLogsData['version']=data.version,
						// testcaseLogsData['created_by'] = testcase.acct_id,
						// testcaseLogsData['updated_by'] = testcase.acct_id,
						// testcaseLogsData['test_type'] ='testcase',
						// await testcaseDetailsMaster.addTestcaseLogs(testcaseLogsData);
					}
					//data.issues=JSON.parse(data.issues)
					if (data.issues) {
						let issuesData = {}
						for (const issuesElement of data.issues) {
							issuesData.issue_id = issuesElement.issue_id
							issuesData.issue_type = issuesElement.issue_type
							issuesData.issue_name = issuesElement.issue_name
							issuesData.issue_key = issuesElement.issue_key
							issuesData.issue_to_link = issuesElement.issue_to_link
							issuesData.issue_status = issuesElement.issue_status
							issuesData.issue_icon = issuesElement.issue_icon
							issuesData.test_type = issuesElement.test_type
							issuesData.issue_priority = issuesElement.issue_priority
							issuesData.test_id = testcaseDetailsData.id
							issuesData.project_id = data.project_id
							issuesData.domain_id = data.domain_id
							issuesData.created_by = data.acct_id
							issuesData.updated_by = data.acct_id
							issuesData.version = data.version
							await testcaseDao.addIssues(issuesData);
						}
					}
					let attachmentSaverArray = [];
					let attachmentDetails = data.attachments
					if (attachmentDetails.length) {
						let attachmentCondition = {}
						attachmentCondition.project_id = data.project_id
						attachmentCondition.domain_id = data.domain_id
						attachmentCondition.testcaseID = testcaseID
						asyncLoop(attachmentDetails, async function (record, next_record) {
							if (files[record.file_key_name]['path']) {
								const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
								const imageBase64 = Buffer.from(bitmap).toString('base64');
								let image_name = randomstring.generate({ length: 6, charset: 'numeric' });
								const imageName = `testcase/attachment-${image_name}.pdf`
								const file_type = record.file_type
								pdf_upload(imageBase64, imageName, file_type,regionData, (err, uploaded_image_url) => {
									if (err) {
										return { 'rescode': 401, 'msg': message.IMAGE_UPLOAD_ERROR, 'data': {} }
									} else {
										var DBObject = {
											"operation": "new",
											"file_name": record.file_name,
											"file_url": imageName,
											"file_key_name": record.file_name,
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
								return { 'rescode': 401, 'msg': message.IMAGE_MISSING, 'data': {} }
							}
						},
							async function (error) {
								await testcaseDao.updateAttachment(attachmentSaverArray, attachmentCondition);

								return { 'rescode': 200, 'msg': message.TESTCASE_ADDED, 'data': { 'testcase_id': testcaseDetailsData.id } };
							})
					}
					return { 'rescode': 200, 'msg': message.TESTCASE_ADDED, 'data': { 'testcase_id': testcaseDetailsData.id } };
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
		if (userAccess.data && userAccess.data[0].allow_testcase_delete === 1) {
			//let testcase = await testcaseDao.delete(data);
			let deleteMapping = await testcaseDao.deleteTestcase(data);
			if (deleteMapping) {
				return { 'rescode': 200, 'msg': message.TESTCASE_INACTIVE, 'data': {} };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	list: async data => {
		let testcases = await testcaseDao.list(data);
		if (testcases) {
			return { 'rescode': 200, 'msg': message.TESTCASES_LIST, 'data': testcases };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},
	listOwner: async data => {
		let cloudUsersRecords = [];;
		let roleData;
		let groupData;
		// let ownerList = await testcaseDao.listOwner(data);
		let cloudAppUser = await testcaseDao.userFromCloudApp({ 'project_id': data.project_id, 'domain_id': data.domain_id });
		let arrayUsers = [];
		if (cloudAppUser.length && cloudAppUser[0].allow_testcase_create == 1 && cloudAppUser[0].allow_testcase_read == 1 && cloudAppUser[0].allow_testcase_edit == 1) {
			let data = {};
			data['jira_acct_id'] = cloudAppUser[0].acct_id;
			data['user_name'] = cloudAppUser[0].user_name;
			cloudUsersRecords.push(data)
		}
		let usersFromRoleTable = await testcaseDao.userFromRole({ 'project_id': data.project_id, 'domain_id': data.domain_id, 'test_type': data.test_type })
		if (usersFromRoleTable.length) {
			roleData = usersFromRoleTable
		} else {
			roleData = []
		}

		arrayUsers = roleData.concat(cloudUsersRecords)
		let userFromGroup = await testcaseDao.usersFromGroup({ 'project_id': data.project_id, 'domain_id': data.domain_id, 'test_type': data.test_type });
		if (userFromGroup.length) {
			groupData = userFromGroup
		} else {
			groupData = []
		}
		let roleGroupMergedData = arrayUsers.concat(groupData)
		var resArr = [];
		roleGroupMergedData.filter(function (item) {
			var i = resArr.findIndex(x => x.jira_acct_id == item.jira_acct_id);
			if (i <= -1) {
				resArr.push({ jira_acct_id: item.jira_acct_id, user_name: item.user_name });
			}
			return null;
		});
		if (resArr) {
			return { 'rescode': 200, 'msg': message.OWNER_LIST, 'data': resArr };
		} else {
			return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
		}
	},
	testcaseDetail: async (data,regionData) => {
		let response_data = {}
		response_data.id = data.testcase_id
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			let testcase;
			let versionDetails;
			let docId;
			if (data.version) {
				versionDetails = await testcaseDao.testDetailWithVersion(data);
				docId = versionDetails[0];
			} else {
				versionDetails = await testcaseDao.testDetailLatest(data);
				docId = versionDetails[0];
			}
			testcase = await testcaseDao.detail(docId);
			response_data.name = testcase.name
			response_data.acct_id = testcase.acct_id
			response_data.project_id = testcase.project_id
			response_data.domain_id = testcase.domain_id
			response_data.folder_id = testcase.folder_id
			response_data.description = testcase.description
			response_data.objective = testcase.objective
			response_data.precondition = testcase.precondition
			response_data.owner = testcase.owner
			response_data.status = testcase.status
			response_data.priority = testcase.priority
			response_data.component = testcase.component
			response_data.estimated_time = testcase.estimated_time
			response_data.folder_name = testcase.folder_name
			response_data.label = testcase.label
			response_data.testscript_type = testcase.testscript_type
			response_data.testscript = testcase.testscript
			response_data.test_data = testcase.test_data
			response_data.parameters = testcase.parameters
			response_data.weblinks = testcase.weblinks
			//response_data.attachments=testcase.attachments
			response_data.version = testcase.version
			response_data.lock = testcase.lock
			response_data.customFields = testcase.customFields
			response_data.is_active = testcase.is_active
			response_data.createdAt = testcase.createdAt
			response_data.updatedAt = testcase.updatedAt
			response_data.submit_status = testcase.submit_status
			fetchIssues = await testcaseDao.fetchIssues(data, testcase.version);
			let issuesData = {}
			if (fetchIssues.length) {
				response_data.issues = fetchIssues
			} else {
				response_data.issues = []
			}
			if (testcase.attachments) {
				let attachmentsData = [];
				for (const item of testcase.attachments) {
					let attachmentsJson = {}
					//attachmentsJson.operation=item.operation
					if (item.file_url != null && item.file_url != "") {
						let signed_url = await getSignedUrl(item.file_url,regionData);
						attachmentsJson.operation = item.operation
						attachmentsJson.file_name = item.file_name
						attachmentsJson.file_url = item.file_url
						attachmentsJson.file_key_name = item.file_key_name
						attachmentsJson.uploaded_by = item.uploaded_by
						attachmentsJson.uploaded_on = item.uploaded_on
						attachmentsJson.size = item.size
						attachmentsJson.file_type = item.file_type
						attachmentsJson.signed_file_url = signed_url
						attachmentsData.push(attachmentsJson)
					} else {
						attachmentsJson.operation = item.operation
						attachmentsJson.file_name = item.file_name
						attachmentsJson.file_url = item.file_url
						attachmentsJson.file_key_name = item.file_key_name
						attachmentsJson.uploaded_by = item.uploaded_by
						attachmentsJson.uploaded_on = item.uploaded_on
						attachmentsJson.size = item.size
						attachmentsJson.file_type = item.file_type
						attachmentsJson.signed_file_url = null
						attachmentsData.push(attachmentsJson)
					}
				}
				response_data.attachments = attachmentsData;
				return { 'rescode': 200, 'msg': message.TESTCASE_DETAIL, 'data': response_data };
			} else {
				response_data.attachments = []
				return { 'rescode': 200, 'msg': message.TESTCASE_DETAIL, 'data': response_data };
			}
			//return { 'rescode': 200, 'msg': message.TESTCASE_DETAIL, 'data': response_data };
			if (!response_data) {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	updateTestcase: async (data, files,regionData) => {
		data.folder_id = data.folder_id ? data.folder_id : null;
		let [userAccess, checkVersion] = await Promise.all([checkUserAccess(data), testcaseDao.checkVersion(data)]);
		if (userAccess.data && userAccess.data[0].allow_testcase_edit === 1) {
			if (checkVersion.length) {
				if (checkVersion[0].is_lock == true && data.lock == true) {
					return { 'rescode': 401, 'msg': message.TESTCASE_LOCKED, 'data': {} }
				} else {
					let testcase_doc_id = checkVersion[0].doc_id;
					let updateData = {};
					let keys = Object.keys(data);
					for (key of keys) {
						if (data.hasOwnProperty(key) && key != 'testcase_id')
							updateData[key] = data[key];
					}
					let testcase = await testcaseDao.update(testcase_doc_id, updateData);
					let testcaseDetail = await testcaseDao.updateTestcaseDetail(data);
					let updateTestcaseVersion = await testcaseDao.updateTestcaseVersion(testcase_doc_id, data);
					// to create logs entry for history section
					let testcaseLogsData = {};
					testcaseLogsData['doc_id'] = testcase_doc_id,
						testcaseLogsData['test_id'] = data.testcase_id,
						testcaseLogsData['description'] = 'made changes on',
						testcaseLogsData['version'] = data.version,
						testcaseLogsData['created_by'] = data.acct_id,
						testcaseLogsData['updated_by'] = data.acct_id,
						testcaseLogsData['test_type'] = 'testcase',
						testcaseLogsData['field_data'] = data.field_data,
						await testcaseDetailsMaster.addTestcaseLogs(testcaseLogsData);
					// to delete the old issue 
					await testcaseDao.deleteIssues(data);
					// to generate new issue 	
					if (data.issues) {
						let issuesData = {}
						for (const issuesElement of data.issues) {
							issuesData.issue_id = issuesElement.issue_id
							issuesData.issue_type = issuesElement.issue_type
							issuesData.issue_name = issuesElement.issue_name
							issuesData.issue_key = issuesElement.issue_key
							issuesData.issue_to_link = issuesElement.issue_to_link
							issuesData.issue_status = issuesElement.issue_status
							issuesData.issue_icon = issuesElement.issue_icon
							issuesData.test_type = issuesElement.test_type
							issuesData.issue_priority = issuesElement.issue_priority
							issuesData.test_id = data.testcase_id
							issuesData.project_id = data.project_id
							issuesData.domain_id = data.domain_id
							issuesData.created_by = data.acct_id
							issuesData.updated_by = data.acct_id
							issuesData.version = data.version
							await testcaseDao.addIssues(issuesData);
						}
					}
					if (testcase) {
						let attachmentSaverArray = [];
						let attachmentDetails = data.attachments
						if (attachmentDetails.length) {
							let attachmentCondition = {}
							attachmentCondition.project_id = data.project_id
							attachmentCondition.domain_id = data.domain_id
							attachmentCondition.testcaseID = testcase_doc_id
							asyncLoop(attachmentDetails, async function (record, next_record) {
								if (record.operation == 'new') {
									if (files[record.file_key_name]['path']) {
										const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
										const imageBase64 = Buffer.from(bitmap).toString('base64');
										//const image_name =record.file_name
										let image_name = randomstring.generate({ length: 6, charset: 'numeric' });
										const imageName = `testcase/attachment-${image_name}.pdf`
										const file_type = record.file_type
										pdf_upload(imageBase64, imageName, file_type,regionData, (err, uploaded_image_url) => {
											if (err) {
												return { 'rescode': 401, 'msg': message.IMAGE_UPLOAD_ERROR, 'data': {} }
											} else {
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
										return { 'rescode': 401, 'msg': message.IMAGE_MISSING, 'data': {} }
									}
								} else if (record.operation == 'no_change') {
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

								} else if (record.operation == 'remove') {
									image_delete(record.file_url, regionData, (err, delete_image_url) => {
										if (err) {
											next_record();
										} else {
											next_record();
										}
									})
								}
							},
								async function (error) {
									await testcaseDao.updateAttachment(attachmentSaverArray, attachmentCondition);
									//console.log("attachmentSaverArrayattachmentSaverArray",attachmentSaverArray)
									return { 'rescode': 200, 'msg': message.TESTCASE_UPDATE, 'data': testcase };
								})
						}
						return { 'rescode': 200, 'msg': message.TESTCASE_UPDATE, 'data': testcase };
					} else {
						return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
					}
				}
			} else {
				await testcaseDao.updateOldVersion(data);
				let fetchOldDocId = await testcaseDao.fetchOldDocId(data);
				if (fetchOldDocId.length) {
					for (const doc_element of fetchOldDocId) {
						let documentID = doc_element.doc_id
						await testcaseDao.oldVersionLockUpdate(documentID);
					}
				}
				data['is_active'] = true;
				let testcase = await testcaseDao.add(data);
				let testcaseID = testcase._id.toString()
				let testcaseVersion = {}
				testcaseVersion['testcase_detail_id'] = data.testcase_id,
					testcaseVersion['doc_id'] = testcaseID,
					testcaseVersion['version'] = data.version,
					testcaseVersion['is_lock'] = data.lock
				testcaseVersion['created_by'] = data.acct_id,
					testcaseVersion['updated_by'] = data.acct_id
				let testcaseDetail = await testcaseDao.updateTestcaseDetail(data);
				await testcaseVersionMapping.addTestcaseVersion(testcaseVersion);
				await testcaseDao.deleteIssues(data);
				if (data.issues) {
					let issuesData = {}
					for (const issuesElement of data.issues) {
						issuesData.issue_id = issuesElement.issue_id
						issuesData.issue_type = issuesElement.issue_type
						issuesData.issue_name = issuesElement.issue_name
						issuesData.issue_key = issuesElement.issue_key
						issuesData.issue_to_link = issuesElement.issue_to_link
						issuesData.issue_status = issuesElement.issue_status
						issuesData.issue_icon = issuesElement.issue_icon
						issuesData.test_type = issuesElement.test_type
						issuesData.issue_priority = issuesElement.issue_priority
						issuesData.test_id = data.testcase_id
						issuesData.project_id = data.project_id
						issuesData.domain_id = data.domain_id
						issuesData.created_by = data.acct_id
						issuesData.updated_by = data.acct_id
						issuesData.version = data.version
						await testcaseDao.addIssues(issuesData);
					}
				}
				if (testcase) {
					let attachmentSaverArray = [];
					let attachmentDetails = data.attachments
					if (attachmentDetails.length) {
						let attachmentCondition = {}
						attachmentCondition.project_id = data.project_id
						attachmentCondition.domain_id = data.domain_id
						attachmentCondition.testcaseID = testcaseID
						asyncLoop(attachmentDetails, async function (record, next_record) {
							if (files[record.file_key_name]['path']) {
								const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
								const imageBase64 = Buffer.from(bitmap).toString('base64');
								//const image_name =record.file_name
								let image_name = randomstring.generate({ length: 6, charset: 'numeric' });
								const imageName = `testcase/attachment-${image_name}.pdf`
								const file_type = record.file_type
								pdf_upload(imageBase64, imageName, file_type,regionData, (err, uploaded_image_url) => {
									if (err) {
										return { 'rescode': 401, 'msg': message.IMAGE_UPLOAD_ERROR, 'data': {} }
									} else {
										var DBObject = {
											"operation": "new",
											"file_name": record.file_name,
											"file_url": imageName,
											"file_key_name": record.file_name,
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
								return { 'rescode': 401, 'msg': message.IMAGE_MISSING, 'data': {} }
							}
						},
							async function (error) {
								await testcaseDao.updateAttachment(attachmentSaverArray, attachmentCondition);
								//console.log("attachmentSaverArrayattachmentSaverArray",attachmentSaverArray)
								return { 'rescode': 200, 'msg': message.TESTCASE_UPDATE, 'data': testcase };
							})
					}
					return { 'rescode': 200, 'msg': message.TESTCASE_UPDATE, 'data': testcase };
				} else {
					return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
				}
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	cloneTestCase: async data => {
		let cloneTestData = {}
		let testDetailData = {}
		let cloneTestDocId = {}
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_create === 1) {
			// get the test detail from testcase_detail table
			let testcaseData = await testcaseDao.cloneLatestTest(data);
			if (testcaseData) {
				let testcase_name = testcaseData[0].name
				testcase_name = `${testcase_name}(cloned)`,
					testDetailData.name = testcase_name
				testDetailData.domain_id = testcaseData[0].domain_id
				testDetailData.project_id = testcaseData[0].project_id
				testDetailData.folder_id = testcaseData[0].folder_id
				testDetailData.priority = testcaseData[0].priority
				testDetailData.test_key = testcaseData[0].test_key
				testDetailData.created_by = data.acct_id
				testDetailData.updated_by = data.acct_id
				// insert the testcase data in testcase_detail table
				let testcaseDetails = await testcaseDetailsMaster.addTestcaseDetails(testDetailData);
				cloneTestDocId.doc_id = testcaseData[0].doc_id
				let testcase = await testcaseDao.detail(cloneTestDocId);
				cloneTestData.name = testcase_name
				cloneTestData.acct_id = testcase.acct_id
				cloneTestData.project_id = testcase.project_id
				cloneTestData.domain_id = testcase.domain_id
				cloneTestData.folder_id = testcase.folder_id
				cloneTestData.description = testcase.description
				cloneTestData.precondition = testcase.precondition
				cloneTestData.objective = testcase.objective
				cloneTestData.owner = testcase.owner
				cloneTestData.status = testcase.status
				cloneTestData.priority = testcase.priority
				cloneTestData.component = testcase.component
				cloneTestData.estimated_time = testcase.estimated_time
				cloneTestData.folder_name = testcase.folder_name
				cloneTestData.label = testcase.label
				cloneTestData.testscript_type = testcase.testscript_type
				cloneTestData.testscript = testcase.testscript
				cloneTestData.test_data = testcase.test_data
				cloneTestData.parameters = testcase.parameters
				cloneTestData.weblinks = testcase.weblinks
				cloneTestData.issues = testcase.issues
				cloneTestData.attachments = testcase.attachments
				cloneTestData.lock = 0
				cloneTestData.customFields = testcase.customFields
				cloneTestData.is_active = testcase.is_active
				cloneTestData.submit_status = testcase.submit_status
				cloneTestData.version = "1.0"
				let testcaseAdd = await testcaseDao.add(cloneTestData);
				let testcaseID = testcaseAdd._id.toString()
				let testcaseVersion = {}
				testcaseVersion['testcase_detail_id'] = testcaseDetails.id,
					testcaseVersion['doc_id'] = testcaseID,
					testcaseVersion['version'] = '1.0',
					testcaseVersion['is_lock'] = 0,
					testcaseVersion['created_by'] = data.acct_id,
					testcaseVersion['updated_by'] = data.acct_id

				await testcaseVersionMapping.addTestcaseVersion(testcaseVersion);
				let updateKey = {};
				let domainStr = testcaseData[0].domain_id
				let keyValue = domainStr.substring(0, 3);
				keyValue = keyValue + '-T',
				updateKey['test_key'] = keyValue + testcaseDetails.id;
				updateKey['id'] = testcaseDetails.id;
				await testcaseDetailsMaster.updateTescaseKey(updateKey)

				// to clone the jira issue of testcase
				fetchIssues = await testcaseDao.fetchIssues(data, testcase.version);
				if (fetchIssues.length) {
					let issuesData = {}
					for (const issuesElement of fetchIssues) {
						issuesData.issue_id = issuesElement.issue_id
						issuesData.issue_type = issuesElement.issue_type
						issuesData.issue_name = issuesElement.issue_name
						issuesData.issue_key = issuesElement.issue_key
						issuesData.issue_to_link = issuesElement.issue_to_link
						issuesData.issue_status = issuesElement.issue_status
						issuesData.issue_icon = issuesElement.issue_icon
						issuesData.test_type = issuesElement.test_type
						issuesData.issue_priority = issuesElement.issue_priority
						issuesData.test_id = testcaseDetails.id
						issuesData.project_id = data.project_id
						issuesData.domain_id = data.domain_id
						issuesData.created_by = data.acct_id
						issuesData.updated_by = data.acct_id
						issuesData.version = "1.0"
						await testcaseDao.addIssues(issuesData);
					}
				}
				return { 'rescode': 200, 'msg': message.CLONE_ADD, 'data': null };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	listVersion: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			let versionList = await testcaseDao.versionListData(data);
			if (versionList) {
				return { 'rescode': 200, 'msg': message.VERSION_LIST, 'data': versionList };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	searchTest: async data => {
		let userAccess = await checkUserAccess(data);
		// if test_type is testcase then check allow_testcase_read 
		if (data.test_type == "testcase") {
			if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
				testcaseSearch = await testcaseDao.testcaseSearch(data);
				return { 'rescode': 200, 'msg': message.TESTCASE_DETAIL, 'data': testcaseSearch };
			} else {
				return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
			}
			// if test_type is testcycle then check allow_testcycle_view 
		} else if (data.test_type == "testcycle") {
			if (userAccess.data && userAccess.data[0].allow_testcycle_view === 1) {
				testcycleSearch = await testcycleDao.testcycleSearch(data);
				return { 'rescode': 200, 'msg': message.TESTCASE_DETAIL, 'data': testcycleSearch };
			} else {
				return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
			}
			// if test_type is testplan then check allow_testplan_view 
		} else {
			if (userAccess.data && userAccess.data[0].allow_testplan_view === 1) {
				testplanSearch = await testplanDao.testplanSearch(data);
				return { 'rescode': 200, 'msg': message.TESTCASE_DETAIL, 'data': testplanSearch };
			} else {
				return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
			}
		}
	},
	testcaseHistory: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			let testcaseHistory = await testcaseDetailsMaster.testcaseHistory(data);
			if (testcaseHistory) {
				return { 'rescode': 200, 'msg': message.TESTCASE_HISTORY, 'data': testcaseHistory };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	importDatas: async (results, testcaseData) => {
		let accessData = {};
		accessData['domain_id'] = testcaseData.domain_id;
		accessData['project_id'] = testcaseData.project_id;
		accessData['acct_id'] = testcaseData.acct_id;
		let userAccess = await checkUserAccess(accessData);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			results.forEach(async (item, index_no) => {
				item['is_active'] = true;
				item['version'] = "1.0";
				item['lock'] = false;
				item['submit_status'] = false;
				item['folder_id'] = null;
				item['owner'] = null;
				item['customFields'] = "[]";
				item['testscript_type'] = "plain_test";
				item['testscript'] = "";
				item['test_data'] = "[]";
				item['parameters'] = "[]";
				item['weblinks'] = "[]";
				item['attachments'] = [];
				item['issues'] = [];
				item['domain_id'] = testcaseData.domain_id
				item['project_id'] = testcaseData.project_id;
				item['acct_id'] = testcaseData.acct_id;
				if (!!item['label']) {
					item['label'] = JSON.stringify(item['label'].split(','))
				}
				else {
					item['label'] = null;
				}
				let testcase = await testcaseDao.add(item);
				let testcaseID = testcase._id.toString()
				let record = {};
				let domainStr = testcase.domain_id
				let keyValue = domainStr.substring(0, 3);
				record['folder_id'] = testcase.folder_id ? testcase.folder_id : null,
					record['project_id'] = testcase.project_id,
					record['domain_id'] = testcase.domain_id,
					record['name'] = testcase.name,
					record['test_key'] = keyValue + '-T',
					record['priority'] = testcase.priority,
					record['submit_status'] = testcase.submit_status
				record['updated_by'] = testcase.acct_id,
					record['created_by'] = testcase.acct_id
				let testcaseDetailsData = await testcaseDetailsMaster.addTestcaseDetails(record);
				let updateKey = {};
				updateKey['test_key'] = testcaseDetailsData.test_key + testcaseDetailsData.id;
				updateKey['id'] = testcaseDetailsData.id;
				await testcaseDetailsMaster.updateTescaseKey(updateKey)
				let testcaseVersion = {}
				testcaseVersion['testcase_detail_id'] = testcaseDetailsData.id,
					testcaseVersion['doc_id'] = testcaseID,
					testcaseVersion['version'] = testcase.version,
					testcaseVersion['created_by'] = testcase.acct_id,
					testcaseVersion['updated_by'] = testcase.acct_id
				let versionMapping = await testcaseVersionMapping.addTestcaseVersion(testcaseVersion);
			})
			return { 'rescode': 200, 'msg': message.TESTCASE_ADDED, 'data': {} };
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	testcaseVersionCompare: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			let ids = JSON.parse(data.testcase_id);
			let testcaseVersionDetails = await testcaseDao.testcaseVersionCompare(ids, data);
			if (testcaseVersionDetails) {
				return { 'rescode': 200, 'msg': message.TESTCASE_VERSION_HISTORY, 'data': testcaseVersionDetails };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	fileExports: async (data, res) => {
		let downloadData = {}
		let csvData
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			let testcaseLists = await testcaseDao.testcaseLists(data);
			if (testcaseLists.length) {
				let responseArray = [];
				asyncLoop(testcaseLists, async function (item, next) {
					let testData = {}
					let docId = item
					testcase = await testcaseDao.detail(docId);
					let ownerArray = JSON.parse(data.owner_array);
					testData.name = testcase.name;
					testData.acct_id = testcase.acct_id;
					testData.project_id = testcase.project_id;
					testData.domain_id = testcase.domain_id;
					testData.folder_id = testcase.folder_id;
					testData.description = testcase.description;
					testData.precondition = testcase.precondition;
					testData.objective = testcase.objective;
					testData.owner = testcase.owner;
					testData.status = testcase.status;
					testData.priority = testcase.priority;
					testData.component = testcase.component;
					testData.estimated_time = testcase.estimated_time;
					testData.folder_name = testcase.folder_name;
					testData.label = testcase.label;
					testData.version = testcase.version;
					testData.lock = testcase.lock;
					testData.customFields = testcase.customFields;
					testData.is_active = testcase.is_active;
					testData.createdAt = testcase.createdAt;
					testData.updatedAt = testcase.updatedAt;
					const ownerData = ownerArray.filter(ownerName => ownerName.accountId == testcase.owner);
					if (ownerData.length) {
						testData.owner = ownerData[0].name;
					}
					responseArray.push(testData);
					next();
				}, function (error) {
					if (data.file_type == "xlsx") {
						let workbook = new excel.Workbook();
						let worksheet = workbook.addWorksheet("responseArray");
						worksheet.columns = [
							{ header: "name", key: "name" },
							{ header: "description", key: "description" },
							{ header: "precondition", key: "precondition" },
							{ header: "objective", key: "objective" },
							{ header: "owner", key: "owner" },
							{ header: "status", key: "status" },
							{ header: "priority", key: "priority" },
							{ header: "component", key: "component" },
							{ header: "estimated_time", key: "estimated_time" },
							{ header: "label", key: "label" },
							{ header: "customFields", key: "customFields" },
							{ header: "parameters", key: "parameters" },
							{ header: "test_data", key: "test_data" },
							{ header: "testscript", key: "testscript" },
							{ header: "testscript_type", key: "testscript_type" },
							{ header: "weblinks", key: "weblinks" }
						];
						worksheet.addRows(responseArray);
						fs.writeFile('./csv_file/testcaseData.csv', workbook.xlsx, function (err) {
							if (err) {
								return { 'rescode': 401, 'msg': message.download_error, 'data': {} }
							} else {

							}
						})
						res.setHeader(
							"Content-Type",
							"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						);
						res.setHeader(
							"Content-Disposition",
							"attachment; filename=" + "testcase.xlsx"
						);
						return workbook.xlsx.write(res).then(function () {
							res.status(200).end();
						});

					} else {

						const fields = [
							{ value: 'name', label: 'name' },
							{ value: 'description', label: 'Description' },
							{ value: 'precondition', label: 'precondition' },
							{ value: 'objective', label: 'objective' },
							{ value: 'owner', label: 'owner' },
							{ value: 'status', label: 'status' },
							{ value: 'priority', label: 'priority' },
							{ value: 'component', label: 'component' },
							{ value: 'estimated_time', label: 'estimated_time' },
							{ value: 'label', label: 'label' },
							{ value: 'customFields', label: 'customFields' },
							{ value: 'parameters', label: 'parameters' },
							{ value: 'test_data', label: 'test_data' },
							{ value: 'testscript', label: 'testscript' },
							{ value: 'testscript_type', label: 'testscript_type' },
							{ value: 'weblinks', label: 'weblinks' },
						]
						const json2csvParser = new Parser({ fields });
						csvData = json2csvParser.parse(responseArray);
						res.setHeader("Content-Type", "text/csv");
						res.setHeader("Content-Disposition", "attachment; filename=testcase.csv");
						res.status(200).end(csvData);
					}
				})

				//return { 'rescode': 200, 'msg': message.TESTCASE_VERSION_HISTORY, 'data': downloadData };
			} else {
				return response(res, 401, message.NO_TESTCASE, {}, null)
			}
		} else {
			return response(res, 401, message.INSUFFICIENT_ACCESS, {}, null)
		}
	},

	viewLogs: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			let showLogs = await testcaseDetailsMaster.showLogs(data);
			if (showLogs) {
				return { 'rescode': 200, 'msg': message.TESTCASE_HISTORY, 'data': showLogs };
			} else {
				return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	bulkCreate: async data => {
		let testcaseObj = {}
		let testcaseArray = []
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_create === 1) {
			//let testcase_name=data.name.split(',') 
			let testcaseName = JSON.parse(data.name);
			for (const testcaseElement of testcaseName) {
				if (!!testcaseElement) {
					testcaseObj.name = testcaseElement
					testcaseObj.status = data.status
					testcaseObj.priority = data.priority
					testcaseObj.owner = data.owner
					testcaseObj.component = data.component
					testcaseObj.label = data.label
					testcaseObj.folder_id = null
					testcaseObj.project_id = data.project_id
					testcaseObj.domain_id = data.domain_id
					testcaseObj.created_by = data.acct_id
					testcaseObj.updated_by = data.acct_id
					testcaseObj.objective = ''
					testcaseObj.description = ''
					testcaseObj.precondition = ''
					testcaseObj.weblinks = "[]"
					testcaseObj.test_data = "[]"
					testcaseObj.testscript = ""
					testcaseObj.testscript_type = "plain_test"
					testcaseObj.parameters = "[]"
					testcaseObj.submit_status = 0
					testcaseObj.updated_by = data.acct_id
					testcaseObj.version = "1.0"
					testcaseObj.is_active = 1
					testcaseObj.lock = false
					let testcase = await testcaseDao.add(testcaseObj);
					let testcaseID = testcase._id.toString()
					let record = {};
					let domainStr = testcaseObj.domain_id
					let keyValue = domainStr.substring(0, 3);
					record['folder_id'] = null,
						record['project_id'] = testcaseObj.project_id,
						record['domain_id'] = testcaseObj.domain_id,
						record['name'] = testcaseObj.name,
						record['test_key'] = keyValue + '-T',
						record['priority'] = testcaseObj.priority,
						record['updated_by'] = data.acct_id,
						record['created_by'] = data.acct_id
					record['submit_status'] = 0
					record['is_active'] = 1
					let testcaseDetailsData = await testcaseDetailsMaster.addTestcaseDetails(record);
					if (testcaseDetailsData) {
						let updateKey = {};
						updateKey['test_key'] = testcaseDetailsData.test_key + testcaseDetailsData.id;
						updateKey['id'] = testcaseDetailsData.id;
						await testcaseDetailsMaster.updateTescaseKey(updateKey)
						let testcaseVersion = {}
						testcaseVersion['testcase_detail_id'] = testcaseDetailsData.id,
							testcaseVersion['doc_id'] = testcaseID,
							testcaseVersion['version'] = testcaseObj.version,
							testcaseVersion['created_by'] = data.acct_id,
							testcaseVersion['updated_by'] = data.acct_id
						await testcaseVersionMapping.addTestcaseVersion(testcaseVersion);
					}
				}
			}
			return { 'rescode': 200, 'msg': message.TESTCASE_ADDED, 'data': null };
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
		}
	},
	issueDetails: async data => {
		let responseData = {}
		let testcaseJson = {}
		let testcycleJson = {}
		let testcaseArray = []
		let testcycleArray = []
		responseData.testcase = testcaseArray
		responseData.testcycle = testcycleArray
		fetchIssuesDetails = await testcaseDao.fetchIssuesDetails(data);
		if (fetchIssuesDetails.length) {
			for (const next_issues of fetchIssuesDetails) {
				if (next_issues.test_type == "testcase") {
					let testcase_id = next_issues.test_id
					fetchCasesDetails = await testcaseDao.fetchCasesDetails(testcase_id);
					if (fetchCasesDetails.length) {
						testcaseJson.issue_id = next_issues.issue_id
						testcaseJson.issue_name = next_issues.issue_name
						testcaseJson.issue_type = next_issues.issue_type
						testcaseJson.issue_key = next_issues.issue_key
						testcaseJson.test_type = next_issues.test_type
						testcaseJson.name = fetchCasesDetails[0].name
						testcaseJson.test_id = next_issues.test_id
						testcaseArray.push(testcaseJson)
						testcaseJson = {}
					}
				} if (next_issues.test_type == "testcycle") {
					let testcycle_id = next_issues.test_id
					fetchCycleDetails = await testcycleDao.fetchCycleDetails(testcycle_id);
					if (fetchCycleDetails) {
						testcycleJson.issue_id = next_issues.issue_id
						testcycleJson.issue_name = next_issues.issue_name
						testcycleJson.issue_type = next_issues.issue_type
						testcycleJson.issue_key = next_issues.issue_key
						testcycleJson.test_type = next_issues.test_type
						testcycleJson.name = fetchCycleDetails.name
						testcycleJson.test_id = next_issues.test_id
						testcycleArray.push(testcycleJson)
						testcycleJson = {}
					}
				}
			}
			responseData.testcase = testcaseArray
			responseData.testcycle = testcycleArray
			return { 'rescode': 200, 'msg': message.ISSUES_DETAIL, 'data': responseData };
		} else {
			return { 'rescode': 200, 'msg': message.ISSUES_DETAIL, 'data': responseData };
		}
	},
	executionList: async data => {
		let userAccess = await checkUserAccess(data);
		if (userAccess.data && userAccess.data[0].allow_testcase_read === 1) {
			let fetchVersionAndEnv = await testcaseDao.fetchVersionAndEnv(data);
			if (fetchVersionAndEnv.length) {
				let testcaseJson = {}
				let testcaseArray = []
				for (const element of fetchVersionAndEnv) {
					let version = element.version
					let environment = element.environment
					let testcase_id = element.testcase_id
					let fetchExecutionId = await testcaseDao.fetchExecutionId(testcase_id, version, environment);
					let executionId = fetchExecutionId[0].testexecution_id

					let fetchExecutionDetails = await testExecutionDao.fetchExecutionDetails(executionId);
					testcaseJson.version = version
					testcaseJson.environment = environment
					testcaseJson.testcase_id = testcase_id
					testcaseJson.executionId = executionId
					testcaseJson.test_key = fetchExecutionDetails.test_key
					testcaseJson.name = fetchExecutionDetails.name
					testcaseJson.execution_status = fetchExecutionDetails.execution_status
					testcaseJson.estimated_time = fetchExecutionDetails.estimated_time
					testcaseJson.assigned_to = fetchExecutionDetails.assigned_to
					testcaseJson.recorded_time = fetchExecutionDetails.recorded_time
					testcaseJson.execution_issues = fetchExecutionDetails.execution_issues.length
					testcaseJson.actual_end_date = fetchExecutionDetails.updatedAt
					testcaseArray.push(testcaseJson)
					testcaseJson = {}
				}
				return { 'rescode': 200, 'msg': message.TESTCASE_EXECUTION_LIST, 'data': testcaseArray };
			} else {
				return { 'rescode': 200, 'msg': message.TESTCASE_EXECUTION_LIST, 'data': [] }
			}
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
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
		} catch (err) {
			return reject(err)
		}
	})
}
module.exports = { testcaseService };