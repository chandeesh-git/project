var sql_conn = require('../../db/sequelize_models');
const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
var makeConnection = require('../../db/mongoose_models/index');
const mongoose = require('mongoose');
const dbConfig = require('../../db/mongoose_models/config/config_detail');

//GLOBAL MONGOOSE PROMISE
mongoose.Promise = global.Promise;

async function regionsSetup(data) {
    let result;
    const sql_statement = `
    SELECT PJ.domain_id, PJ.project_id,regions_name,mongo_db_url,bucket_name,storage_destination,gcp_project_id,gcp_file_name  FROM project as PJ 
    left join app_credentials as APC on PJ.region_id=APC.id 
    where PJ.domain_id="${data.domain_id}"  and PJ.project_id=${data.project_id}`
    result = await sql_conn.sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
    console.log("result==>", result)
    
    //OPTIONS SET FOR CONNECTION
    const options = {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
        poolSize: dbConfig.db_pool.max || 5, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        connectTimeoutMS: dbConfig.db_connectionTimeOut, // Give up initial connection after 10 seconds
        socketTimeoutMS: dbConfig.db_socketTimeoutMS, // Close sockets after 45 seconds of inactivity
        useUnifiedTopology: true
    };
    
        //MONGOOSE DATABASE CONNECTION
        mongoose.connect(result[0].mongo_db_url, options).then(() => {
            console.log("MongoDB connection is Connected :" + result[0].mongo_db_url);
        }).catch(err => {
            console.log('MongoDB connection is Down.Error is...', err);
        }); 
        return result
}

module.exports = regionsSetup;
