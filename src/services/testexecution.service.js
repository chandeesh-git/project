const testExecutionDao = require('../dao/testexecution.dao').testExecutionDetails;
const testcycleDao = require('../dao/testcycle.dao').testcycleDetails;
const testcaseDao = require('../dao/testcase.dao').testcaseDetails;
const userDao = require('../dao/user.dao').userDetails;
const message = require('../utils/message');
const { checkUserAccess, get_signedUrl, pdf_upload,image_delete,gcp_signedUrl } = require('../utils/utility')
var asyncLoop = require('node-async-loop');
const fs = require('fs');
const randomstring = require('randomstring')
const testexecutionService = {
    add: async data => {
        let checkPermission = await userDao.getUserAccess({ 'acct_id': data.acct_id, 'project_id': data.project_id });
        if (checkPermission.length && checkPermission[0].allow_testcycle_execute === 1) {
            let executionData = {};
            executionData['testcase_id'] = data.testcase._id;
            executionData['is_active'] = true;
            executionData['environment'] = data.testcase.environment;
            executionData['testcycle_id'] = data.testcycle_id;
            executionData['project_id'] = data.project_id;
            executionData['assigned_to'] = data.acct_id;
            executionData['execution_status'] = 0;

            //mark previous executions as complete	
            let previousExecution = await testExecution.markTestExecutionComplete(data.testcase._id);
            let testExecution = await testExecutionDao.addTestExecution(executionData);
            if (testExecution) {
                return { 'rescode': 200, 'msg': message.TESTEXECUTION_CREATED, 'data': testExecution };
            } else {
                return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} };
            }
        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
    },
    update: async data => {
        let checkPermission = await userDao.getUserAccess({ 'acct_id': data.acct_id, 'project_id': data.project_id });
        if (checkPermission.length && checkPermission[0].allow_testcycle_execute === 1) {
            let updateData = {};
            let keys = Object.keys(data.update);
            for (key of keys) {
                if (data.update.hasOwnProperty(key))
                    updateData[key] = data.update[key];
            }
            let testExecution = await testExecutionDao.updateTestExecution(data.testexecution_id, updateData);
            if (testExecution) {
                return { 'rescode': 200, 'msg': message.TESTEXECUTION_UPDATED, 'data': testExecution };
            } else {
                return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} };
            }
        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
    },
    list: async data => {
        let testexecutions = await testExecutionDao.list(data);
        if (testexecutions) {
            return { 'rescode': 200, 'msg': message.TESTEXECUTION_LIST, 'data': testexecutions };
        } else {
            return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
        }
    },

    runDetails: async (data,regionData) => {
        let userAccess = await checkUserAccess(data);
        let testExecutionArray = []
        if (userAccess.data && userAccess.data[0].allow_testcycle_execute === 1) {
            let checkExecutionExists = await testExecutionDao.checkExecutionExists(data);
            console.log("checkExecutionExists ############## checkExecutionExists", checkExecutionExists)
            if (checkExecutionExists.length) {
                for (const execution_item of checkExecutionExists) {
                    let testExecutionJson = {}
                    let test_execution_id = execution_item.testexecution_id
                    let testExecutionDetails = await testExecutionDao.testExecutionDetails(data, test_execution_id);
                    testExecutionJson.project_id = testExecutionDetails.project_id
                    testExecutionJson.domain_id = testExecutionDetails.domain_id
                    testExecutionJson.testexecution_id = testExecutionDetails._id
                    testExecutionJson.name = testExecutionDetails.name
                    testExecutionJson.version = testExecutionDetails.version
                    testExecutionJson.description = testExecutionDetails.description
                    testExecutionJson.precondition = testExecutionDetails.precondition
                    testExecutionJson.objective = testExecutionDetails.objective
                    testExecutionJson.owner = testExecutionDetails.owner
                    testExecutionJson.status = testExecutionDetails.status
                    testExecutionJson.priority = testExecutionDetails.priority
                    testExecutionJson.component = testExecutionDetails.component
                    testExecutionJson.customFields = testExecutionDetails.customFields
                    testExecutionJson.estimated_time = testExecutionDetails.estimated_time
                    testExecutionJson.folder_id = testExecutionDetails.folder_id
                    testExecutionJson.label = testExecutionDetails.label
                    testExecutionJson.testscript_type = testExecutionDetails.testscript_type
                    testExecutionJson.testscript = testExecutionDetails.testscript
                    testExecutionJson.test_data = testExecutionDetails.test_data
                    testExecutionJson.parameters = testExecutionDetails.parameters
                    testExecutionJson.weblinks = testExecutionDetails.weblinks
                    testExecutionJson.issues = testExecutionDetails.issues
                    testExecutionJson.attachments = testExecutionDetails.attachments
                    testExecutionJson.testcase_id = testExecutionDetails.testcase_id
                    testExecutionJson.execution_status = testExecutionDetails.execution_status
                    testExecutionJson.recorded_time = testExecutionDetails.recorded_time
                    testExecutionJson.testscript_status = testExecutionDetails.testscript_status

                    testExecutionJson.assigned_to = testExecutionDetails.assigned_to
                    testExecutionJson.executed_by = testExecutionDetails.executed_by
                    testExecutionJson.execution_attachment = testExecutionDetails.execution_attachment
                    testExecutionJson.execution_issues = testExecutionDetails.execution_issues
                    testExecutionJson.execution_comment = testExecutionDetails.execution_comment
                    testExecutionJson.environment = testExecutionDetails.environment
                    testExecutionJson.test_key = testExecutionDetails.test_key
                    testExecutionJson.activity_log = testExecutionDetails.activity_log
                    if (testExecutionDetails.folder_id) {
                        console.log("##################################")
                        let fetchFolderName = await testExecutionDao.fetchFolderName(testExecutionDetails.folder_id);
                        console.log(fetchFolderName)
                        testExecutionJson.folder_name = fetchFolderName[0].folder_name
                    } else {
                        testExecutionJson.folder_name = ""
                    }
                    // attachment signed url function 
                    if (testExecutionDetails.attachments) {
                        let attachmentsData = [];
                        for (const item of testExecutionDetails.attachments) {
                            let attachmentsJson = {}
                            console.log("sssssssssssssssssssssfile_url", item.file_url)
                            if (item.file_url != null && item.file_url != "") {
                                let signed_url = await getSignedUrl(item.file_url,regionData);
                                console.log("jaskbdkajsd", signed_url)
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
                        console.log("attachmentsDataattachmentsDataattachmentsData", attachmentsData)
                        testExecutionJson.attachments = attachmentsData;

                    } else {
                        testExecutionJson.attachments = []
                    }
                    fetchIssues = await testExecutionDao.fetchIssue(data, test_execution_id);
                    let issuesData = {}
                    if (fetchIssues.length) {
                        console.log("%555555555555555555555555")
                        testExecutionJson.execution_issues = fetchIssues
                    } else {
                        testExecutionJson.execution_issues = []
                    }
                    testExecutionArray.push(testExecutionJson)
                }
                console.log(testExecutionArray)
                return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': testExecutionArray };
            } else {
                let testcaseArrays = []
                let fetchCycleCases = await testcycleDao.cycleCasesDetails(data);
                let testcaseJson = {}
                if (fetchCycleCases.length) {
                    let testcase_ids = fetchCycleCases[0].testcase_id
                    let docId = fetchCycleCases[0].doc_id
                    let version = fetchCycleCases[0].version
                    let detailTestcase = await testcycleDao.testcasesData(testcase_ids, version);
                    console.log("@@@@@@@@@@@@@@@@", fetchCycleCases[0])
                    let testcasesData = await testcaseDao.testcaseDocDetails(docId, data);
                    console.log("@@@@@@@@@@@@@@@@111111111111111111111", testcasesData)
                    testcaseJson.id = testcase_ids
                    testcaseJson.testcase_id = testcase_ids
                    testcaseJson.version = fetchCycleCases[0].version
                    testcaseJson.testexecution_id = ''
                    testcaseJson.name = testcasesData.name
                    testcaseJson.test_key = detailTestcase[0].test_key
                    testcaseJson.priority = testcasesData.priority
                    testcaseJson.last_execution = detailTestcase[0].last_execution
                    testcaseJson.updated_by = testcasesData.updated_by
                    testcaseJson.created_by = testcasesData.created_by
                    testcaseJson.created_at = detailTestcase[0].created_at
                    testcaseJson.updated_at = detailTestcase[0].updated_at
                    testcaseJson.doc_id = testcasesData._id
                    testcaseJson.objective = testcasesData.objective
                    testcaseJson.precondition = testcasesData.precondition
                    testcaseJson.estimated_time = testcasesData.estimated_time
                    testcaseJson.status = testcasesData.status
                    testcaseJson.label = testcasesData.label
                    testcaseJson.folder_id = testcasesData.folder_id
                    testcaseJson.description = testcasesData.description
                    testcaseJson.customFields = testcasesData.customFields
                    testcaseJson.testscript_type = testcasesData.testscript_type
                    testcaseJson.testscript = testcasesData.testscript
                    testcaseJson.test_data = testcasesData.test_data
                    testcaseJson.parameters = testcasesData.parameters
                    testcaseJson.weblinks = testcasesData.weblinks
                    testcaseJson.component = testcasesData.component
                    testcaseJson.assigned_to = fetchCycleCases[0].tester
                    testcaseJson.owner = testcasesData.owner
                    if (testcasesData.folder_id) {
                        console.log("##################################")
                        let fetchFolderName = await testExecutionDao.fetchFolderName(testcasesData.folder_id);
                        console.log(fetchFolderName)
                        testcaseJson.folder_name = fetchFolderName[0].folder_name
                    } else {
                        testcaseJson.folder_name = ""
                    }
                    // Issue of testcase 
                    fetchData = {}
                    fetchData.testcase_id = testcase_ids
                    fetchData.project_id = data.project_id
                    fetchData.domain_id = data.domain_id
                    fetchIssues = await testcaseDao.fetchIssues(fetchData, version);
                    let issuesData = {}
                    if (fetchIssues.length) {
                        console.log("%555555555555555555555555")
                        testcaseJson.issues = fetchIssues
                    } else {
                        testcaseJson.issues = []
                    }
                    // attachment signed url function 
                    if (testcasesData.attachments) {
                        let attachmentsData = [];
                        for (const item of testcasesData.attachments) {
                            let attachmentsJson = {}
                            console.log("sssssssssssssssssssssfile_url", item.file_url)
                            if (item.file_url != null && item.file_url != "") {
                                let signed_url = await getSignedUrl(item.file_url,regionData);
                                console.log("jaskbdkajsd", signed_url)
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
                        console.log("attachmentsDataattachmentsDataattachmentsData", attachmentsData)
                        testcaseJson.attachments = attachmentsData;

                    } else {
                        testcaseJson.attachments = []
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                }
                if (testcaseJson) {
                    testcaseArrays.push(testcaseJson)
                    console.log(testcaseArrays)
                    return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': testcaseArrays };
                } else {
                    return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                }
            }
        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
    },

    runTestList: async data => {
        let userAccess = await checkUserAccess(data);
        let checkUserRole = await testExecutionDao.checkUserRole(data);
        if (checkUserRole.length != 0) {
            let testcaseDetails = {}
            let testcaseArrays = []
            let fetchCycleCases = await testcycleDao.cycleCasesFetch(data);
            let testcaseJson = {}
            if (fetchCycleCases.length) {
                for (const element_case of fetchCycleCases) {
                    let testcase_ids = element_case.testcase_id
                    let docId = element_case.doc_id
                    let version = element_case.version
                    let detailTestcase = await testcycleDao.testcasesData(testcase_ids, version);
                    console.log("@@@@@@@@@@@@@@@@", element_case)
                    testcaseJson.id = testcase_ids
                    testcaseJson.version = element_case.version
                    testcaseJson.name = detailTestcase[0].name
                    testcaseJson.test_key = detailTestcase[0].test_key
                    testcaseJson.priority = detailTestcase[0].priority
                    testcaseJson.doc_id = detailTestcase[0].doc_id
                    testcaseJson.owner = element_case.tester
                    testcaseArrays.push(testcaseJson)
                    testcaseJson = {}
                }
                return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': testcaseArrays };
            } else {
                return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': [] };
            }
        } else {
            let testcaseDetails = {}
            let testcaseArrays = []
            let fetchCycleCases = await testcycleDao.cycleCasesFetch(data);
            let testcaseJson = {}
            if (fetchCycleCases.length) {
                for (const element_case of fetchCycleCases) {
                    let testcase_ids = element_case.testcase_id
                    let docId = element_case.doc_id
                    let version = element_case.version
                    let checkTestcaseAssigned = await testExecutionDao.checkTestcaseAssigned(testcase_ids, version, data);
                    if (checkTestcaseAssigned.length) {
                        let detailTestcase = await testcycleDao.testcasesData(testcase_ids, version);
                        console.log("@@@@@@@@@@@@@@@@", element_case)
                        testcaseJson.id = testcase_ids
                        testcaseJson.version = element_case.version
                        testcaseJson.name = detailTestcase[0].name
                        testcaseJson.test_key = detailTestcase[0].test_key
                        testcaseJson.priority = detailTestcase[0].priority
                        testcaseJson.doc_id = detailTestcase[0].doc_id
                        testcaseJson.owner = element_case.tester
                        testcaseArrays.push(testcaseJson)
                        testcaseJson = {}
                    }

                }
                return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': testcaseArrays };
            } else {
                return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': [] };
            }
        }
    },
    addTestExecution: async (data, files,regionData) => {
        let userAccess = await checkUserAccess(data);
        if (userAccess.data) {
            if (data.testcycle_id) {
                if (userAccess.data[0].allow_testcycle_execute == 1) {
                    let testExecutionAdd = await testExecutionDao.testExecutionAdd(data);
                    if (testExecutionAdd) {
                        let testExecutionID = testExecutionAdd._id.toString()
                        let executionMappingData = {};
                        executionMappingData['testexecution_id'] = testExecutionID
                        executionMappingData['testcycle_id'] = data.testcycle_id
                        executionMappingData['testcase_id'] = data.testcase_id
                        executionMappingData['version'] = data.version
                        executionMappingData['recorded_time'] = data.recorded_time
                        executionMappingData['execution_status'] = data.execution_status
                        executionMappingData['environment'] = data.environment
                        executionMappingData['project_id'] = data.project_id
                        executionMappingData['domain_id'] = data.domain_id
                        executionMappingData['updated_by'] = data.acct_id
                        executionMappingData['created_by'] = data.acct_id

                        await testExecutionDao.addExecutionMapping(executionMappingData);

                        // update the test case last execution 
                        let lastExecutionData = {};
                        lastExecutionData['testcase_id'] = data.testcase_id
                        lastExecutionData['testcycle_id'] = data.testcycle_id
                        lastExecutionData['version'] = data.version
                        lastExecutionData['last_execution'] = data.last_execution
                        lastExecutionData['updated_by'] = data.acct_id
                        await testExecutionDao.lastExecutionTestcase(lastExecutionData);
                        // insert the execution activity logs 
                        if (data.activity_log) {
                            let activityLog=JSON.parse(data.activity_log) 
                            let executionActivityLogs = {};
                            for (const logElement of activityLog) {
                        
                            executionActivityLogs['execution_id'] = testExecutionID
                            executionActivityLogs['status'] = logElement.status 
                            executionActivityLogs['status_color'] = logElement.status_color 
                            executionActivityLogs['tested_by'] = logElement.tested_by 
                            executionActivityLogs['detail'] = logElement.detail 
                            executionActivityLogs['project_id'] = data.project_id 
                            executionActivityLogs['domain_id'] = data.domain_id 
                            executionActivityLogs['updated_by'] = data.acct_id
                            executionActivityLogs['created_by'] = data.acct_id
                            await testExecutionDao.addExecutionActivity(executionActivityLogs);
                            }
                        }

                        if (data.execution_issues) {
                            let issuesData = {}
                            for (const issuesElement of data.execution_issues) {
                                issuesData.issue_id = issuesElement.issue_id
                                issuesData.issue_type = issuesElement.issue_type
                                issuesData.issue_name = issuesElement.issue_name
                                issuesData.issue_key = issuesElement.issue_key
                                issuesData.issue_to_link = issuesElement.issue_to_link
                                issuesData.issue_status = issuesElement.issue_status
                                issuesData.issue_icon = issuesElement.issue_icon
                                issuesData.test_type = issuesElement.test_type
                                issuesData.issue_priority = issuesElement.issue_priority
                                issuesData.test_id = testExecutionID
                                issuesData.project_id = data.project_id
                                issuesData.domain_id = data.domain_id
                                issuesData.created_by = data.acct_id
                                issuesData.updated_by = data.acct_id
                                await testcaseDao.addIssues(issuesData);
                                console.log(issuesElement);
                                console.log(issuesData);
                            }
                        }
                        // test plan attachment function works
                        let attachmentSaverArray = [];
                        let attachmentDetails = data.execution_attachment
                        if (attachmentDetails.length) {
                            let attachmentCondition = {}
                            attachmentCondition.project_id = data.project_id
                            attachmentCondition.domain_id = data.domain_id
                            attachmentCondition.testExecutionID = testExecutionID
                            asyncLoop(attachmentDetails, async function (record, next_record) {
                                if (files[record.file_key_name]['path']) {
                                    console.log("commihs sss")
                                    const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
                                    const imageBase64 = Buffer.from(bitmap).toString('base64');
                                    //const image_name =record.file_name
                                    let image_name
                                    let imageName
                                    if (record.file_url) {
                                        imageName = record.file_url
                                    } else {
                                        image_name = randomstring.generate({ length: 6, charset: 'numeric' });
                                        imageName = `testexecution/attachment-${image_name}.pdf`
                                    }
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
                                    return { 'rescode': 401, 'msg': message.IMAGE_MISSING, 'data': {} }
                                }
                            },
                                async function (error) {
                                    console.log("geeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee++++++", attachmentSaverArray)
                                    await testExecutionDao.testexecutionAttachment(attachmentSaverArray, attachmentCondition);

                                    return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': { 'testexecution_id': testExecutionID } };
                                })
                        }

                        if (data.testcycle_id) {
                            await testcycleDao.updateExecutionTime(data);
                        } else {
                            await testcaseDao.updateCaseExecutionTime(data);
                        }
                        return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': { 'testexecution_id': testExecutionID } };
                    } else {
                        return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
                }
            } else {
                if (userAccess.data[0].allow_testcase_execute == 1) {
                    let testExecutionAdd = await testExecutionDao.testExecutionAdd(data);
                    if (testExecutionAdd) {
                        let testExecutionID = testExecutionAdd._id.toString()
                        let executionMappingData = {};
                        executionMappingData['testexecution_id'] = testExecutionID
                        executionMappingData['testcycle_id'] = data.testcycle_id
                        executionMappingData['testcase_id'] = data.testcase_id
                        executionMappingData['version'] = data.version
                        executionMappingData['recorded_time'] = data.recorded_time
                        executionMappingData['execution_status'] = data.execution_status
                        executionMappingData['environment'] = data.environment
                        executionMappingData['project_id'] = data.project_id
                        executionMappingData['domain_id'] = data.domain_id
                        executionMappingData['updated_by'] = data.acct_id
                        executionMappingData['created_by'] = data.acct_id

                        await testExecutionDao.addExecutionMapping(executionMappingData);

                          // insert the execution activity logs 
                          if (data.activity_log) {
                            let activityLog=JSON.parse(data.activity_log) 
                            let executionActivityLogs = {};
                            for (const logElement of activityLog) {
                        
                            executionActivityLogs['execution_id'] = testExecutionID
                            executionActivityLogs['status'] = logElement.status 
                            executionActivityLogs['status_color'] = logElement.status_color 
                            executionActivityLogs['tested_by'] = logElement.tested_by 
                            executionActivityLogs['detail'] = logElement.detail 
                            executionActivityLogs['project_id'] = data.project_id 
                            executionActivityLogs['domain_id'] = data.domain_id 
                            executionActivityLogs['updated_by'] = data.acct_id
                            executionActivityLogs['created_by'] = data.acct_id
                            await testExecutionDao.addExecutionActivity(executionActivityLogs);
                            }
                        }
                        if (data.execution_issues) {
                            let issuesData = {}
                            for (const issuesElement of data.execution_issues) {
                                issuesData.issue_id = issuesElement.issue_id
                                issuesData.issue_type = issuesElement.issue_type
                                issuesData.issue_name = issuesElement.issue_name
                                issuesData.issue_key = issuesElement.issue_key
                                issuesData.issue_to_link = issuesElement.issue_to_link
                                issuesData.issue_status = issuesElement.issue_status
                                issuesData.issue_icon = issuesElement.issue_icon
                                issuesData.test_type = issuesElement.test_type
                                issuesData.issue_priority = issuesElement.issue_priority
                                issuesData.test_id = testExecutionID
                                issuesData.project_id = data.project_id
                                issuesData.domain_id = data.domain_id
                                issuesData.created_by = data.acct_id
                                issuesData.updated_by = data.acct_id
                                await testcaseDao.addIssues(issuesData);
                                console.log(issuesElement);
                                console.log(issuesData);
                            }
                        }

                        // test plan attachment function works
                        let attachmentSaverArray = [];
                        let attachmentDetails = data.execution_attachment
                        if (attachmentDetails.length) {
                            let attachmentCondition = {}
                            attachmentCondition.project_id = data.project_id
                            attachmentCondition.domain_id = data.domain_id
                            attachmentCondition.testExecutionID = testExecutionID
                            asyncLoop(attachmentDetails, async function (record, next_record) {
                                if (files[record.file_key_name]['path']) {
                                    console.log("commihs sss")
                                    const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
                                    const imageBase64 = Buffer.from(bitmap).toString('base64');
                                    //const image_name =record.file_name
                                    let image_name
                                    let imageName
                                    if (record.file_url) {
                                        imageName = record.file_url
                                    } else {
                                        image_name = randomstring.generate({ length: 6, charset: 'numeric' });
                                        imageName = `testexecution/attachment-${image_name}.pdf`
                                    }
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
                                    return { 'rescode': 401, 'msg': message.IMAGE_MISSING, 'data': {} }
                                }
                            },
                                async function (error) {
                                    console.log("geeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee++++++", attachmentSaverArray)
                                    await testExecutionDao.testexecutionAttachment(attachmentSaverArray, attachmentCondition);

                                    return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': { 'testexecution_id': testExecutionID } };
                                })
                        }
                        if (data.testcycle_id) {
                            await testcycleDao.updateExecutionTime(data);
                        } else {
                            await testcaseDao.updateCaseExecutionTime(data);
                        }
                        return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': { 'testexecution_id': testExecutionID } };
                    } else {
                        return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
                }
            }
        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
    },

    updateTestExecution: async (data, files,regionData) => {
        let userAccess = await checkUserAccess(data);
        if (userAccess.data) {
            if (data.testcycle_id) {
                if (userAccess.data[0].allow_testcycle_execute == 1) {
                    let updateData = {};
                    let keys = Object.keys(data);
                    for (key of keys) {
                        if (data.hasOwnProperty(key) && key != 'testexecution_id')
                            updateData[key] = data[key];
                    }
                    let testExecutionUpdate = await testExecutionDao.updateTestExecution(data.testexecution_id, updateData);

                    if (testExecutionUpdate) {
                        // if test cycle execution update else test case update execution only
                        let testExecutionID = data.testexecution_id
                        let executionMappingData = {};
                        executionMappingData['testexecution_id'] = testExecutionID
                        executionMappingData['testcycle_id'] = data.testcycle_id
                        executionMappingData['testcase_id'] = data.testcase_id
                        executionMappingData['version'] = data.version
                        executionMappingData['recorded_time'] = data.recorded_time
                        executionMappingData['execution_status'] = data.execution_status
                        executionMappingData['environment'] = data.environment
                        executionMappingData['updated_by'] = data.acct_id

                        await testExecutionDao.updateExecutionMapping(executionMappingData);

                        // update the test case last execution 
                        let lastExecutionData = {};
                        lastExecutionData['testcase_id'] = data.testcase_id
                        lastExecutionData['testcycle_id'] = data.testcycle_id
                        lastExecutionData['version'] = data.version
                        lastExecutionData['last_execution'] = data.last_execution
                        lastExecutionData['updated_by'] = data.acct_id
                        await testExecutionDao.lastExecutionTestcase(lastExecutionData);

                         // insert the execution activity logs 
                         if (data.activity_log) {
                            let activityLog=JSON.parse(data.activity_log) 
                            let executionActivityLogs = {};
                            for (const logElement of activityLog) {
                        
                            executionActivityLogs['execution_id'] = testExecutionID
                            executionActivityLogs['status'] = logElement.status 
                            executionActivityLogs['status_color'] = logElement.status_color 
                            executionActivityLogs['tested_by'] = logElement.tested_by 
                            executionActivityLogs['detail'] = logElement.detail 
                            executionActivityLogs['project_id'] = data.project_id 
                            executionActivityLogs['domain_id'] = data.domain_id 
                            executionActivityLogs['updated_by'] = data.acct_id
                            executionActivityLogs['created_by'] = data.acct_id
                            await testExecutionDao.addExecutionActivity(executionActivityLogs);
                            }
                        }

                        // update last execution parameter for  cycle and test case 
                        if (data.testcycle_id) {
                            await testcycleDao.updateExecutionTime(data);
                        } else {
                            await testcaseDao.updateCaseExecutionTime(data);
                        }

                        // to delete the old issue 
                        await testExecutionDao.deleteIssues(data);
                        // to generate new issue    
                        if (data.execution_issues) {
                            let issuesData = {}
                            for (const issuesElement of data.execution_issues) {
                                issuesData.issue_id = issuesElement.issue_id
                                issuesData.issue_type = issuesElement.issue_type
                                issuesData.issue_name = issuesElement.issue_name
                                issuesData.issue_key = issuesElement.issue_key
                                issuesData.issue_to_link = issuesElement.issue_to_link
                                issuesData.issue_status = issuesElement.issue_status
                                issuesData.issue_icon = issuesElement.issue_icon
                                issuesData.test_type = issuesElement.test_type
                                issuesData.issue_priority = issuesElement.issue_priority
                                issuesData.test_id = testExecutionID
                                issuesData.project_id = data.project_id
                                issuesData.domain_id = data.domain_id
                                issuesData.created_by = data.acct_id
                                issuesData.updated_by = data.acct_id
                                await testcaseDao.addIssues(issuesData);
                                console.log(issuesElement);
                                console.log(issuesData);
                            }
                        }

                        // test plan attachment function works
                        let attachmentSaverArray = [];
                        let attachmentDetails = data.execution_attachment
                        if (attachmentDetails.length) {
                            let attachmentCondition = {}
                            attachmentCondition.project_id = data.project_id
                            attachmentCondition.domain_id = data.domain_id
                            attachmentCondition.testExecutionID = testExecutionID
                            asyncLoop(attachmentDetails, async function (record, next_record) {
                                if (record.operation == 'new') {
                                    if (files[record.file_key_name]['path']) {
                                        const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
                                        const imageBase64 = Buffer.from(bitmap).toString('base64');
                                        //const image_name =record.file_name
                                        let image_name
                                        let imageName
                                        if (record.file_url) {
                                            imageName = record.file_url
                                        } else {
                                            image_name = randomstring.generate({ length: 6, charset: 'numeric' });
                                            imageName = `testexecution/attachment-${image_name}.pdf`
                                        }
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
                                                console.log("++++++++++++++++++newnewnewnewnewnew#############", attachmentSaverArray)
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
                                    image_delete(record.file_url, (err, delete_image_url) => {
                                        if (err) {
                                            next_record();
                                        } else {
                                            next_record();
                                        }
                                    })
                                }

                            },
                                async function (error) {
                                    await testExecutionDao.testexecutionAttachment(attachmentSaverArray, attachmentCondition);
                                    return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': {} };
                                })
                        }
                        return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': {} };
                    } else {
                        return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
                }
            } else {
                if (userAccess.data[0].allow_testcase_execute == 1) {
                    let updateData = {};
                    let keys = Object.keys(data);
                    for (key of keys) {
                        if (data.hasOwnProperty(key) && key != 'testexecution_id')
                            updateData[key] = data[key];
                    }
                    let testExecutionUpdate = await testExecutionDao.updateTestExecution(data.testexecution_id, updateData);

                    if (testExecutionUpdate) {
                        // if test cycle execution update else test case update execution only
                        let testExecutionID = data.testexecution_id
                        let executionMappingData = {};
                        executionMappingData['testexecution_id'] = testExecutionID
                        executionMappingData['testcase_id'] = data.testcase_id
                        executionMappingData['version'] = data.version
                        executionMappingData['recorded_time'] = data.recorded_time
                        executionMappingData['execution_status'] = data.execution_status
                        executionMappingData['environment'] = data.environment
                        executionMappingData['updated_by'] = data.acct_id

                        await testExecutionDao.updateCaseExecutionMapping(executionMappingData);
                          // insert the execution activity logs 
                          if (data.activity_log) {
                            let activityLog=JSON.parse(data.activity_log) 
                            let executionActivityLogs = {};
                            for (const logElement of activityLog) {
                        
                            executionActivityLogs['execution_id'] = testExecutionID
                            executionActivityLogs['status'] = logElement.status 
                            executionActivityLogs['status_color'] = logElement.status_color 
                            executionActivityLogs['tested_by'] = logElement.tested_by 
                            executionActivityLogs['detail'] = logElement.detail 
                            executionActivityLogs['project_id'] = data.project_id 
                            executionActivityLogs['domain_id'] = data.domain_id 
                            executionActivityLogs['updated_by'] = data.acct_id
                            executionActivityLogs['created_by'] = data.acct_id
                            await testExecutionDao.addExecutionActivity(executionActivityLogs);
                            }
                        }

                        // update last execution parameter for  cycle and test case 
                        if (data.testcycle_id) {
                            await testcycleDao.updateExecutionTime(data);
                        } else {
                            await testcaseDao.updateCaseExecutionTime(data);
                        }

                        // to delete the old issue 
                        await testExecutionDao.deleteIssues(data);
                        // to generate new issue    
                        if (data.execution_issues) {
                            let issuesData = {}
                            for (const issuesElement of data.execution_issues) {
                                issuesData.issue_id = issuesElement.issue_id
                                issuesData.issue_type = issuesElement.issue_type
                                issuesData.issue_name = issuesElement.issue_name
                                issuesData.issue_key = issuesElement.issue_key
                                issuesData.issue_to_link = issuesElement.issue_to_link
                                issuesData.issue_status = issuesElement.issue_status
                                issuesData.issue_icon = issuesElement.issue_icon
                                issuesData.test_type = issuesElement.test_type
                                issuesData.issue_priority = issuesElement.issue_priority
                                issuesData.test_id = testExecutionID
                                issuesData.project_id = data.project_id
                                issuesData.domain_id = data.domain_id
                                issuesData.created_by = data.acct_id
                                issuesData.updated_by = data.acct_id
                                await testcaseDao.addIssues(issuesData);
                                console.log(issuesElement);
                                console.log(issuesData);
                            }
                        }

                        // test plan attachment function works
                        let attachmentSaverArray = [];
                        let attachmentDetails = data.execution_attachment
                        if (attachmentDetails.length) {
                            let attachmentCondition = {}
                            attachmentCondition.project_id = data.project_id
                            attachmentCondition.domain_id = data.domain_id
                            attachmentCondition.testExecutionID = testExecutionID
                            asyncLoop(attachmentDetails, async function (record, next_record) {
                                console.log("******0000000000========000",files)
                                if (record.operation == 'new') {
                                    if (files[record.file_key_name]['path']) {
                                        const bitmap = fs.readFileSync(files[record.file_key_name]['path']);
                                        const imageBase64 = Buffer.from(bitmap).toString('base64');
                                        //const image_name =record.file_name
                                        let image_name
                                        let imageName
                                        if (record.file_url) {
                                            imageName = record.file_url
                                        } else {
                                            image_name = randomstring.generate({ length: 6, charset: 'numeric' });
                                            imageName = `testexecution/attachment-${image_name}.pdf`
                                        }
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
                                                console.log("++++++++++++++++++newnewnewnewnewnew#############", attachmentSaverArray)
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
                                    image_delete(record.file_url, (err, delete_image_url) => {
                                        if (err) {
                                            next_record();
                                        } else {
                                            next_record();
                                        }
                                    })
                                }

                            },
                                async function (error) {
                                    await testExecutionDao.testexecutionAttachment(attachmentSaverArray, attachmentCondition);
                                    return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': {} };
                                })
                        }
                        return { 'rescode': 200, 'msg': message.TEST_EXECUTED, 'data': {} };
                    } else {
                        return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
                }
            }

        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
    },

    listTesters: async data => {
        let cloudUsersRecords = [];;
        let roleData;
        let groupData;
        let cloudAppUser = await testcaseDao.userFromCloudApp({ 'project_id': data.project_id, 'domain_id': data.domain_id });
        let arrayUsers = [];
        if (cloudAppUser.length && cloudAppUser[0].allow_testcycle_execute == 1) {
            let data = {};
            data['jira_acct_id'] = cloudAppUser[0].acct_id;
            data['user_name'] = cloudAppUser[0].user_name;
            cloudUsersRecords.push(data)
        }
        let usersFromRoleTable = await testExecutionDao.userFromRole({ 'project_id': data.project_id, 'domain_id': data.domain_id, 'test_type': data.test_type })
        if (usersFromRoleTable.length) {
            roleData = usersFromRoleTable
        } else {
            roleData = []
        }
        arrayUsers = roleData.concat(cloudUsersRecords)
        let userFromGroup = await testExecutionDao.usersFromGroup({ 'project_id': data.project_id, 'domain_id': data.domain_id, 'test_type': data.test_type });
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
            return { 'rescode': 200, 'msg': message.TESTER_LIST, 'data': resArr };
        } else {
            return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
        }
    },
    newExecution: async (data,regionData) => {
        let userAccess = await checkUserAccess(data);
        let testExecutionArray = []
        if (userAccess.data && userAccess.data[0].allow_testcycle_execute === 1) {
            let testcaseJson = {}
            if (data.testcycle_id) {
                console.log("test cyle is commings ***********************************")
                let fetchCycleCases = await testcycleDao.cycleCasesDetails(data);
                if (fetchCycleCases.length) {
                    let testcase_ids = fetchCycleCases[0].testcase_id
                    let docId = fetchCycleCases[0].doc_id
                    let version = fetchCycleCases[0].version
                    let detailTestcase = await testcycleDao.testcasesData(testcase_ids, version);
                    console.log("@@@@@@@@@@@@@@@@", fetchCycleCases[0])
                    let testcasesData = await testcaseDao.testcaseDocDetails(docId, data);
                    console.log("@@@@@@@@@@@@@@@@111111111111111111111", testcasesData)
                    testcaseJson.id = testcase_ids
                    testcaseJson.testcase_id = testcase_ids
                    testcaseJson.version = fetchCycleCases[0].version
                    testcaseJson.testexecution_id = ''
                    testcaseJson.name = testcasesData.name
                    testcaseJson.test_key = detailTestcase[0].test_key
                    testcaseJson.priority = testcasesData.priority
                    testcaseJson.last_execution = detailTestcase[0].last_execution
                    testcaseJson.updated_by = testcasesData.updated_by
                    testcaseJson.created_by = testcasesData.created_by
                    testcaseJson.created_at = detailTestcase[0].created_at
                    testcaseJson.updated_at = detailTestcase[0].updated_at
                    testcaseJson.doc_id = testcasesData._id
                    testcaseJson.objective = testcasesData.objective
                    testcaseJson.precondition = testcasesData.precondition
                    testcaseJson.estimated_time = testcasesData.estimated_time
                    testcaseJson.status = testcasesData.status
                    testcaseJson.label = testcasesData.label
                    testcaseJson.folder_id = testcasesData.folder_id
                    testcaseJson.description = testcasesData.description
                    testcaseJson.customFields = testcasesData.customFields
                    testcaseJson.testscript_type = testcasesData.testscript_type
                    testcaseJson.testscript = testcasesData.testscript
                    testcaseJson.test_data = testcasesData.test_data
                    testcaseJson.parameters = testcasesData.parameters
                    testcaseJson.weblinks = testcasesData.weblinks
                    testcaseJson.component = testcasesData.component
                    testcaseJson.assigned_to = fetchCycleCases[0].tester
                    testcaseJson.owner = testcasesData.owner
                    if (testcasesData.folder_id) {
                        console.log("##################################")
                        let fetchFolderName = await testExecutionDao.fetchFolderName(testcasesData.folder_id);
                        console.log(fetchFolderName)
                        testcaseJson.folder_name = fetchFolderName[0].folder_name
                    } else {
                        testcaseJson.folder_name = ""
                    }
                    // Issue of testcase 
                    fetchData = {}
                    fetchData.testcase_id = testcase_ids
                    fetchData.project_id = data.project_id
                    fetchData.domain_id = data.domain_id
                    fetchIssues = await testcaseDao.fetchIssues(fetchData, version);
                    let issuesData = {}
                    if (fetchIssues.length) {
                        console.log("%555555555555555555555555")
                        testcaseJson.issues = fetchIssues
                    } else {
                        testcaseJson.issues = []
                    }
                    // attachment signed url function 
                    if (testcasesData.attachments) {
                        let attachmentsData = [];
                        for (const item of testcasesData.attachments) {
                            let attachmentsJson = {}
                            console.log("sssssssssssssssssssssfile_url", item.file_url)
                            if (item.file_url != null && item.file_url != "") {
                                let signed_url = await getSignedUrl(item.file_url,regionData);
                                console.log("jaskbdkajsd", signed_url)
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
                        console.log("attachmentsDataattachmentsDataattachmentsData", attachmentsData)
                        testcaseJson.attachments = attachmentsData;

                    } else {
                        testcaseJson.attachments = []
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                }
            } else {
                let fetchTestCases = await testcaseDao.fetchTestCases(data);
                if (fetchTestCases.length) {
                    let docId = fetchTestCases[0].doc_id
                    let version = fetchTestCases[0].version
                    let testcasesData = await testcaseDao.testcaseDocDetails(docId, data);
                    console.log("@@@@@@@@@@@@@@@@111111111111111111111", testcasesData)
                    let testcase_ids = fetchTestCases[0].id
                    testcaseJson.id = testcase_ids
                    testcaseJson.testcase_id = testcase_ids
                    testcaseJson.version = fetchTestCases[0].version
                    testcaseJson.testexecution_id = ''
                    testcaseJson.name = testcasesData.name
                    testcaseJson.test_key = fetchTestCases[0].test_key
                    testcaseJson.priority = testcasesData.priority
                    testcaseJson.updated_by = testcasesData.updated_by
                    testcaseJson.created_by = testcasesData.created_by
                    testcaseJson.created_at = fetchTestCases[0].created_at
                    testcaseJson.updated_at = fetchTestCases[0].updated_at
                    testcaseJson.doc_id = testcasesData._id
                    testcaseJson.objective = testcasesData.objective
                    testcaseJson.precondition = testcasesData.precondition
                    testcaseJson.estimated_time = testcasesData.estimated_time
                    testcaseJson.status = testcasesData.status
                    testcaseJson.label = testcasesData.label
                    testcaseJson.folder_id = testcasesData.folder_id
                    testcaseJson.description = testcasesData.description
                    testcaseJson.customFields = testcasesData.customFields
                    testcaseJson.testscript_type = testcasesData.testscript_type
                    testcaseJson.testscript = testcasesData.testscript
                    testcaseJson.test_data = testcasesData.test_data
                    testcaseJson.parameters = testcasesData.parameters
                    testcaseJson.weblinks = testcasesData.weblinks
                    testcaseJson.component = testcasesData.component
                    testcaseJson.assigned_to = null
                    testcaseJson.owner = testcasesData.owner
                    if (testcasesData.folder_id) {
                        console.log("##################################")
                        let fetchFolderName = await testExecutionDao.fetchFolderName(testcasesData.folder_id);
                        console.log(fetchFolderName)
                        testcaseJson.folder_name = fetchFolderName[0].folder_name
                    } else {
                        testcaseJson.folder_name = ""
                    }
                    // Issue of testcase 
                    fetchData = {}
                    fetchData.testcase_id = testcase_ids
                    fetchData.project_id = data.project_id
                    fetchData.domain_id = data.domain_id
                    fetchIssues = await testcaseDao.fetchIssues(fetchData, version);
                    let issuesData = {}
                    if (fetchIssues.length) {
                        console.log("%555555555555555555555555")
                        testcaseJson.issues = fetchIssues
                    } else {
                        testcaseJson.issues = []
                    }
                    // attachment signed url function 
                    if (testcasesData.attachments) {
                        let attachmentsData = [];
                        for (const item of testcasesData.attachments) {
                            let attachmentsJson = {}
                            console.log("sssssssssssssssssssssfile_url", item.file_url)
                            if (item.file_url != null && item.file_url != "") {
                                let signed_url = await getSignedUrl(item.file_url,regionData);
                                console.log("jaskbdkajsd", signed_url)
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
                        console.log("attachmentsDataattachmentsDataattachmentsData", attachmentsData)
                        testcaseJson.attachments = attachmentsData;

                    } else {
                        testcaseJson.attachments = []
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                }
            }
            if (testcaseJson) {
                return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': testcaseJson };
            } else {
                return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
            }

        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
    },
    testcaseDetails: async (data,regionData) => {
        let userAccess = await checkUserAccess(data);
        let testExecutionArray = []
        if (userAccess.data && userAccess.data[0].allow_testcycle_execute === 1) {
            let testcaseExecutionRecord = await testExecutionDao.testcaseExecutionRecord(data);
            console.log("checkExecutionExists ############## checkExecutionExists", testcaseExecutionRecord)
            if (testcaseExecutionRecord.length) {
                for (const execution_item of testcaseExecutionRecord) {
                    let testExecutionJson = {}
                    let test_execution_id = execution_item.testexecution_id
                    let testExecutionDetails = await testExecutionDao.testExecutionDetails(data, test_execution_id);
                    testExecutionJson.project_id = testExecutionDetails.project_id
                    testExecutionJson.domain_id = testExecutionDetails.domain_id
                    testExecutionJson.testexecution_id = testExecutionDetails._id
                    testExecutionJson.name = testExecutionDetails.name
                    testExecutionJson.version = testExecutionDetails.version
                    testExecutionJson.description = testExecutionDetails.description
                    testExecutionJson.precondition = testExecutionDetails.precondition
                    testExecutionJson.objective = testExecutionDetails.objective
                    testExecutionJson.owner = testExecutionDetails.owner
                    testExecutionJson.status = testExecutionDetails.status
                    testExecutionJson.priority = testExecutionDetails.priority
                    testExecutionJson.component = testExecutionDetails.component
                    testExecutionJson.customFields = testExecutionDetails.customFields
                    testExecutionJson.estimated_time = testExecutionDetails.estimated_time
                    testExecutionJson.folder_name = testExecutionDetails.folder_name
                    testExecutionJson.folder_id = testExecutionDetails.folder_id
                    testExecutionJson.label = testExecutionDetails.label
                    testExecutionJson.testscript_type = testExecutionDetails.testscript_type
                    testExecutionJson.testscript = testExecutionDetails.testscript
                    testExecutionJson.test_data = testExecutionDetails.test_data
                    testExecutionJson.parameters = testExecutionDetails.parameters
                    testExecutionJson.weblinks = testExecutionDetails.weblinks
                    testExecutionJson.issues = testExecutionDetails.issues
                    testExecutionJson.attachments = testExecutionDetails.attachments
                    testExecutionJson.testcase_id = testExecutionDetails.testcase_id
                    testExecutionJson.execution_status = testExecutionDetails.execution_status
                    testExecutionJson.recorded_time = testExecutionDetails.recorded_time
                    testExecutionJson.testscript_status = testExecutionDetails.testscript_status

                    testExecutionJson.assigned_to = testExecutionDetails.assigned_to
                    testExecutionJson.executed_by = testExecutionDetails.executed_by
                    testExecutionJson.execution_attachment = testExecutionDetails.execution_attachment
                    testExecutionJson.execution_issues = testExecutionDetails.execution_issues
                    testExecutionJson.execution_comment = testExecutionDetails.execution_comment
                    testExecutionJson.environment = testExecutionDetails.environment
                    testExecutionJson.test_key = testExecutionDetails.test_key
                    testExecutionJson.activity_log = testExecutionDetails.activity_log

                    if (testExecutionDetails.folder_id) {
                        console.log("##################################");
                        let fetchFolderName = await testExecutionDao.fetchFolderName(testExecutionDetails.folder_id);
                        console.log(fetchFolderName);
                        testExecutionJson.folder_name = fetchFolderName[0].folder_name;
                    } else {
                        testExecutionJson.folder_name = "";
                    }

                    // attachment signed url function 
                    if (testExecutionDetails.attachments) {
                        let attachmentsData = [];
                        for (const item of testExecutionDetails.attachments) {
                            let attachmentsJson = {}
                            console.log("sssssssssssssssssssssfile_url", item.file_url)
                            if (item.file_url != null && item.file_url != "") {
                                let signed_url = await getSignedUrl(item.file_url,regionData);
                                console.log("jaskbdkajsd", signed_url)
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
                        console.log("attachmentsDataattachmentsDataattachmentsData", attachmentsData)
                        testExecutionJson.attachments = attachmentsData;

                    } else {
                        testExecutionJson.attachments = []
                    }
                    fetchIssues = await testExecutionDao.fetchIssue(data, test_execution_id);
                    let issuesData = {}
                    if (fetchIssues.length) {
                        console.log("%555555555555555555555555")
                        testExecutionJson.execution_issues = fetchIssues
                    } else {
                        testExecutionJson.execution_issues = []
                    }
                    testExecutionArray.push(testExecutionJson)
                }
                return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': testExecutionArray };
            } else {
                let testcaseArrays = []
                let executionCasesDetails = await testExecutionDao.executionCasesDetails(data);
                let testcaseJson = {}
                if (executionCasesDetails.length) {
                    let testcase_ids = executionCasesDetails[0].id
                    let docId = executionCasesDetails[0].doc_id
                    let version = executionCasesDetails[0].version
                    console.log("@@@@@@@@@@@@@@@@", executionCasesDetails[0])
                    let testcasesData = await testcaseDao.testcaseDocDetails(docId, data);
                    console.log("@@@@@@@@@@@@@@@@111111111111111111111", testcasesData)
                    testcaseJson.id = testcase_ids
                    testcaseJson.version = executionCasesDetails[0].version
                    testcaseJson.testexecution_id = ''
                    testcaseJson.name = testcasesData.name
                    testcaseJson.test_key = executionCasesDetails[0].test_key
                    testcaseJson.priority = testcasesData.priority
                    testcaseJson.last_execution = executionCasesDetails[0].last_execution
                    testcaseJson.updated_by = testcasesData.updated_by
                    testcaseJson.created_by = testcasesData.created_by
                    testcaseJson.created_at = executionCasesDetails[0].created_at
                    testcaseJson.updated_at = executionCasesDetails[0].updated_at
                    testcaseJson.doc_id = testcasesData._id
                    testcaseJson.objective = testcasesData.objective
                    testcaseJson.precondition = testcasesData.precondition
                    testcaseJson.estimated_time = testcasesData.estimated_time
                    testcaseJson.status = testcasesData.status
                    testcaseJson.label = testcasesData.label
                    testcaseJson.folder_id = testcasesData.folder_id
                    testcaseJson.folder_name = testcasesData.folder_name
                    testcaseJson.description = testcasesData.description
                    testcaseJson.customFields = testcasesData.customFields
                    testcaseJson.testscript_type = testcasesData.testscript_type
                    testcaseJson.testscript = testcasesData.testscript
                    testcaseJson.test_data = testcasesData.test_data
                    testcaseJson.parameters = testcasesData.parameters
                    testcaseJson.weblinks = testcasesData.weblinks
                    testcaseJson.component = testcasesData.component
                    testcaseJson.assigned_to = null
                    testcaseJson.owner = testcasesData.owner

                    if (testcasesData.folder_id) {
                        console.log("##################################")
                        let fetchFolderName = await testExecutionDao.fetchFolderName(testcasesData.folder_id);
                        console.log(fetchFolderName)
                        testcaseJson.folder_name = fetchFolderName[0].folder_name
                    } else {
                        testcaseJson.folder_name = ""
                    }

                    // Issue of testcase 
                    fetchData = {}
                    fetchData.testcase_id = testcase_ids
                    fetchData.project_id = data.project_id
                    fetchData.domain_id = data.domain_id
                    fetchIssues = await testcaseDao.fetchIssues(fetchData, version);
                    let issuesData = {}
                    if (fetchIssues.length) {
                        console.log("%555555555555555555555555")
                        testcaseJson.issues = fetchIssues
                    } else {
                        testcaseJson.issues = []
                    }
                    // attachment signed url function 
                    if (testcasesData.attachments) {
                        let attachmentsData = [];
                        for (const item of testcasesData.attachments) {
                            let attachmentsJson = {}
                            console.log("sssssssssssssssssssssfile_url", item.file_url)
                            if (item.file_url != null && item.file_url != "") {
                                let signed_url = await getSignedUrl(item.file_url,regionData);
                                console.log("jaskbdkajsd", signed_url)
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
                        console.log("attachmentsDataattachmentsDataattachmentsData", attachmentsData)
                        testcaseJson.attachments = attachmentsData;

                    } else {
                        testcaseJson.attachments = []
                    }
                } else {
                    return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                }
                if (testcaseJson) {
                    testcaseArrays.push(testcaseJson)
                    return { 'rescode': 200, 'msg': message.TESTCASE_LIST, 'data': testcaseArrays };
                } else {
                    return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} }
                }
            }
        } else {
            return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': {} }
        }
    },

    issueDetails: async data => {
        let userAccess = await checkUserAccess(data);
        if (userAccess.data && userAccess.data[0].allow_reports_create === 1) {
            //testcase list of a testcycle
            let issuesDetails = await testExecutionDao.testcaseDetailsFromCycle(data);
            let Array = [];
            let Array1 = [];
            let Array2 = [];
            let Array3 = [];
            let Array4 = [];
            if (issuesDetails && (issuesDetails.testcases).length > 0) {

                //if loop multiple testcases
                for (let i = 0; i < (issuesDetails.testcases).length; i++) {
                    let testcaseId = issuesDetails.testcases[i].testcase_id;
                    //details of testcase
                    let executionDetailsTestcase = await testExecutionDao.testcaseDetailsFromMapping(testcaseId, data);

                    if (executionDetailsTestcase && executionDetailsTestcase.length) {

                        let executionID = executionDetailsTestcase[0].testexecution_id;

                        //last executed testcase deatail for list execution_issues
                        let executionDetailsIssues = await testExecutionDao.testExecutionData(executionID);

                        //if execution issues found
                        // let detailsObj = {};
                        if (executionDetailsIssues && (executionDetailsIssues.execution_issues).length > 0) {

                            // detailsObj['total'] = (executionDetailsIssues.execution_issues).length
                            let testData = executionDetailsIssues.execution_issues
                            console.log("all execution issues======>", testData);

                            if (testData && testData.length > 0) {
                                testData.filter(function (item) {
                                    if (item.issue_type == 'Story') {
                                        Array1.push(item)
                                    }
                                    if (item.issue_type == 'Task') {
                                        Array2.push(item)
                                    }
                                    if (item.issue_type == 'Bug') {
                                        Array3.push(item)
                                    }
                                    if (item.issue_type == 'Epic') {
                                        Array4.push(item)
                                    }
                                });
                                //Story priority count
                                if (Array1.length > 0) {
                                    let Obj = {}
                                    let countStory = Array1.reduce((c, { issue_priority: key }) => (c[key] = (c[key] || 0) + 1, c), {});
                                    console.log("==============================>", Array1, countStory);
                                    let count = Object.values(countStory).reduce((a, b) => a + b, 0);
                                    let priorityObj = {}
                                    priorityObj['Highest'] = countStory.Highest || 0
                                    priorityObj['High'] = countStory.High || 0
                                    priorityObj['Medium'] = countStory.Medium || 0
                                    priorityObj['Low'] = countStory.Low || 0
                                    priorityObj['Lowest'] = countStory.Lowest || 0
                                    Obj['issue_type'] = 'Story'
                                    Obj['count'] = priorityObj
                                    Obj['total'] = count || 0
                                    Array.push(Obj);
                                }

                                //Task priority count
                                if (Array2.length > 0) {
                                    let Obj = {}
                                    let countStory = Array2.reduce((c, { issue_priority: key }) => (c[key] = (c[key] || 0) + 1, c), {});
                                    console.log("==============================>", Array2, countStory);
                                    let count = Object.values(countStory).reduce((a, b) => a + b, 0);
                                    let priorityObj = {}
                                    priorityObj['Highest'] = countStory.Highest || 0
                                    priorityObj['High'] = countStory.High || 0
                                    priorityObj['Medium'] = countStory.Medium || 0
                                    priorityObj['Low'] = countStory.Low || 0
                                    priorityObj['Lowest'] = countStory.Lowest || 0
                                    Obj['issue_type'] = 'Task'
                                    Obj['count'] = priorityObj
                                    Obj['total'] = count || 0
                                    Array.push(Obj);
                                }

                                //Bug priority count
                                if (Array3.length > 0) {
                                    let Obj = {}
                                    let countStory = Array3.reduce((c, { issue_priority: key }) => (c[key] = (c[key] || 0) + 1, c), {});
                                    console.log("==============================>", Array3, countStory);
                                    let count = Object.values(countStory).reduce((a, b) => a + b, 0);
                                    let priorityObj = {}
                                    priorityObj['Highest'] = countStory.Highest || 0
                                    priorityObj['High'] = countStory.High || 0
                                    priorityObj['Medium'] = countStory.Medium || 0
                                    priorityObj['Low'] = countStory.Low || 0
                                    priorityObj['Lowest'] = countStory.Lowest || 0
                                    Obj['issue_type'] = 'Bug'
                                    Obj['count'] = priorityObj
                                    Obj['total'] = count || 0
                                    Array.push(Obj);
                                }

                                //Epic priority count
                                if (Array4.length > 0) {
                                    let Obj = {}
                                    let countStory = Array4.reduce((c, { issue_priority: key }) => (c[key] = (c[key] || 0) + 1, c), {});
                                    console.log("==============================>", Array4, countStory);
                                    let count = Object.values(countStory).reduce((a, b) => a + b, 0);
                                    let priorityObj = {}
                                    priorityObj['Highest'] = countStory.Highest || 0
                                    priorityObj['High'] = countStory.High || 0
                                    priorityObj['Medium'] = countStory.Medium || 0
                                    priorityObj['Low'] = countStory.Low || 0
                                    priorityObj['Lowest'] = countStory.Lowest || 0
                                    Obj['issue_type'] = 'Epic'
                                    Obj['count'] = priorityObj
                                    Obj['total'] = count || 0
                                    Array.push(Obj);
                                }
                            }
                        } else {
                            Array = []
                        }
                    } else {
                        console.log("no execution details found")
                    }
                }
            } else {
                issuesDetails = []
            }

            let Highest1 = 0;
            let High1 = 0;
            let Medium1 = 0;
            let Low1 = 0;
            let Lowest1 = 0;
            let total1 = 0

            let Highest2 = 0;
            let High2 = 0;
            let Medium2 = 0;
            let Low2 = 0;
            let Lowest2 = 0;
            let total2 = 0

            let Highest3 = 0;
            let High3 = 0;
            let Medium3 = 0;
            let Low3 = 0;
            let Lowest3 = 0;
            let total3 = 0

            let Highest4 = 0;
            let High4 = 0;
            let Medium4 = 0;
            let Low4 = 0;
            let Lowest4 = 0;
            let total4 = 0
            let arrayFinal = []

            //total priority count of all testcases found for each issue type
            if (Array.length > 0) {
                for (let i = 0; i < Array.length; i++) {
                    if (Array[i].issue_type == 'Story') {
                        Highest1 += Array[i].count.Highest
                        High1 += Array[i].count.High
                        Medium1 += Array[i].count.Medium
                        Low1 += Array[i].count.Low
                        Lowest1 += Array[i].count.Lowest
                        total1 += Array[i].total
                    }
                    if (Array[i].issue_type == 'Task') {
                        Highest2 += Array[i].count.Highest
                        High2 += Array[i].count.High
                        Medium2 += Array[i].count.Medium
                        Low2 += Array[i].count.Low
                        Lowest2 += Array[i].count.Lowest
                        total2 += Array[i].total
                    }
                    if (Array[i].issue_type == 'Bug') {
                        Highest3 += Array[i].count.Highest
                        High3 += Array[i].count.High
                        Medium3 += Array[i].count.Medium
                        Low3 += Array[i].count.Low
                        Lowest3 += Array[i].count.Lowest
                        total3 += Array[i].total
                    }
                    if (Array[i].issue_type == 'Epic') {
                        Highest4 += Array[i].count.Highest
                        High4 += Array[i].count.High
                        Medium4 += Array[i].count.Medium
                        Low4 += Array[i].count.Low
                        Lowest4 += Array[i].count.Lowest
                        total4 += Array[i].total
                    }
                    if (i == Array.length - 1) {
                        let priorityObj1 = {}
                        let Obj1 = {}
                        priorityObj1['Highest'] = Highest1 || 0
                        priorityObj1['High'] = High1 || 0
                        priorityObj1['Medium'] = Medium1 || 0
                        priorityObj1['Low'] = Low1 || 0
                        priorityObj1['Lowest'] = Lowest1 || 0
                        Obj1['issue_type'] = 'Story'
                        Obj1['issue_priority_count'] = priorityObj1
                        Obj1['total_issue'] = total1 || 0
                        arrayFinal.push(Obj1);

                        console.log("Story====================================>")

                        let priorityObj2 = {}
                        let Obj2 = {}
                        priorityObj2['Highest'] = Highest2 || 0
                        priorityObj2['High'] = High2 || 0
                        priorityObj2['Medium'] = Medium2 || 0
                        priorityObj2['Low'] = Low2 || 0
                        priorityObj2['Lowest'] = Lowest2 || 0
                        Obj2['issue_type'] = 'Task'
                        Obj2['issue_priority_count'] = priorityObj2
                        Obj2['total_issue'] = total2 || 0
                        arrayFinal.push(Obj2);

                        console.log("Task====================================>")

                        let priorityObj3 = {}
                        let Obj3 = {}
                        priorityObj3['Highest'] = Highest3 || 0
                        priorityObj3['High'] = High3 || 0
                        priorityObj3['Medium'] = Medium3 || 0
                        priorityObj3['Low'] = Low3 || 0
                        priorityObj3['Lowest'] = Lowest3 || 0
                        Obj3['issue_type'] = 'Bug'
                        Obj3['issue_priority_count'] = priorityObj3
                        Obj3['total_issue'] = total3 || 0
                        arrayFinal.push(Obj3);

                        console.log("Bug====================================>")

                        let priorityObj4 = {}
                        let Obj4 = {}
                        priorityObj4['Highest'] = Highest4 || 0
                        priorityObj4['High'] = High4 || 0
                        priorityObj4['Medium'] = Medium4 || 0
                        priorityObj4['Low'] = Low4 || 0
                        priorityObj4['Lowest'] = Lowest4 || 0
                        Obj4['issue_type'] = 'Epic'
                        Obj4['issue_priority_count'] = priorityObj4
                        Obj4['total_issue'] = total4 || 0
                        arrayFinal.push(Obj4);

                        console.log("Epic====================================>")
                    }
                }
            } else {
                arrayFinal = []
            }
            if (arrayFinal) {
                return { 'rescode': 200, 'msg': message.DATA_FETCHED, 'data': arrayFinal };
            } else {
                return { 'rescode': 401, 'msg': message.INVALID_DETAILS, 'data': {} };
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

module.exports = { testexecutionService };