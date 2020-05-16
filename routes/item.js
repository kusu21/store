const express = require('express');
const error = require('../model/error');
const pool = require('../database/db');
const rG = require('../model/response-generator');
const constant = require('../model/constant');
const router = express.Router();
const vs = require('../model/validator-sanitizer');
const auth = require('../model/auth');

router.get('/list', async (req, res) => {
  try {
    const [item] = await pool.execute('SELECT item_id AS id,item_name AS name,item_price AS price,item_quantity AS quantity FROM item', []);
    return res.status(200).send(rG.success('item list', 'items retrienved successfully', item));
  } catch (e) {
    return res.status(500).send(rG.internalError(error.errList.internalError.ITEM_LIST_SELECT_FAILURE));
  }
});

router.post(
  '/add',
  [
    vs.isValidStrLenWithTrim('body', 'item_name', 3, 50, 'please enter a name between 3 to 50 characters'),
    vs.isAmount('body', 'item_price', 'please provide valid price'),
    vs.isNumeric('body', 'item_quantity', 'please provide valid quantity'),
  ],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['item_name', 'item_price', 'item_quantity'];
      return res.status(422).send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    try {
      const [rows] = await pool.execute('INSERT INTO item(item_name,item_price,item_quantity) VALUES (?,?,?)', [
        req.body.item_name,
        req.body.item_price,
        req.body.item_quantity,
      ]);
      console.log(rows);
      if (rows.affectedRows === 1) {
        return res.status(200).send(rG.success('item add', 'item added successfully', []));
      }
      if (itemInsert.affectedRows !== 1) {
        return res.status(500).send(rg.internalError(error.errList.internalError.ERR_ITEM_INSERT_NO_INSERT_NO_EXCEPTION));
      }

      return res.status(200).send(
        responseGenerator.success('Item addition', 'Item added successfully', [
          {
            id: itemInsert.insertId,
            name: req.body.item_name,
            price: req.body.item_price,
            quantity: req.body.item_quantity,
          },
        ]),
      );
    } catch (e) {
      console.log(e);
      return res.status(500).send(rG.internalError(error.errList.internalError.ERR_ITEM_INSERT_FAILURE));
    }
  },
);

router.put(
  '/update/:item_id',
  [
    vs.isValidStrLenWithTrim('body', 'item_name', 3, 50, 'please enter a name between 3 to 50 characters'),
    vs.isAmount('body', 'item_price', 'please provide valid price'),
    vs.isNumeric('body', 'item_quantity', 'please provide valid quantity'),
    vs.isNumeric('params', 'item_id', 'please provide valid id'),
  ],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['item_name', 'item_price', 'item_quantity', 'item_id'];
      return res.status(422).send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    try {
      const [rows] = await pool.execute('UPDATE item SET item_name=?,item_price=?,item_quantity=? WHERE item_id=?', [
        req.body.item_name,
        req.body.item_price,
        req.body.item_quantity,
        req.params.item_id,
      ]);

      console.log(rows);

      return res.status(200).send(rG.success('item update', 'item updated successfully', []));
    } catch (e) {
      console.log(e);
      return res.status(500).send(rG.internalError(error.errList.internalError.ITEM_UPDATE_REGISTRATION_UNSUCCESSFUL));
    }
  },
);

router.delete('/delete/:item_id', [vs.isNumeric('params', 'item_id', 'please provide valid id')], async (req, res) => {
  const errors = vs.getValidationResult(req);
  if (!errors.isEmpty()) {
    const fieldsToValidate = ['item_id'];
    return res.status(422).send(rG.validationError(errors.mapped(), fieldsToValidate));
  }
  try {
    const [rows] = await pool.execute('DELETE  FROM item WHERE item_id=?', [req.params.item_id]);

    console.log(rows);

    return res.status(200).send(rG.success('item delete', 'item deleted successfully', []));
  } catch (e) {
    console.log(e);
    return res.status(500).send(rG.internalError(error.errList.internalError.ITEM_DELETE_REGISTRATION_UNSUCCESSFUL));
  }
});
module.exports = router;
