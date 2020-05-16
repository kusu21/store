/**
 * This module deal with consistent error messages to send to client.
 * Here we define error messages and error code.
 */

// TO IMPORT: const error = require('./error');

const errMsg = {
  INTERNAL_SERVER_ERROR: 'An internal error has occurred. Please try again!',
  DATABASE_ERROR: 'An internal error has occurred. Please try again!',
};

//
// Why I have added name property which is same as name of object?
// Answer: This is to avoid programming errors, because if we don't have
// name property we have to write 'VAL_ERR_...' as this is treated as string
// By JS it will not throw error and there is possibility to make typo there
// but now we have to write errList.VAL_ERR_.. this is JS variable name
// and JS will throw error when we make typo there.

//
// NOTE:
// - Error code must be unique for all error objects.
// - Internal error is used for debugging purpose hence don't send it to client.
//
//

const errList = {
  //
  // INTERNAL SERVER ERRORS
  // These errors occurs when some request fails either authentication or authorization
  // In this case front end should redirect to Login page
  //
  // ERR_PR_ : ERROR_PROTECT_ROUTE_
  authError: {
    ERR_PR_PERMISSION_MISMATCH: {
      code: '20001',
      message: 'You are not authorized to access this resource. Please login again.',
      internalDescription: 'Role provided in token does not matched with route accessed.',
    },
    ERR_PR_INVALID_TOKEN: {
      code: '20002',
      message: 'You are not authorized to access this resource. Please login again.',
      internalDescription: 'Verify function for token provided fails. Token may be tampered with.',
    },
    ERR_PR_NO_TOKEN: {
      code: '20003',
      message: 'You are not authorized to access this resource. Please login again.',
      internalDescription: 'No token provided while accessing protected route.',
    },
    ERR_PR_TOKEN_EXPIRED: {
      code: '20004',
      message: 'You are not authorized to access this resource. Please login again..',
      internalDescription: 'Token provided while accessing the protected route has been expired.',
    },
  },

  //
  // DATABASE ERRORS
  // These error occurred when given values does not match with the value
  // present in DB or they are missing
  // ERR_<Operation>_<Description>
  //
  dbError: {
    ERR_USER_REGISTER_DETAILS_EXISTS: {
      code: '30001',
      message: 'User is already registered with the email or mobile',
      internalDescription: 'The email ID or mobile number used for Registration is already exist in User table.',
    },
    ERR_LOGIN_USER_PASSWORD_NO_MATCH: {
      code: '30002',
      message: 'Invalid Username or Password provided !',
      internalDescription: 'Provided password does not match with hashed password present in DB.',
    },
    ERR_USER_LOGIN_USER_DOES_NOT_EXIST: {
      code: '30003',
      message: 'Invalid Username or Password provided !',
      internalDescription: 'user is not in the user table so it returns an error status',
    },
    ERR_USER_PROFILE_NOT_FOUND: {
      code: '30004',
      message: 'Please login again to continue',
      internalDescription: 'There is an error while employee tries to visit which the select query does not return any rows regarding the employee',
    },
    ERR_LOGIN_USER_UPDATE_IP_FAILURE: {
      code: '30005',
      message: errMsg.DATABASE_ERROR,
      internalDescription: 'There was an error in updating the IP of the login in the employee table',
    },
    ERR_USER_CHANGE_PASSWORD_NO_MATCH: {
      code: '30006',
      message: 'Current password does not match with the existing password.!',
      internalDescription: `Login to the manager login is a failure as the manager does not exist in DB`,
    },
    ERROR_UNCAUGHT_ERROR_ERROR: {
      code: '30007',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'Some uncaught exception error',
    },
    ERR_LOGIN_ADMIN_PASSWORD_NO_MATCH: {
      code: '30008',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'Some uncaught exception error',
    },
  },

  //
  // INTERNAL SERVER ERRORS
  // These errors occurs when some server modules throws error
  // For example hashing module or encoding module. The operation
  // done on server which does not involve DB. This also involve some external API
  // call returned error or failed.
  //
  internalError: {
    ERR_HASH_PASSWORD: {
      code: '50001',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'Hashing a password provided by user is failing.',
    },
    ERR_COMPARE_PASSWORD_AND_HASH: {
      code: '50002',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'While comparing password and its hash throw.',
    },
    ERR_USER_REGISTER_NO_DUPLICATE_DETAILS: {
      code: '50003',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: `The email ID or mobile number used for registration is 
        not present in employee table still insert failed.
        This can be because timeout or something else.`,
    },
    ERR_USER_REGISTER_NO_INSERT_NO_EXCEPTION: {
      code: '50004',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: `Insert employee details while registration
        generate no exception and affect zero rows. This error should not
        happen and can be cause by error in DB driver.`,
    },
    ERR_LOGIN_SELECT_THROW_EXCEPTION: {
      code: '50005',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: `while fetching the credentials for login
        exception generated a Database error or Internal error. This might have happened
        because of database server which might be down `,
    },
    ERR_AUTH_TOKEN_GENERATION_ERROR: {
      code: '50015',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'Token generation failed in the requested route',
    },
    ERR_GET_CONNECTION_FROM_POOL_FAILURE: {
      code: '50016',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'There may be any error in the getting the connection object from connection pool',
    },
    ERR_BEGIN_TRANSACTION_FAILURE: {
      code: '50017',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'There is an error while beginning the transaction',
    },
    ERR_COMMIT_TRANSACTION_FAILURE: {
      code: '50018',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'There is an error while committing the transaction',
    },
    ERR_SELECT_QUERY_USER_CHANGE_PASSWORD_FAILURE: {
      code: '50019',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'Select query to get the distributor details to change password failure',
    },
    ERR_USER_UPDATE_PASSWORD_NO_UPDATE_NO_EXCEPTION: {
      code: '50020',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'update password failure for user with rows = 0',
    },
    ERR_USER_CHANGE_PASSWORD_FAILURE_UPDATE_QUERY: {
      code: '50021',
      message: errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: 'update password query failure for user',
    },
    ERR_USER_CHANGE_PASSWORD_CAN_NOT_BE_DONE: {
      code: '50022',
      message: 'Please login again to continue',
      internalDescription: 'change passowrd can not be done as the user details does not match with db',
    },
    ITEM_LIST_SELECT_FAILURE: {
      code: '10000',
      message: 'error',
      internalDescription: 'there was an error in the items',
    },

    ERR_ITEM_INSERT_FAILURE: {
      code: '10001',
      message: 'error',
      internalDescription: 'there was an error in inserting the items',
    },

    ITEM_UPDATE_REGISTRATION_UNSUCCESSFUL: {
      code: '10002',
      message: 'error',
      internalDescription: 'there was an error in updating the items',
    },
    ITEM_DELETE_REGISTRATION_UNSUCCESSFUL: {
      code: '10003',
      message: 'error',
      internalDescription: 'there was an error in deleting the items',
    },
    ADMIN_LIST_REGISTRATION_UNSUCCESSFUL: {
      code: '10004',
      message: 'error',
      internalDescription: 'there was an error in list the items',
    },
    ADMIN_REGISTRATION_UNSUCCESSFUL: {
      code: '10005',
      message: 'error',
      internalDescription: 'there was an error in inserting the items',
    },
  },
};

module.exports.errMsg = errMsg;
module.exports.errList = errList;
