//IMPORT MONGOOSE ODM 
const mongoose = require('mongoose');
const testcycleSchema = mongoose.Schema({
  acct_id: String,
  project_id: Number,
  domain_id: String,
  test_key: String,
  last_execution: Date,
  folder_id: String,
  name: String,
  version: String,
  description: String,
  status: String,
  owner: String,
  environment: String,
  assigned_to: String,
  planned_start_date: Date,
  planned_end_date: Date,
  folder_name: String,
  weblinks: String,
  issues: Array,
  testplans: Array,
  testcases: Array,
  is_active: Boolean,
  submit_status: Boolean,
  customFields:String,
}, {
  timestamps: true,
  versionKey: false
});


module.exports = mongoose.model('TestCycle', testcycleSchema);