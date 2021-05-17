const reportService = require('../services/report.service').reportService;
const { response } = require('../utils/utility');
const message = require('../utils/message');

/**
 * This function is used to get global status by id
 * @route GET /report/list
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} testcycle_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.list = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['acct_id'] = req.query.acct_id;
        data['testcycle_id'] = req.query.testcycle_id;
        let result = await reportService.reportList(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get global status by id
 * @route GET /report/testCycleList
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} environment.query.required
 * @param {string} start_date.query.required
 * @param {string} end_date.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.testCycleList = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['acct_id'] = req.query.acct_id;
        data['environment'] = req.query.environment;
        data['start_date'] = req.query.start_date;
        data['end_date'] = req.query.end_date;
        let result = await reportService.testCycleList(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get global status by id
 * @route GET /report/detail
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} testcycle_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.detail = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['acct_id'] = req.query.acct_id;
        data['testcycle_id'] = req.query.testcycle_id;
        let result = await reportService.reportDetail(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get global status by id
 * @route GET /report/defectDistribution
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} testcycle_ids.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.defectDistribution = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['acct_id'] = req.query.acct_id;
        let testcycleIds = req.query.testcycle_ids.split(',')
        data['testcycle_id'] = testcycleIds;
        let result = await reportService.defectDistribution(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get global status by id
 * @route GET /report/testcaseReport
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} search_type.query.required
 * @param {string} count.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.testcaseReport = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['search_type'] = req.query.search_type;
        data['count'] = req.query.count;
        data['acct_id'] = req.query.user;
        let result = await reportService.testcaseReport(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};


/**
 * This function is used to get the live statistics report
 * @route GET /report/activityLogs
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} last_days.query.required
 * @param {string} count.query
 * @param {string} record_limit.query
 * @param {string} start_date.query
 * @param {string} end_date.query
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.activityLogs = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['last_days'] = req.query.last_days;
        data['count'] = req.query.count;
        data['record_limit'] = req.query.record_limit;
        data['start_date'] = req.query.start_date;
        data['end_date'] = req.query.end_date;
        data['acct_id'] = req.query.user;
        let result = await reportService.activityLogs(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get the live statistics report
 * @route GET /report/executionStatus
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} last_days.query.required
 * @param {string} start_date.query
 * @param {string} end_date.query
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.executionStatus = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['last_days'] = req.query.last_days;
        data['start_date'] = req.query.start_date;
        data['end_date'] = req.query.end_date;
        data['acct_id'] = req.query.user;
        let result = await reportService.executionStatus(data);
        return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get the live statistics report
 * @route GET /report/exportExecutionList
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} testcycle_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.exportExecutionList = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['testcycle_id'] = req.query.testcycle_id;
        data['acct_id'] = req.query.user;
        let result = await reportService.exportExecutionList(data, res);
        //return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get csv export functionality for execution status of test cycle
 * @route GET /report/exportExecutionStatus
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} testcycle_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.exportExecutionStatus = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['testcycle_id'] = req.query.testcycle_id;
        data['acct_id'] = req.query.user;
        let result = await reportService.exportExecutionStatus(data, res);
        //return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};


/**
 * This function is used to get csv export functionality for execution status of test cycle
 * @route GET /report/exportExecutionDetail
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} testcycle_id.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.exportExecutionDetail = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['testcycle_id'] = req.query.testcycle_id;
        data['acct_id'] = req.query.user;
        let result = await reportService.exportExecutionDetail(data, res);
        //return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get csv export functionality for execution status of test cycle
 * @route GET /report/exportTraceabilityReport
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} testcycle_ids.query.required
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.exportTraceabilityReport = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['acct_id'] = req.query.user;
        let testcycleIds = req.query.testcycle_ids.split(',')
        data['testcycle_id'] = testcycleIds;
        let result = await reportService.exportTraceabilityReport(data, res);
        //return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};


/**
 * This function is used to get csv export functionality for execution status of test cycle
 * @route GET /report/exportLiveStatistics
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} last_days.query.required
 * @param {string} start_date.query
 * @param {string} end_date.query
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.exportLiveStatistics = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['last_days'] = req.query.last_days;
        data['start_date'] = req.query.start_date;
        data['end_date'] = req.query.end_date;
        data['acct_id'] = req.query.user;
        let result = await reportService.exportLiveStatistics(data, res);
        //return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};

/**
 * This function is used to get csv export functionality for execution status of test cycle
 * @route GET /report/exportMostExecuted
 * @security JWT
 * @group Reports
 * @param {integer} project_id.query.required
 * @param {string} domain_id.query.required
 * @param {string} search_type.query.required
 * @param {string} count.query
 * @param {string} user.query.required
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

exports.exportMostExecuted = async (req, res) => {
    try {
        let data = {};
        data['project_id'] = parseInt(req.query.project_id);
        data['domain_id'] = req.query.domain_id;
        data['search_type'] = req.query.search_type;
        data['count'] = req.query.count;
        data['acct_id'] = req.query.user;
        let result = await reportService.exportMostExecuted(data, res);
        //return response(res, result.rescode, result.msg, result.data);
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, {}, null)
    }
};