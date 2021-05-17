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
	db_host: customize_string.INQUEST_DB_HOST,
	db_user_name: customize_string.INQUEST_DB_USERNAME,
	db_password: customize_string.INQUEST_DB_PASSWORD,
	db_name: customize_string.INQUEST_DB_NAME,
	db_dialect: customize_string.INQUEST_DB_DIALECT,
	db_pool: {
		max: customize_string.INQUEST_DB_POOL_MAX | 0,
		min: customize_string.INQUEST_DB_POOL_MIN | 0,
		acquire: customize_string.INQUEST_DB_POOL_ACQUIRE | 0,
		idle: customize_string.INQUEST_DB_POOL_IDLE | 0,
	},
	port: customize_string.INQUEST_PORT,
	base_url: customize_string.INQUEST_BASE_URL,
	env_variable: customize_string.INQUEST_NODE_ENV,
	jwt_key: customize_string.INQUEST_JWT_KEY,
	swagger_origin: customize_string.INQUEST_SWAGGER_ORIGIN,
	encrypt_key: customize_string.INQUEST_ENCRYPT_KEY,
	test_db_name: customize_string.INQUEST_TEST_DB_NAME
	// mail_host: customize_string.INQUEST_MAIL_HOST,
	// mail_username: customize_string.INQUEST_MAIL_USERNAME,
	// mail_password: customize_string.INQUEST_MAIL_PASSWORD,
	// mail_headers_key: customize_string.INQUEST_MAIL_HEADERS_KEY,
	// mail_headers_value: customize_string.MAIL_HEADERS_VALUE,
	// mail_support_value: customize_string.SUPPORT_MAILID,
}
