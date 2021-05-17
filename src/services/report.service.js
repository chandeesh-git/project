const reportDao = require('../dao/report.dao').reportDetails;
const folderDao = require('../dao/folder.dao').folderDetails;
const message = require('../utils/message');
const error_message = require('../utils/error_message');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const fs = require('fs');
const randomstring = require('randomstring')
const { response, getFormateDateForEdit, getDateArray } = require('../utils/utility');

const reportService = {
    reportList: async (data) => {
        let responseJson = {}
        let testcaseStatusData = []
        let testcaseJson = {}
        let testcycle_id = data.testcycle_id
        // fetch the config status from db
        fetchConfigStatus = await reportDao.fetchConfigStatus(data);
        for (const statusItem of fetchConfigStatus) {
            statusItem.count = 0
            console.log(statusItem);
        }
        fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
        let totalExecution = fetchCycleCases.length
        let new_data = {}
        new_data.sc_name = "Total Testcase"
        new_data.count = fetchCycleCases.length
        fetchConfigStatus.push(new_data)
        if (fetchCycleCases.length) {
            for (const casesItem of fetchCycleCases) {
                let testcase_ids = casesItem.testcase_id
                let version = casesItem.version
                let docId = casesItem.doc_id
                fetchTestcases = await reportDao.testcaseDocDetails(docId);
                testcaseJson.doc_id = fetchTestcases._id
                testcaseJson.id = testcase_ids
                testcaseJson.name = fetchTestcases.name
                testcaseJson.priority = fetchTestcases.priority
                testcaseJson.component = fetchTestcases.component
                testcaseJson.description = fetchTestcases.description
                testcaseJson.version = fetchTestcases.version
                fetchExecutionData = await folderDao.fetchExecutionData(testcase_ids, testcycle_id, version);
                if (fetchExecutionData.length) {
                    testcaseJson.execution_status = fetchExecutionData[0].execution_status
                    testcaseStatusData.push(testcaseJson)
                    testcaseJson = {}
                    let testStatus = fetchExecutionData[0].execution_status
                    let filterTestcase = fetchConfigStatus.filter(filteredDatas => filteredDatas.sc_name == testStatus);
                    if (filterTestcase.length != 0) {
                        for (const element of fetchConfigStatus) {
                            if (element.sc_name == testStatus) {
                                element.count++
                            }
                        }
                    } else {
                        let newStatus = {}
                        newStatus.sc_name = testStatus
                        newStatus.count = 1
                        fetchConfigStatus.push(newStatus)
                    }

                } else {
                    let testStatus = "Not Executed"
                    for (const element of fetchConfigStatus) {
                        if (element.sc_name == testStatus) {
                            element.count++
                        }
                    }
                    testcaseJson.execution_status = "Not Executed"
                    testcaseStatusData.push(testcaseJson)
                    testcaseJson = {}
                }
            }
        }

        responseJson.testcaseData = testcaseStatusData
        responseJson.statusCount = fetchConfigStatus
        if (responseJson) {
            return { 'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data': responseJson };
        } else {
            return { 'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': {} }
        }
    },

    testCycleList: async (data) => {
        let responseJson = {}
        // fetch test cycle list based on date and env
        fetchCycleList = await reportDao.fetchCycleList(data);
        if (fetchCycleList) {
            return { 'rescode': 200, 'msg': message.PROJECT_DETAIL, 'data': fetchCycleList };
        } else {
            return { 'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': {} }
        }
    },

    reportDetail: async (data) => {
        let responseJson = {}
        let responseData = []
        let testcaseJson = {}
        let Array = [];
        let Array1 = [];
        let Array2 = [];
        let Array3 = [];
        let Array4 = [];
        let testcycle_id = data.testcycle_id
        // fetch the config status from db
        fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
        console.log(fetchCycleCases)
        if (fetchCycleCases.length) {
            for (const casesItem of fetchCycleCases) {
                let testcase_ids = casesItem.testcase_id
                let version = casesItem.version
                let docId = casesItem.doc_id
                fetchExecutionData = await folderDao.fetchExecutionData(testcase_ids, testcycle_id, version);
                if (fetchExecutionData.length) {
                    let execution_id = fetchExecutionData[0].testexecution_id
                    fetchIssueTypes = await reportDao.fetchIssueTypes(execution_id);
                    console.log("fetchIssueTypes", fetchIssueTypes)
                    fetchIssueTypes.filter(function (item) {
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
                }
            }
            let storyObj = {}
            console.log(Array1)
            console.log(Array2)
            console.log(Array3)
            console.log(Array4)
            let priorityCount = {}
            storyObj.issue_type = 'Story'
            priorityCount.Highest = 0
            priorityCount.High = 0
            priorityCount.Medium = 0
            priorityCount.Low = 0
            priorityCount.Lowest = 0
            storyObj.issue_priority_count = priorityCount
            storyObj.total = Array1.length
            for (const element of Array1) {
                if (element.issue_priority == 'Highest') {
                    storyObj.issue_priority_count.Highest++
                }
                if (element.issue_priority == 'High') {
                    storyObj.issue_priority_count.High++
                }
                if (element.issue_priority == 'Medium') {
                    storyObj.issue_priority_count.Medium++
                }
                if (element.issue_priority == 'Low') {
                    storyObj.issue_priority_count.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    storyObj.issue_priority_count.Lowest++
                }
            }
            console.log(storyObj)
            let taskObj = {}
            let taskCount = {}
            taskObj.issue_type = 'Task'
            taskCount.Highest = 0
            taskCount.High = 0
            taskCount.Medium = 0
            taskCount.Low = 0
            taskCount.Lowest = 0
            taskObj.issue_priority_count = taskCount
            taskObj.total = Array2.length
            for (const element of Array2) {
                if (element.issue_priority == 'Highest') {
                    taskObj.issue_priority_count.Highest++
                }
                if (element.issue_priority == 'High') {
                    taskObj.issue_priority_count.High++
                }
                if (element.issue_priority == 'Medium') {
                    taskObj.issue_priority_count.Medium++
                }
                if (element.issue_priority == 'Low') {
                    taskObj.issue_priority_count.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    taskObj.issue_priority_count.Lowest++
                }
            }
            console.log(taskObj)
            let bugObj = {}
            let bugCount = {}
            bugObj.issue_type = 'Bug'
            bugCount.Highest = 0
            bugCount.High = 0
            bugCount.Medium = 0
            bugCount.Low = 0
            bugCount.Lowest = 0
            bugObj.issue_priority_count = bugCount
            bugObj.total = Array3.length
            for (const element of Array3) {
                if (element.issue_priority == 'Highest') {
                    bugObj.issue_priority_count.Highest++
                }
                if (element.issue_priority == 'High') {
                    bugObj.issue_priority_count.High++
                }
                if (element.issue_priority == 'Medium') {
                    bugObj.issue_priority_count.Medium++
                }
                if (element.issue_priority == 'Low') {
                    bugObj.issue_priority_count.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    bugObj.issue_priority_count.Lowest++
                }
            }

            let epicObj = {}
            let epicCount = {}
            epicObj.issue_type = 'Epic'
            epicCount.Highest = 0
            epicCount.High = 0
            epicCount.Medium = 0
            epicCount.Low = 0
            epicCount.Lowest = 0
            epicObj.issue_priority_count = epicCount
            epicObj.total = Array4.length
            for (const element of Array4) {
                if (element.issue_priority == 'Highest') {
                    epicObj.issue_priority_count.Highest++
                }
                if (element.issue_priority == 'High') {
                    epicObj.issue_priority_count.High++
                }
                if (element.issue_priority == 'Medium') {
                    epicObj.issue_priority_count.Medium++
                }
                if (element.issue_priority == 'Low') {
                    epicObj.issue_priority_count.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    epicObj.issue_priority_count.Lowest++
                }
            }
            responseData.push(storyObj)
            responseData.push(taskObj)
            responseData.push(bugObj)
            responseData.push(epicObj)
            return { 'rescode': 200, 'msg': message.REPORT_DETAIL, 'data': responseData };
        } else {
            return { 'rescode': 200, 'msg': message.REPORT_DETAIL, 'data': [] };
        }
    },

    defectDistribution: async (data) => {
        let componentJson = {}
        let responseData = []
        let testArray = []
        let finalArray = []
        // loop for multiple test cycle
        for (const ids_data of data.testcycle_id) {
            let testcycle_id = ids_data
            // fetch the test case of test cycle from db
            fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
            if (fetchCycleCases.length) {
                // loop for getting the component and issues priority
                for (const casesItem of fetchCycleCases) {
                    let testcase_ids = casesItem.testcase_id
                    let version = casesItem.version
                    let docId = casesItem.doc_id
                    fetchComponentData = await reportDao.testcaseDocDetails(docId);
                    let component = fetchComponentData.component
                    if (component) {
                        fetchExecutionData = await folderDao.fetchExecutionData(testcase_ids, testcycle_id, version);
                        if (fetchExecutionData.length) {
                            let execution_id = fetchExecutionData[0].testexecution_id
                            fetchIssueTypes = await reportDao.fetchIssueTypes(execution_id);
                            componentJson.component_name = component
                            componentJson.issue_priority_count = fetchIssueTypes
                            responseData.push(componentJson)
                            componentJson = {}
                        } else {
                            componentJson.component_name = component
                            componentJson.issue_priority_count = []
                            responseData.push(componentJson)
                            componentJson = {}
                        }
                        console.log("one on eon e", responseData)
                    }
                }
            }
        }

        console.log("Thsi my dataa", responseData)
        let newCompJson = {}
        // loops for merge the unique component data their priority
        for (const element of responseData) {
            let filterTestcase = testArray.filter(filteredDatas => filteredDatas.component_name == element.component_name);

            if (filterTestcase.length == 0) {
                testArray.push(element)
            } else {
                for (const item of testArray) {
                    if (item.component_name == element.component_name) {
                        let old_issue = item.issue_priority_count
                        let new_issue = element.issue_priority_count
                        let combine_issue = old_issue.concat(new_issue)
                        item.issue_priority_count = combine_issue
                    }

                }
            }

        }

        console.log("This my testArraytestArraytestArray", testArray)
        // loops for getting the priority count for different different component
        let lastJson = {}
        priorityCount = {}
        for (const next_data of testArray) {
            lastJson.component_name = next_data.component_name
            priorityCount.Highest = 0
            priorityCount.High = 0
            priorityCount.Medium = 0
            priorityCount.Lowest = 0
            priorityCount.Low = 0
            lastJson.total = next_data.issue_priority_count.length
            lastJson.issue_priority_count = priorityCount
            for (const next_issues of next_data.issue_priority_count) {
                if (next_issues.issue_priority == 'Highest') {
                    lastJson.issue_priority_count.Highest++
                }
                if (next_issues.issue_priority == 'High') {
                    lastJson.issue_priority_count.High++
                }
                if (next_issues.issue_priority == 'Medium') {
                    lastJson.issue_priority_count.Medium++
                }
                if (next_issues.issue_priority == 'Lowest') {
                    lastJson.issue_priority_count.Lowest++
                }
                if (next_issues.issue_priority == 'Low') {
                    lastJson.issue_priority_count.Low++
                }

            }
            finalArray.push(lastJson)
            lastJson = {}
            priorityCount = {}

        }

        return { 'rescode': 200, 'msg': message.REPORT_DETAIL, 'data': finalArray };

    },

    testcaseReport: async (data) => {
        fetchTestcaseCount = await reportDao.fetchTestcaseCount(data);
        if (fetchTestcaseCount.length) {
            return { 'rescode': 200, 'msg': message.REPORT_DETAIL, 'data': fetchTestcaseCount };
        } else {
            return { 'rescode': 401, 'msg': message.NO_DATA_AVAILABLE, 'data': [] };
        }
    },

    activityLogs: async (data) => {
        let responseData = {}
        logsCount = await reportDao.logsCount(data);
        console.log(logsCount)
        fetchActivityLogs = await reportDao.activityLogs(data);
        responseData.total_record = logsCount[0].total_count;
        responseData.activity_data = fetchActivityLogs
        return { 'rescode': 200, 'msg': message.REPORT_DETAIL, 'data': responseData };
    },

    executionStatus: async (data) => {
        let array_date
        if(data.last_days!="custom"){
            let set_date = new Date()
            let end_dates = set_date.setDate(set_date.getDate() - (data.last_days-1));
            array_date  = getDateArray(new Date(end_dates), new Date())
        } else{
            array_date = getDateArray(new Date(data.start_date), new Date(data.end_date))
        }
        
        let all_date = array_date.reverse()
        console.log(array_date)
        let executionJson = {}
        let executionArray = []
        let responseArray = []
        statisticsExecutionData = await reportDao.statisticsExecutionData(data);
        let temp_date = null
        for (const item of statisticsExecutionData) {
            let filterRecord = responseArray.filter(filteredDatas => filteredDatas.execution_date == item.updated_date);
            if (filterRecord.length == 0) {
                executionJson.execution_date = item.updated_date
                executionArray.push(item)
                executionJson.status_data = executionArray
                responseArray.push(executionJson)
                executionJson = {}
                executionArray = []
            } else {
                for (const element of responseArray) {
                    if (element.execution_date == item.updated_date) {
                        let old_data = element.status_data
                        let new_data = []
                        new_data.push(item)

                        let combine_data = old_data.concat(new_data)
                        element.status_data = combine_data
                    }

                }
            }
        }
        let lastJson = {}
        statusCount = {}
        let finalArray = []
        for (const next_data of responseArray) {
            lastJson.execution_date = next_data.execution_date
            statusCount.Not_Executed = 0
            statusCount.In_Progress = 0
            statusCount.Pass = 0
            statusCount.Fail = 0
            statusCount.Blocked = 0
            statusCount.total = next_data.status_data.length
            // lastJson.total = next_data.statusCount.length
            lastJson.issue_count = statusCount
            for (const next_issues of next_data.status_data) {
                if (next_issues.execution_status == 'Not Executed') {
                    lastJson.issue_count.Not_Executed++
                }
                if (next_issues.execution_status == 'In Progress') {
                    lastJson.issue_count.In_Progress++
                }
                if (next_issues.execution_status == 'Pass') {
                    lastJson.issue_count.Pass++
                }
                if (next_issues.execution_status == 'Fail') {
                    lastJson.issue_count.Fail++
                }
                if (next_issues.execution_status == 'Blocked') {
                    lastJson.issue_count.Blocked++
                }

            }
            finalArray.push(lastJson)
            lastJson = {}
            statusCount = {}

        }
        let combineArray = []
        let dateJson = {}
        let issueCounts = {}
        for (const next_dates of all_date) {
            console.log("get eteh " + next_dates)
            let filterDates = finalArray.filter(filteredDatas => filteredDatas.execution_date == next_dates);
            console.log(filterDates)
            if (filterDates.length == 0) {
                dateJson.execution_date = next_dates
                issueCounts.Not_Executed = 0
                issueCounts.In_Progress = 0
                issueCounts.Pass = 0
                issueCounts.Fail = 0
                issueCounts.Blocked = 0
                issueCounts.total = 0
                dateJson.issue_count = issueCounts
                combineArray.push(dateJson)
                dateJson = {}
                issueCounts = {}

            } else {
                combineArray.push(filterDates[0])
            }
        }
        return { 'rescode': 200, 'msg': message.REPORT_DETAIL, 'data': combineArray };
    },
    exportExecutionList: async (data, res) => {
        console.log("dtaatatatatta", data)
        let downloadData = {}
        let csvData
        let responseJson = {}
        let testcaseStatusData = []
        let testcaseJson = {}
        let testcycle_id = data.testcycle_id
        // fetch the config status from db
        fetchConfigStatus = await reportDao.fetchConfigStatus(data);
        for (const statusItem of fetchConfigStatus) {
            statusItem.count = 0
            console.log(statusItem);
        }
        fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
        let totalExecution = fetchCycleCases.length
        let new_data = {}
        new_data.sc_name = "Total Testcase"
        new_data.count = fetchCycleCases.length
        fetchConfigStatus.push(new_data)
        if (fetchCycleCases.length) {
            for (const casesItem of fetchCycleCases) {
                let testcase_ids = casesItem.testcase_id
                let version = casesItem.version
                let docId = casesItem.doc_id
                fetchTestcases = await reportDao.testcaseDocDetails(docId);
                testcaseJson.doc_id = fetchTestcases._id
                testcaseJson.id = testcase_ids
                testcaseJson.name = fetchTestcases.name
                testcaseJson.priority = fetchTestcases.priority
                testcaseJson.component = fetchTestcases.component
                testcaseJson.description = fetchTestcases.description
                testcaseJson.version = fetchTestcases.version
                fetchExecutionData = await folderDao.fetchExecutionData(testcase_ids, testcycle_id, version);
                if (fetchExecutionData.length) {
                    testcaseJson.execution_status = fetchExecutionData[0].execution_status
                    testcaseStatusData.push(testcaseJson)
                    testcaseJson = {}
                    let testStatus = fetchExecutionData[0].execution_status
                    let filterTestcase = fetchConfigStatus.filter(filteredDatas => filteredDatas.sc_name == testStatus);
                    if (filterTestcase.length != 0) {
                        for (const element of fetchConfigStatus) {
                            if (element.sc_name == testStatus) {
                                element.count++
                            }
                        }
                    } else {
                        let newStatus = {}
                        newStatus.sc_name = testStatus
                        newStatus.count = 1
                        fetchConfigStatus.push(newStatus)
                    }

                } else {
                    let testStatus = "Not Executed"
                    for (const element of fetchConfigStatus) {
                        if (element.sc_name == testStatus) {
                            element.count++
                        }
                    }
                    testcaseJson.execution_status = "Not Executed"
                    testcaseStatusData.push(testcaseJson)
                    testcaseJson = {}
                }
            }
        }

        responseJson.testcaseData = testcaseStatusData
        responseJson.statusCount = fetchConfigStatus
        if (testcaseStatusData.length) {
            let responseArray = [];
            const fields = [
                { value: 'name', label: 'Name' },
                { value: 'version', label: 'Version' },
                { value: 'execution_status', label: 'Status' },
                { value: 'priority', label: 'Priority' },
            ]
            const json2csvParser = new Parser({ fields });
            csvData = json2csvParser.parse(testcaseStatusData);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=Test Execution Report List.csv");
            res.status(200).end(csvData);

        } else {
            return response(res, 401, message.NO_TESTCASE, [], null)
        }
    },

    exportExecutionStatus: async (data, res) => {
        console.log("dtaatatatatta", data)
        let csvData
        let testcaseJson = {}
        let testcycle_id = data.testcycle_id
        // fetch the config status from db
        fetchConfigStatus = await reportDao.fetchConfigStatus(data);
        for (const statusItem of fetchConfigStatus) {
            statusItem.count = 0
            console.log(statusItem);
        }
        fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
        let totalExecution = fetchCycleCases.length
        let new_data = {}
        new_data.sc_name = "Total Testcase"
        new_data.count = fetchCycleCases.length
        fetchConfigStatus.push(new_data)
        if (fetchCycleCases.length) {
            for (const casesItem of fetchCycleCases) {
                let testcase_ids = casesItem.testcase_id
                let version = casesItem.version
                let docId = casesItem.doc_id
                fetchTestcases = await reportDao.testcaseDocDetails(docId);
                testcaseJson.doc_id = fetchTestcases._id
                testcaseJson.id = testcase_ids
                fetchExecutionData = await folderDao.fetchExecutionData(testcase_ids, testcycle_id, version);
                if (fetchExecutionData.length) {
                    testcaseJson.execution_status = fetchExecutionData[0].execution_status
                    let testStatus = fetchExecutionData[0].execution_status
                    let filterTestcase = fetchConfigStatus.filter(filteredDatas => filteredDatas.sc_name == testStatus);
                    if (filterTestcase.length != 0) {
                        for (const element of fetchConfigStatus) {
                            if (element.sc_name == testStatus) {
                                element.count++
                            }
                        }
                    } else {
                        let newStatus = {}
                        newStatus.sc_name = testStatus
                        newStatus.count = 1
                        fetchConfigStatus.push(newStatus)
                    }

                } else {
                    let testStatus = "Not Executed"
                    for (const element of fetchConfigStatus) {
                        if (element.sc_name == testStatus) {
                            element.count++
                        }
                    }
                }
            }
        }
        if (fetchConfigStatus.length) {
            let statusArray = []
            for (const statusItem of fetchConfigStatus) {
                let statusName = statusItem.sc_name
                let statusValue = statusItem.count
                let statusJson = {
                    [statusName]: statusValue
                }
                statusArray.push(statusJson)
                statusJson = {}

            }
            let finalStatus = statusArray.reduce(((result, current) => Object.assign(result, current)), {});
            let finalStatusArray = []
            finalStatusArray.push(finalStatus)
            console.log("hjggjgjgjgjgj", finalStatus)
            // set dynamic header or key for csv file start 
            let fieldsJson = {}
            let fields = []
            for (const csvItem of fetchConfigStatus) {
                fieldsJson.value = csvItem.sc_name
                fieldsJson.label = csvItem.sc_name
                fields.push(fieldsJson)
                fieldsJson = {}
            }
            // set dynamic header or key for csv file end 
            console.log(fields)
            const json2csvParser = new Parser({ fields });
            csvData = json2csvParser.parse(finalStatusArray);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=Test Execution Report Detail.csv");
            res.status(200).end(csvData);

        } else {
            return response(res, 401, message.NO_TESTCASE, [], null)
        }
    },


    exportExecutionDetail: async (data, res) => {
        console.log("dtaatatatatta", data)
        let csvData
        let responseData = []
        let testcaseJson = {}
        let Array1 = [];
        let Array2 = [];
        let Array3 = [];
        let Array4 = [];
        let testcycle_id = data.testcycle_id
        // fetch the config status from db
        fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
        console.log(fetchCycleCases)
        if (fetchCycleCases.length) {
            for (const casesItem of fetchCycleCases) {
                let testcase_ids = casesItem.testcase_id
                let version = casesItem.version
                let docId = casesItem.doc_id
                fetchExecutionData = await folderDao.fetchExecutionData(testcase_ids, testcycle_id, version);
                if (fetchExecutionData.length) {
                    let execution_id = fetchExecutionData[0].testexecution_id
                    fetchIssueTypes = await reportDao.fetchIssueTypes(execution_id);
                    console.log("fetchIssueTypes", fetchIssueTypes)
                    fetchIssueTypes.filter(function (item) {
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
                }
            }
            let storyObj = {}
            storyObj.issue_type = 'Story'
            storyObj.Highest = 0
            storyObj.High = 0
            storyObj.Medium = 0
            storyObj.Low = 0
            storyObj.Lowest = 0
            // storyObj.issue_priority_count = priorityCount
            storyObj.total = Array1.length
            for (const element of Array1) {
                if (element.issue_priority == 'Highest') {
                    storyObj.Highest++
                }
                if (element.issue_priority == 'High') {
                    storyObj.High++
                }
                if (element.issue_priority == 'Medium') {
                    storyObj.Medium++
                }
                if (element.issue_priority == 'Low') {
                    storyObj.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    storyObj.Lowest++
                }
            }
            console.log(storyObj)
            let taskObj = {}
            taskObj.issue_type = 'Task'
            taskObj.Highest = 0
            taskObj.High = 0
            taskObj.Medium = 0
            taskObj.Low = 0
            taskObj.Lowest = 0
            // taskObj.issue_priority_count = taskCount
            taskObj.total = Array2.length
            for (const element of Array2) {
                if (element.issue_priority == 'Highest') {
                    taskObj.Highest++
                }
                if (element.issue_priority == 'High') {
                    taskObj.High++
                }
                if (element.issue_priority == 'Medium') {
                    taskObj.Medium++
                }
                if (element.issue_priority == 'Low') {
                    taskObj.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    taskObj.Lowest++
                }
            }
            console.log(taskObj)
            let bugObj = {}
            bugObj.issue_type = 'Bug'
            bugObj.Highest = 0
            bugObj.High = 0
            bugObj.Medium = 0
            bugObj.Low = 0
            bugObj.Lowest = 0
            // bugObj.issue_priority_count = bugCount
            bugObj.total = Array3.length
            for (const element of Array3) {
                if (element.issue_priority == 'Highest') {
                    bugObj.Highest++
                }
                if (element.issue_priority == 'High') {
                    bugObj.High++
                }
                if (element.issue_priority == 'Medium') {
                    bugObj.Medium++
                }
                if (element.issue_priority == 'Low') {
                    bugObj.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    bugObj.Lowest++
                }
            }

            let epicObj = {}
            epicObj.issue_type = 'Epic'
            epicObj.Highest = 0
            epicObj.High = 0
            epicObj.Medium = 0
            epicObj.Low = 0
            epicObj.Lowest = 0
            //epicObj.issue_priority_count = epicCount
            epicObj.total = Array4.length
            for (const element of Array4) {
                if (element.issue_priority == 'Highest') {
                    epicObj.Highest++
                }
                if (element.issue_priority == 'High') {
                    epicObj.High++
                }
                if (element.issue_priority == 'Medium') {
                    epicObj.Medium++
                }
                if (element.issue_priority == 'Low') {
                    epicObj.Low++
                }
                if (element.issue_priority == 'Lowest') {
                    epicObj.Lowest++
                }
            }
            responseData.push(storyObj)
            responseData.push(taskObj)
            responseData.push(bugObj)
            responseData.push(epicObj)
            console.log("hell plsssssssss", responseData)
            const fields = [
                { value: 'issue_type', label: 'Issue Type' },
                { value: 'Highest', label: 'Highest' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
                { value: 'Lowest', label: 'Lowest' },
                { value: 'total', label: 'Total' },
            ]
            const json2csvParser = new Parser({ fields });
            csvData = json2csvParser.parse(responseData);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=Test Execution Report Detail.csv");
            res.status(200).end(csvData);
        } else {
            return response(res, 401, message.NO_TESTCASE, [], null)
        }
    },

    exportTraceabilityReport: async (data, res) => {
        console.log("dtaatatatatta", data)
        let csvData
        let componentJson = {}
        let responseData = []
        let testArray = []
        let finalArray = []
        // loop for multiple test cycle
        for (const ids_data of data.testcycle_id) {
            let testcycle_id = ids_data
            // fetch the test case of test cycle from db
            fetchCycleCases = await folderDao.fetchCycleCases(testcycle_id);
            if (fetchCycleCases.length) {
                // loop for getting the component and issues priority
                for (const casesItem of fetchCycleCases) {
                    let testcase_ids = casesItem.testcase_id
                    let version = casesItem.version
                    let docId = casesItem.doc_id
                    fetchComponentData = await reportDao.testcaseDocDetails(docId);
                    let component = fetchComponentData.component
                    if (component) {
                        fetchExecutionData = await folderDao.fetchExecutionData(testcase_ids, testcycle_id, version);
                        if (fetchExecutionData.length) {
                            let execution_id = fetchExecutionData[0].testexecution_id
                            fetchIssueTypes = await reportDao.fetchIssueTypes(execution_id);
                            componentJson.component_name = component
                            componentJson.issue_priority_count = fetchIssueTypes
                            responseData.push(componentJson)
                            componentJson = {}
                        } else {
                            componentJson.component_name = component
                            componentJson.issue_priority_count = []
                            responseData.push(componentJson)
                            componentJson = {}
                        }
                        console.log("one on eon e", responseData)
                    }
                }
            }
        }

        console.log("Thsi my dataa", responseData)
        let newCompJson = {}
        // loops for merge the unique component data their priority
        for (const element of responseData) {
            let filterTestcase = testArray.filter(filteredDatas => filteredDatas.component_name == element.component_name);

            if (filterTestcase.length == 0) {
                testArray.push(element)
            } else {
                for (const item of testArray) {
                    if (item.component_name == element.component_name) {
                        let old_issue = item.issue_priority_count
                        let new_issue = element.issue_priority_count
                        let combine_issue = old_issue.concat(new_issue)
                        item.issue_priority_count = combine_issue
                    }

                }
            }

        }

        console.log("This my testArraytestArraytestArray", testArray)
        // loops for getting the priority count for different different component
        let lastJson = {}
        priorityCount = {}
        for (const next_data of testArray) {
            lastJson.component_name = next_data.component_name
            lastJson.Highest = 0
            lastJson.High = 0
            lastJson.Medium = 0
            lastJson.Lowest = 0
            lastJson.Low = 0
            lastJson.total = next_data.issue_priority_count.length
            // lastJson.issue_priority_count = priorityCount
            for (const next_issues of next_data.issue_priority_count) {
                if (next_issues.issue_priority == 'Highest') {
                    lastJson.Highest++
                }
                if (next_issues.issue_priority == 'High') {
                    lastJson.High++
                }
                if (next_issues.issue_priority == 'Medium') {
                    lastJson.Medium++
                }
                if (next_issues.issue_priority == 'Lowest') {
                    lastJson.Lowest++
                }
                if (next_issues.issue_priority == 'Low') {
                    lastJson.Low++
                }
            }
            finalArray.push(lastJson)
            lastJson = {}
            priorityCount = {}
        }
        if (finalArray.length) {
            totalCountJson = {}
            totalCountJson.component_name = "Total"
            totalCountJson.Highest = 0
            totalCountJson.High = 0
            totalCountJson.Medium = 0
            totalCountJson.Lowest = 0
            totalCountJson.Low = 0
            totalCountJson.total = 0
            for (const next_priority of finalArray) {
                let temp_Highest = totalCountJson.Highest
                let temp_High = totalCountJson.High
                let temp_Medium = totalCountJson.Medium
                let temp_Lowest = totalCountJson.Lowest
                let temp_Low = totalCountJson.Low
                let temp_total = totalCountJson.total
                if ('Highest' in next_priority) {
                    temp_Highest = temp_Highest + next_priority.Highest
                    totalCountJson.temp_Highest = temp_Highest
                }
                if ('High' in next_priority) {
                    temp_High = temp_High + next_priority.High
                    totalCountJson.High = temp_High
                }
                if ('Medium' in next_priority) {
                    temp_Medium = temp_Medium + next_priority.Medium
                    totalCountJson.Medium = temp_Medium
                }
                if ('Lowest' in next_priority) {
                    temp_Lowest = temp_Lowest + next_priority.Lowest
                    totalCountJson.Lowest = temp_Lowest
                }
                if ('Low' in next_priority) {
                    temp_Low = temp_Low + next_priority.Low
                    totalCountJson.Low = temp_Low
                }
                if ('total' in next_priority) {
                    temp_total = temp_total + next_priority.total
                    totalCountJson.total = temp_total
                }
                console.log("latest valuesss", totalCountJson)
            }

            // get the total of Priority
            finalArray.push(totalCountJson)
        }
        if (finalArray.length) {
            const fields = [
                { value: 'component_name', label: 'Component\\Priority Type' },
                { value: 'Highest', label: 'Highest' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
                { value: 'Lowest', label: 'Lowest' },
                { value: 'total', label: 'Total' },
            ]
            const json2csvParser = new Parser({ fields });
            csvData = json2csvParser.parse(finalArray);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=Traceability Report Detail.csv");
            res.status(200).end(csvData);
        } else {
            return response(res, 401, message.NO_TESTCASE, [], null)
        }
    },

    exportLiveStatistics: async (data, res) => {
        console.log("dtaatatatatta", data)
        let csvData
        fetchActivityLog = await reportDao.liveStatistics(data);
        if (fetchActivityLog.length) {
            for (const element of fetchActivityLog) {
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var today = new Date(element.created_at);
                element.created_at = today.toLocaleDateString("en-US", options)
            }
            const fields = [
                { value: 'created_at', label: 'Date' },
                { value: 'status', label: 'Action' },
                { value: 'detail', label: 'Test Case Name' },
                { value: 'tested_by', label: 'Action By' },
            ]
            const json2csvParser = new Parser({ fields });
            csvData = json2csvParser.parse(fetchActivityLog);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=Live Statistics.csv");
            res.status(200).end(csvData);
        } else {
            return response(res, 401, message.NO_TESTCASE, [], null)
        }

    },

    exportMostExecuted: async (data, res) => {
        console.log("dtaatatatatta", data)
        let csvData
        fetchTestcaseCount = await reportDao.fetchTestcaseCount(data);
        if (fetchTestcaseCount.length) {
            const fields = [
                { value: 'name', label: 'Name' },
                { value: 'total_no', label: 'Total' },
            ]
            const json2csvParser = new Parser({ fields });
            csvData = json2csvParser.parse(fetchTestcaseCount);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=Testcase Report.csv");
            res.status(200).end(csvData);
        } else {
            return response(res, 401, message.NO_TESTCASE, [], null)
        }

    },

}

module.exports = { reportService };