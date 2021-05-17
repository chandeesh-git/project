/* eslint-disable no-bitwise */
const dotenv = require('dotenv');

dotenv.config();

const vcap_services = process.env.VCAP_SERVICES;
let customize_string = process.env;

if (vcap_services) {
	const dataParse = JSON.parse(vcap_services);
	console.log(dataParse['user-provided']);
	customize_string = dataParse['user-provided'][0].credentials
}

module.exports = {
	db_url: 'mongodb+srv://inquest-pro-154-dev-mongo-db-user:xOEEd4Cve4NTIgJ7@development.mwhv7.mongodb.net/inquest_pro_154_dev_mongo_db?retryWrites=true&w=majority',
	db_pool: customize_string.INQUEST_MONGO_DB_POOL,
	port: customize_string.INQUEST_PORT,
	base_url: customize_string.INQUEST_BASE_URL,
	env_variable: customize_string.INQUEST_NODE_ENV,
	jwt_key: customize_string.INQUEST_JWT_KEY,
	swagger_origin: customize_string.INQUEST_SWAGGER_ORIGIN,
	encrypt_key: customize_string.INQUEST_ENCRYPT_KEY,
	db_connectionTimeOut: customize_string.INQUEST_MONGO_CONNECTION_TIMEOUT,
	db_socketTimeoutMS: customize_string.INQUEST_MONGO_SOCKET_TIMEOUT_MS,
	test_utdb_url:customize_string.INQUEST_TEST_MONGO_UT_DB_URL
	// mail_host: customize_string.INQUEST_MAIL_HOST,
	// mail_username: customize_string.INQUEST_MAIL_USERNAME,
	// mail_password: customize_string.INQUEST_MAIL_PASSWORD,
	// mail_headers_key: customize_string.INQUEST_MAIL_HEADERS_KEY,
	// mail_headers_value: customize_string.MAIL_HEADERS_VALUE,
	// mail_support_value: customize_string.SUPPORT_MAILID,
}
