//IMPORT MONGOOSE ODM 
const mongoose = require('mongoose');
const testcaseSchema = mongoose.Schema({
  acct_id: String,
  project_id: Number,
  domain_id: String,
  folder_id: String,
  name: String,
  version: String,
  description: String,
  precondition: String,
  owner: String, 
  status: String,
  priority: String,
  component: String,
  assigned_to: String,
  estimated_time: String,
  folder_name: String,
  label: String,
  buildNo: Number,
  testscript_type: String,
  testscript: String,
  test_data: String,
  parameters: String,
  weblinks: String,
  issues: Array,
  testcycles: String,
  objective: String,
  attachments: Array,
  is_active: Boolean,
  lock: Boolean,
  customFields:String,
  submit_status: Boolean,   
}, {
  timestamps: true,
  versionKey: false
});


module.exports = mongoose.model('TestCase', testcaseSchema);