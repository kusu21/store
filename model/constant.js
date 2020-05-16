/**
 * Here we define constants used in our web application at backend only.
 * These constants are not needed in front end.
 */

// TO IMPORT: const constant = require('./constant');

/**
 * List of Error Types we have
 */
const errType = {
  VALIDATION_ERROR: 0,
  INTERNAL_ERROR: 1,
  DB_ERROR: 2,
  AUTH_ERROR: 3, // Frontend should redirect to Login page
};

/**
 * token name
 */
const TOKEN_NAME = 'x-id-token';

/**
 * Responses for the password validatory
 */
const passwordValidatorResponses = {
  EMPLOYEE_LOGIN_PWD_RESPONSE: 'Please enter a valid password',
  EMPLOYEE_REGISTER_PASSWORD_RESPONSE: `Password should contain uppercase character, lowercase character,
  number and symbol. It must be at least 8 characters long. It should not contain any spaces in it!`,
  COMPANY_DISTRIBUTOR_LOGIN_PWD_RESPONSE: 'Please enter a valid password',
  COMPANY_DISTRIBUTOR_REGISTER_PASSWORD_RESPONSE: `Password should contain at least 1 uppercase,
  1 lowercase, 1 symbol and 1 number. It must be at least 8 characters long. It should not contain any spaces in it!`,
};

/**
 * EMail verification response string
 */
const emailVerificationRespString = {
  SUCCESS: 'Email verification sent, Please check your email.!',
  FAILURE: 'Email verification failed, please proceed with email verification manually',
};

/**
 * Email subjects
 */
const emailSubject = {
  RESET_PASSWORD: 'Reset password link for TMS',
  EMAIL_VERIFICATION: 'Email verification for TMS',
  ENQUIRY_FOLLOWUP: 'FollowUps Pending for today',
};

// ============================================
// For TESTING ONLY
// ============================================
/**
 * Time taken by beforeAll function for its setup including DB setup
 * and some other work.
 */
const testTimeout = {
  beforeAll: 10000,
  afterAll: 10000,
};

const employeeImageStorageBaseLocation = {
  DEFAULT: '.\\public\\img\\profile\\emp\\',
  PATH: '/img/profile/emp/',
};

module.exports.errType = errType;
module.exports.TOKEN_NAME = TOKEN_NAME;
module.exports.passwordValidatorResponses = passwordValidatorResponses;
module.exports.emailVerificationRespString = emailVerificationRespString;
module.exports.testTimeout = testTimeout;
module.exports.employeeImageStorageBaseLocation = employeeImageStorageBaseLocation;
