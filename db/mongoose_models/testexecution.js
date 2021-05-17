//IMPORT MONGOOSE ODM 
const mongoose = require('mongoose');
const testexecutionSchema = mongoose.Schema({
  acct_id: String,
  project_id: Number,
  domain_id: String,
  folder_id: String,
  name: String,
  test_key: String,
  version: String,
  objective: String,
  description: String,
  precondition: String,
  owner: String, 
  status: String,
  priority: String,
  component: String,
  estimated_time: String,
  folder_name: String,
  label: String,
  testscript_type: String,
  testscript: String,
  test_data: String,
  parameters: String,
  weblinks: String,
  issues: Array,
  testcycles: String,
  attachments: Array,
  customFields:String,
  is_active: Boolean,
  execution_status: String,
  recorded_time: String,
  testscript_status: String,
  assigned_to: String,
  executed_by: String,
  testcycle_id: String,
  testcase_id: String,
  environment: String,

  execution_attachment: Array,
  execution_issues: Array,
  execution_comment: String,
  activity_log: String
}, {
  timestamps: true,
  versionKey: false
});


module.exports = mongoose.model('TestExecution', testexecutionSchema);