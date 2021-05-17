//IMPORT MONGOOSE ODM 
const mongoose = require('mongoose');
const folderSchema = mongoose.Schema({
  acct_id: String,
  project_id: Number,
  parent_folder_id: String,
  folder_name: String,
  folder_type: String,
  folder_category: String,
  document_count: Number
}, {
  timestamps: true,
  versionKey: false
});


module.exports = mongoose.model('Folder', folderSchema);