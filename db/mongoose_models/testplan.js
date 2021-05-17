//IMPORT MONGOOSE ODM 
const mongoose = require('mongoose');
const testplanSchema = mongoose.Schema({
  acct_id: String,
  project_id: Number,
  domain_id: String,
  folder_id: String,
  name: String,
  version: String,
  description: String,
  objective: String,
  owner: String,
  status: String,
  assigned_to: String,
  folder_name: String,
  label: String,
  custom_field: String,
  buildNo: String,
  weblinks: String,
  testcycles: Array,
  attachments: Array,
  is_active: Boolean,
  submit_status: Boolean,
  test_key: String,
  last_execution:Date,
  priority: String
}, {
  timestamps: true,
  versionKey: false
});


module.exports = mongoose.model('TestPlan', testplanSchema);