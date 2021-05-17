const message = require('./message');
const userDao = require('../dao/user.dao').userDetails;
let project_id = "inquest-pro-154"
let bucket_name = "syn-inquest-pro-154-bucket-dev"
let storage_destination = "https://storage.googleapis.com/"
exports.response = (res, status, message, result) => {
	let response;
	response = {
		status,
		message,
		data: result,
	}
	// if (global.origin == swagger_origin || global.origin == undefined) {
	// 	return res.json(response )
	// }
	return res.json({ 'res': response });
};


exports.checkUserAccess = async data => {
	//	console.log(checkUserAccess)
	let roleData
	let groupData
	let permissionCloudUser = await userDao.accessThroughCloudUser({ 'acct_id': data.acct_id, 'project_id': data.project_id, 'domain_id': data.domain_id });
	if (permissionCloudUser.length) {
		return { 'rescode': 200, 'msg': message.TESTCYCLE_ADDED, 'data': permissionCloudUser };
	} else {
		let permissionUserRole = await userDao.accessThroughUserRole({ 'acct_id': data.acct_id, 'project_id': data.project_id, 'domain_id': data.domain_id });
		if (permissionUserRole.length) {
			roleData = permissionUserRole
		} else {
			roleData = []
		}
		let permissionUserGroup = await userDao.accessThroughUserGroup({ 'acct_id': data.acct_id, 'project_id': data.project_id, 'domain_id': data.domain_id });
		if (permissionUserGroup.length) {
			console.log("here is the correct value for it***********", permissionUserGroup)
			groupData = permissionUserGroup
		} else {
			groupData = []
		}
		let response_array = roleData.concat(groupData)
		const result2 = [];
		if (response_array.length) {
			let new_data = {};
			let allow_testcase_create_1 = 0
			let allow_testcase_read_1 = 0
			let allow_testcase_edit_1 = 0
			let allow_testcase_delete_1 = 0
			let allow_testcase_archive_1 = 0
			let allow_testcase_versions_1 = 0
			let allow_testcase_folders_1 = 0
			let allow_testplan_create_1 = 0
			let allow_testplan_edit_1 = 0
			let allow_testplan_view_1 = 0
			let allow_testplan_delete_1 = 0
			let allow_testplan_folders_1 = 0
			let allow_testcycle_create_1 = 0
			let allow_testcycle_edit_1 = 0
			let allow_testcycle_view_1 = 0
			let allow_testcycle_execute_1 = 0
			let allow_testcycle_delete_1 = 0
			let allow_testcycle_folders_1 = 0
			let allow_reports_create_1 = 0
			let allow_configuration_1 = 0
			let allow_testcase_execute_1 = 0
			let testcase_lock_1 = 0
			for (let i = 0; i < response_array.length; i++) {
				allow_testcase_create_1 = (response_array[i].allow_testcase_create || allow_testcase_create_1)
				if (allow_testcase_create_1 == 1) {
					new_data['allow_testcase_create'] = 1
				} else {
					new_data['allow_testcase_create'] = 0
				}
				allow_testcase_read_1 = (response_array[i].allow_testcase_read || allow_testcase_read_1)
				if (allow_testcase_read_1 == 1) {
					new_data['allow_testcase_read'] = 1
				} else {
					new_data['allow_testcase_read'] = 0
				}
				allow_testcase_edit_1 = (response_array[i].allow_testcase_edit || allow_testcase_edit_1)
				if (allow_testcase_edit_1 == 1) {
					new_data['allow_testcase_edit'] = 1
				} else {
					new_data['allow_testcase_edit'] = 0
				}
				allow_testcase_delete_1 = (response_array[i].allow_testcase_delete || allow_testcase_delete_1)
				if (allow_testcase_delete_1 == 1) {
					new_data['allow_testcase_delete'] = 1
				} else {
					new_data['allow_testcase_delete'] = 0
				}
				allow_testcase_archive_1 = (response_array[i].allow_testcase_archive || allow_testcase_archive_1)
				if (allow_testcase_archive_1 == 1) {
					new_data['allow_testcase_archive'] = 1
				} else {
					new_data['allow_testcase_archive'] = 0
				}
				allow_testcase_versions_1 = (response_array[i].allow_testcase_versions || allow_testcase_versions_1)
				if (allow_testcase_versions_1 == 1) {
					new_data['allow_testcase_versions'] = 1
				} else {
					new_data['allow_testcase_versions'] = 0
				}
				allow_testcase_folders_1 = (response_array[i].allow_testcase_folders || allow_testcase_folders_1)
				if (allow_testcase_folders_1 == 1) {
					new_data['allow_testcase_folders'] = 1
				} else {
					new_data['allow_testcase_folders'] = 0
				}
				allow_testplan_create_1 = (response_array[i].allow_testplan_create || allow_testplan_create_1)
				if (allow_testplan_create_1 == 1) {
					new_data['allow_testplan_create'] = 1
				} else {
					new_data['allow_testplan_create'] = 0
				}
				allow_testplan_edit_1 = (response_array[i].allow_testplan_edit || allow_testplan_edit_1)
				if (allow_testplan_edit_1 == 1) {
					new_data['allow_testplan_edit'] = 1
				} else {
					new_data['allow_testplan_edit'] = 0
				}
				allow_testplan_view_1 = (response_array[i].allow_testplan_view || allow_testplan_view_1)
				if (allow_testplan_view_1 == 1) {
					new_data['allow_testplan_view'] = 1
				} else {
					new_data['allow_testplan_view'] = 0
				}
				allow_testplan_delete_1 = (response_array[i].allow_testplan_delete || allow_testplan_delete_1)
				if (allow_testplan_delete_1 == 1) {
					new_data['allow_testplan_delete'] = 1
				} else {
					new_data['allow_testplan_delete'] = 0
				}
				allow_testplan_folders_1 = (response_array[i].allow_testplan_folders || allow_testplan_folders_1)
				if (allow_testplan_folders_1 == 1) {
					new_data['allow_testplan_folders'] = 1
				} else {
					new_data['allow_testplan_folders'] = 0
				}
				allow_testcycle_create_1 = (response_array[i].allow_testcycle_create || allow_testcycle_create_1)
				if (allow_testcycle_create_1 == 1) {
					new_data['allow_testcycle_create'] = 1
				} else {
					new_data['allow_testcycle_create'] = 0
				}
				allow_testcycle_edit_1 = (response_array[i].allow_testcycle_edit || allow_testcycle_edit_1)
				if (allow_testcycle_edit_1 == 1) {
					new_data['allow_testcycle_edit'] = 1
				} else {
					new_data['allow_testcycle_edit'] = 0
				}
				allow_testcycle_view_1 = (response_array[i].allow_testcycle_view || allow_testcycle_view_1)
				if (allow_testcycle_view_1 == 1) {
					new_data['allow_testcycle_view'] = 1
				} else {
					new_data['allow_testcycle_view'] = 0
				}
				allow_testcycle_execute_1 = (response_array[i].allow_testcycle_execute || allow_testcycle_execute_1)
				if (allow_testcycle_execute_1 == 1) {
					new_data['allow_testcycle_execute'] = 1
				} else {
					new_data['allow_testcycle_execute'] = 0
				}
				allow_testcycle_delete_1 = (response_array[i].allow_testcycle_delete || allow_testcycle_delete_1)
				if (allow_testcycle_delete_1 == 1) {
					new_data['allow_testcycle_delete'] = 1
				} else {
					new_data['allow_testcycle_delete'] = 0
				}
				allow_testcycle_folders_1 = (response_array[i].allow_testcycle_folders || allow_testcycle_folders_1)
				if (allow_testcycle_folders_1 == 1) {
					new_data['allow_testcycle_folders'] = 1
				} else {
					new_data['allow_testcycle_folders'] = 0
				}
				allow_reports_create_1 = (response_array[i].allow_reports_create || allow_reports_create_1)
				if (allow_reports_create_1 == 1) {
					new_data['allow_reports_create'] = 1
				} else {
					new_data['allow_reports_create'] = 0
				}
				allow_configuration_1 = (response_array[i].allow_configuration || allow_configuration_1)
				if (allow_configuration_1 == 1) {
					new_data['allow_configuration'] = 1
				} else {
					new_data['allow_configuration'] = 0
				}
				testcase_lock_1 = (response_array[i].testcase_lock || testcase_lock_1)
				if (testcase_lock_1 == 1) {
					new_data['testcase_lock'] = 1
				} else {
					new_data['testcase_lock'] = 0
				}
				allow_testcase_execute_1 = (response_array[i].allow_testcase_execute || allow_testcase_execute_1)
				if (allow_testcase_execute_1 == 1) {
					new_data['allow_testcase_execute'] = 1
				} else {
					new_data['allow_testcase_execute'] = 0
				}
			}
			result2.push(new_data);
			console.log("finalResult=====>", result2);
			return { 'rescode': 200, 'msg': message.TESTCYCLE_ADDED, 'data': result2 };
		} else {
			return { 'rescode': 401, 'msg': message.INSUFFICIENT_ACCESS, 'data': null };
		}
	}
};


exports.compareData = (object1, object2) => {
	let keys1 = Object.keys(object1);
	let keys2 = Object.keys(object2);
	let arrayObject = [];
	for (key of keys2) {
		if (object2[key] != object1[key]) {
			let res = {};
			res[key] = object2[key];
			arrayObject.push(res);
		}
	}
	return arrayObject;
};

// // Image Upload Function
// exports.pdf_upload = (base64Image, file_name) => {
// 	console.log("hhello upload function")

// 	console.log(base64Image)
// 	console.log(file_name)
// 	const stream = require('stream')
// 	const bufferStream = new stream.PassThrough()
// 	bufferStream.end(Buffer.from(base64Image, 'base64'))

// 	const { Storage } = require('@google-cloud/storage')
// 	const storage = new Storage({
// 		projectId: project_id,
// 		keyFilename: './GCP_credentials.json',
// 	})

// 	const bucket = storage.bucket(bucket_name)
// 	const file = bucket.file(file_name)

// 	bufferStream
// 		.pipe(
// 			file.createWriteStream({
// 				metadata: {
// 					contentType: 'application/pdf',
// 					cacheControl: 'private, max-age=5',
// 				},
// 				public: false,
// 			})
// 		)
// 		.on('error', err => {
// 			console.log(`err : ${err}`)
// 			return err
// 		})
// 		.on('finish', () => {
// 			const url = `${storage_destination + bucket_name}/${file_name}`
// 			return url
// 		})
// }

//pdf Upload Function
exports.pdf_upload = (base64Image, file_name, file_type,regionData, callback) => {
	console.log("data is coming")
	var stream = require('stream');
	var bufferStream = new stream.PassThrough();
	bufferStream.end(Buffer.from(base64Image, 'base64'));

	const { Storage } = require('@google-cloud/storage');
	const storage = new Storage({
		projectId: regionData[0].gcp_project_id,
		keyFilename: regionData[0].gcp_file_name
	});

	var bucket = storage.bucket(regionData[0].bucket_name);
	var file = bucket.file(file_name);

	bufferStream.pipe(file.createWriteStream({
		metadata: {
			contentType: file_type,
			cacheControl: 'private, max-age=5',
		},
		public: false
	}))
		.on("error", (err) => {
			console.log("err : " + err);
			return callback(err, null);
		})
		.on('finish', () => {
			var url = regionData[0].storage_destination + regionData[0].bucket_name + "/" + file_name;
			console.log("pppppppppppppppppppppppppppppp", url)
			return callback(null, url);
		});
};

//Signed URL Function
exports.get_signedUrl = (file_name, callback) => {
	const bucketName = bucket_name;
	const { Storage } = require('@google-cloud/storage');
	const storage = new Storage({
		projectId: project_id,
		keyFilename: './GCP_credentials.json'
	});

	// These options will allow temporary read access to the file
	const options = {
		action: 'read',
		expires: Date.now() + 1000 * 60 * 60 // one hour
	};

	// Get a signed URL for the file

	storage
		.bucket(bucketName)
		.file(file_name)
		.getSignedUrl(options)
		.then(results => {
			return callback(null, results[0]);
		})
		.catch(err => {
			console.error('ERROR:', err);
			return callback(err);
		});
};

exports.getFormateDateForEdit = (date) => {
	let test_date = new Date(date);
	let formated_date = test_date.getFullYear() + "-" + ('0' + (test_date.getMonth() + 1)).slice(-2) + "-" + getFormattedDate(test_date.getDate());
	return formated_date;
};

exports.isValidDate = (dateString) => {
	var regEx = /^((((19|[2-9]\d)\d{2})[\/\.-](0[13578]|1[02])[\/\.-](0[1-9]|[12]\d|3[01])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((19|[2-9]\d)\d{2})[\/\.-](0[13456789]|1[012])[\/\.-](0[1-9]|[12]\d|30)\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((19|[2-9]\d)\d{2})[\/\.-](02)[\/\.-](0[1-9]|1\d|2[0-8])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))[\/\.-](02)[\/\.-](29)\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])))$/g;
	if (!dateString.match(regEx)) return false;  // Invalid format
	var d = new Date(dateString);
	var dNum = d.getTime();
	if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
	return d.toISOString().slice(0, 10) === dateString;
};

exports.getDateArray = (start_date, end_date) => {
	let
		arr = new Array(),
		dt = start_date,
		ent = end_date;
	while (dt <= ent) {
		let new_date = new Date(dt)
		let formate_date = formateDateFun(new_date)
		arr.push(formate_date);
		dt.setDate(dt.getDate() + 1);
	}
	return arr;
}

//object delete Function
exports.image_delete = (file_name,regionData, callback) => {
	const { Storage } = require('@google-cloud/storage');
	const storage = new Storage({
		projectId: regionData[0].gcp_project_id,
		keyFilename: regionData[0].gcp_file_name
	});
	var bucket = storage.bucket(regionData[0].bucket_name);
	var files = bucket.file(file_name);

	async function deleteFile() {
		// Deletes the file from the bucket
		await files.delete();

		console.log(`gs://${regionData[0].bucket_name}/${file_name} deleted.`);
		return callback(null, 'Success')
	}
	deleteFile().catch(err => {
		console.error('ERROR:', err);
		return callback(err);
	});
};

function getFormattedDate(date) {
	if (date <= 9) {
		return "0" + date;
	} else {
		return date;
	}
}

function formateDateFun(date) {
	let test_date = new Date(date);
	let formated_date = test_date.getFullYear() + "-" + ('0' + (test_date.getMonth() + 1)).slice(-2) + "-" + getFormattedDate(test_date.getDate());
	return formated_date;
}


//Signed URL Function
exports.gcp_signedUrl = (file_name,regionData, callback) => {
	const bucketName = regionData[0].bucket_name;
	const { Storage } = require('@google-cloud/storage');
	const storage = new Storage({
		projectId:  regionData[0].gcp_project_id,
		keyFilename: regionData[0].gcp_file_name
	});

	// These options will allow temporary read access to the file
	const options = {
		action: 'read',
		expires: Date.now() + 1000 * 60 * 60 // one hour
	};

	// Get a signed URL for the file

	storage
		.bucket(bucketName)
		.file(file_name)
		.getSignedUrl(options)
		.then(results => {
			return callback(null, results[0]);
		})
		.catch(err => {
			console.error('ERROR:', err);
			return callback(err);
		});
};