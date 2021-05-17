const mongoose = require('mongoose');
const dbConfig = require('./config/config_detail');

//GLOBAL MONGOOSE PROMISE
mongoose.Promise = global.Promise;

const optionsTestDB = {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    poolSize: dbConfig.db_pool.max || 5, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    connectTimeoutMS: dbConfig.db_connectionTimeOut, // Give up initial connection after 10 seconds
    socketTimeoutMS: dbConfig.db_socketTimeoutMS, // Close sockets after 45 seconds of inactivity
    useUnifiedTopology: true
};

//MONGOOSE UNIT TESTING TEST DATABASE CONNECTION
mongoose.connect(dbConfig.test_utdb_url, optionsTestDB).then(() => {
    console.log("Test MongoDB connection is Connected :"+ dbConfig.test_utdb_url);
}).catch(err => {
    console.log('Test MongoDB connection is Down.Error is...', err);
});

module.exports = mongoose;