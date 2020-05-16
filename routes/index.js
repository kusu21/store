const express = require('express');
const dt = require('date-and-time');
const auth = require('../model/auth');
const hash = require('../model/auth');
const pool = require('../database/db');
const uploadFile = require('../model/multer');
const mailer = require('../model/mailer');
const vs = require('../model/validator-sanitizer');
const responseGenerator = require('../model/response-generator');
const constant = require('../model/constant');
const error = require('../model/error');
const hf = require('../model/helper-function');
const notification = require('../model/notification');

const router = express.Router();

/**
 * @api {get} /test/server/status
 * @apiName Check Server Status
 * @apiGroup Test ROUTE
 *
 * @apiSuccess {String} Server is Running Properly.
 */
router.get('/server/status', async (req, res) => res.status(200).send('Server is running properly'));

/**
 * This route is used to test some custom code
 */
router.get('/custom', async (req, res) => {
  console.log(dt.isValid('2012-04-32', 'YYYY-MM-DD'));
  res.status(200).send('Server is running properly');
});

/**
 * This route is used to test single image upload functionality
 */
router.post('/single/img', async (req, res) => {
  try {
    await uploadFile.singleImage(req, res, 'img');
    console.log(req.file);
    res.status(200).send('Image uploaded successfully.');
  } catch (err) {
    if (err.code === error.errList.internalError.ERR_EMP_IMAGE_UPLOAD_WRONG_TYPE.code) {
      console.log(err);
      res.status(200).send('Wrong type of file uploaded');
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      console.log(err);
      res.status(200).send('File size Exceeded');
    }
  }
});

/**
 * This route is used to test multiple image upload functionality
 */
router.post('/multiple/img', async (req, res) => {
  try {
    await uploadFile.multipleImages(req, res, 'img', 2);
    console.log(req.files);
    res.status(200).send('Image uploaded successfully.');
  } catch (err) {
    if (err.code === error.errList.internalError.ERR_EMP_IMAGE_UPLOAD_WRONG_TYPE.code) {
      console.log(err);
      res.status(200).send('Wrong type of file uploaded');
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      console.log(err);
      res.status(200).send('File size Exceeded');
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      console.log(err);
      res.status(200).send('More than expected number of files uploaded');
    }
  }
});

/**
 * This route is used by developer for quick testing of validations etc.
 */
router.post('/validator', [vs.isValidStrLenWithTrim('body', 'a', 0, 0, 'Max length allowed is 5 characters.')], async (req, res) => {
  const errors = vs.getValidationResult(req);
  if (!errors.isEmpty()) {
    const fieldsToValidate = ['a'];
    // This is if else so we don't need return
    return res.status(422).send(responseGenerator.validationError(errors.mapped(), fieldsToValidate));
  }
  return res.send('Success');
});

/**
 * This route is used as an example on how to validate array of values.
 * For example if we send array of subjects that needs to be added for a course
 * then we don't know up front how many subjects will be there? Hence we need a
 * way to check any number of subjects in request.
 *
 * Suppose frontend is sending JSON for array as (Postman Example):
 * {
 * "arr": [{"val":"aaaa"},{"val":"aaaa55"}]
 * }
 *
 * Here we are using wildcards: https://express-validator.github.io/docs/wildcards.html
 *
 */
router.post('/array/validator', [vs.isValidStrLenWithTrim('body', 'arr.*.val', 2, 5, 'Max length allowed is 5 characters.')], async (req, res) => {
  const errors = vs.getValidationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.mapped());
    const fieldsToValidate = [];
    // Add all values of the array to validate so that we can send the proper values
    req.body.arr.forEach((element, index) => {
      fieldsToValidate.push(`arr[${index}].val`);
    });
    // console.log(fieldsToValidate);
    // This is if else so we don't need return
    return res.status(422).send(responseGenerator.validationError(errors.mapped(), fieldsToValidate));
  }
  return res.send('Success');
});

/**
 * Date validator for FSJ date format
 */
router.post('/validfsjdate', [vs.isValidDBDate('body', 'date')], async (req, res) => {
  const errors = vs.getValidationResult(req);
  if (!errors.isEmpty()) {
    const fieldsToValidate = ['date'];
    // This is if else so we don't need return
    return res.status(422).send(responseGenerator.validationError(errors.mapped(), fieldsToValidate));
  }
  return res.send('Success');
});

/**
 * Date validator for FSJ time format
 */
router.post('/validfsjtime', [vs.isValidDBTime('body', 'time')], async (req, res) => {
  const errors = vs.getValidationResult(req);
  if (!errors.isEmpty()) {
    const fieldsToValidate = ['time'];
    // This is if else so we don't need return
    return res.status(422).send(responseGenerator.validationError(errors.mapped(), fieldsToValidate));
  }
  return res.send('Success');
});

/**
 * Route to add notification
 *
 * @param ui_message: message for the notification
 */

router.post(
  '/add/notification',
  auth.protectTokenVerify,
  [vs.isValidStrLenWithTrim('body', 'ui_message', 3, 255, 'Please enter a valid notification message in between 3 to 255 characters')],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['ui_message'];
      // This is if else so we don't need return
      return res.status(422).send(responseGenerator.validationError(errors.mapped(), fieldsToValidate));
    }
    try {
      const rows = await notification.addEmployeeNotification(
        pool,
        1,
        constant.empNotificationType.ENQUIRY,
        constant.notificationStatus.NEW,
        req.body.ui_message,
        1,
        null,
      );
      console.log(rows);
      return res.send('Notification added successfully');
    } catch (e) {
      console.log(e);
    }
  },
);

// /**
//  * @name /reset_password/request
//  *
//  * @param ui_username Email or mobile of the ****
//  */
// router.post('/reset_password/request', [vs.isEmailOrMobile('body', 'ui_username')], async (req, res) => {
//   const errors = vs.getValidationResult(req);
//   if (!errors.isEmpty()) {
//     const fieldsToValidate = ['ui_username'];
//     // This is if else so we don't need return
//     return res.status(422).send(responseGenerator.validationError(errors.mapped(), fieldsToValidate));
//   }
//   try {
//     const [rows] = await pool.execute(
//       `SELECT cust_id, cust_name, cust_email
//               FROM customer WHERE cust_email = ? OR cust_mobile = ?;`,
//       [req.body.ui_username, req.body.ui_username],
//     );
//     console.log(rows);
//     if (rows.length === 1) {
//       console.log(rows);
//       const token = auth.genAuthTokenResetPassword({
//         id: rows[0].cust_id,
//         username: rows[0].cust_name,
//         role: constant.custRoles.CUSTOMER,
//       });
//       const beResetPasswordLink = `http://test.com/rp?tkn=${token}`;
//       console.log(beResetPasswordLink);
//       const beMessage = `
//         <h3>Reset Password link<h3>
//         <ul>
//           <li>Please use the below link to reset your password</li>
//           <li>${beResetPasswordLink}</li>
//           <li>Note that the above link expires in 30 minutes</li>
//         </ul>
//         `;
//       // mail options which describe about the from to subject
//       // and message to be sent
//       const beMailOptions = {
//         from: config.get('nodeMailerConfig.from'),
//         // to: rows[0].cust_email,
//         to: 'sivakusi12@gmail.com',
//         subject: 'RESET PASSWORD LINK FOR CUSTOMER ACCOUNT',
//         html: beMessage,
//       };
//       // this sends the message
//       mailer.sendMail(beMailOptions, (error, info) => {
//         if (error) {
//           console.log(error);
//           return res
//             .status(500)
//             .send(responseGenerator.errorResponse('Email Delivery Failed', '', 'Message not delivered', '', ''));
//         }
//         return res
//           .status(200)
//           .send(
//             responseGenerator.success('Reset Password Request', 'Reset Password link sent for the registered email', [
//               info.response,
//             ]),
//           );
//       });
//     }
//     // res.send('Hello');
//   } catch (e) {
//     console.log(e);
//     res.send('Error');
//   }
// });

// /**
//  * @name /reset_password/request?tkn=?
//  *
//  * @param ui_new_password new password of the ****
//  * @param tkn token for reset password
//  */
// router.put(
//   '/reset_password/request',
//   auth.protectTestResetPasswordRoute,
//   [vs.isCompanyEmployeePassword('body', 'ui_new_password')],
//   async (req, res) => {
//     const errors = vs.getValidationResult(req);
//     if (!errors.isEmpty()) {
//       const fieldsToValidate = ['ui_new_password'];
//       // This is if else so we don't need return
//       return res.status(422).send(responseGenerator.validationError(errors.mapped(), fieldsToValidate));
//     }
//     const beUserID = req.user.id;
//     const beNewPassword = req.body.ui_new_password;
//     let beHashedPassword;
//     try {
//       // NOTE We need to await this function as it is async
//       beHashedPassword = await hash.hashPassword(beNewPassword);
//     } catch (e) {
//       // Unable to hash Password
//       // console.log(e);
//       const responseUnableToHash = responseGenerator.internalError(error.errList.internalError.ERR_HASH_PASSWORD);
//       return res.status(500).send(responseUnableToHash);
//     }
//     try {
//       const [rows] = await pool.execute(
//         `UPDATE customer
//           SET cust_password = ?
//           WHERE cust_id = ?`,
//         [beHashedPassword, beUserID],
//       );
//       // Change password successfully
//       if (rows.affectedRows) {
//         const description = 'Password have been updated Successfully for the user';
//         return res.status(200).send(responseGenerator.success('Update password', description, []));
//       }
//       // Unsuccessfully update with no exception
//       const responseUnableToUpdateWithoutException = responseGenerator.internalError(
//         error.errList.internalError.ERR_CUSTOMER_UPDATE_PASSWORD_NO_UPDATE_NO_EXCEPTION,
//       );
//       return res.status(400).send(responseUnableToUpdateWithoutException);
//     } catch (e) {
//       const responseUnableToUpdate = responseGenerator.internalError(
//         error.errList.internalError.ERR_CUSTOMER_CHANGE_PASSWORD_FAILURE_UPDATE_QUERY,
//       );
//       return res.status(400).send(responseUnableToUpdate);
//     }
//   },
// );

// // Transaction Helper
// router.post('/transaction', async (req, res) => {
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();
//     // await conn.query('START'); OR
//     // await conn.query('BEGIN TRANSACTION'); OR
//     const [rows] = await conn.execute('INSERT INTO temp_test (a, b) VALUES (?, ?);', ['2', 'Insert With Transaction.']);
//     // This will fail and rollback happens
//     const [rows1] = await conn.execute('INSERT INTO temp_test_table (a, b) VALUES (?, ?);', [
//       '2',
//       'Insert With Transaction.',
//     ]);
//     await conn.release();
//     // await conn.query('ROLLBACK'); OR
//     res.send('Completed');
//   } catch (e) {
//     console.log(e);
//     await conn.rollback();
//     await conn.release();
//     res.send('Error');
//   }
// });

module.exports = router;
