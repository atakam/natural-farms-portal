const db = require("../../databasePool");
const { clean } = require('../utils/utils');

const ordersByUserRouter = (req, res) => {
    const id = req.params.id;
  
    db.query(
      "SELECT *, form_completion.id AS formid, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = ?",
      id,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
}

const orders = (req, res) => {
  db.query(
    "SELECT *, form_completion.id AS formid, users.id AS uid, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const originalOrders = (req, res) => {
  const formid = req.params.formid;
  console.log('FORM ID:', formid);
  db.query(
    "SELECT * FROM form_completion LEFT JOIN orders ON orders.form_id = form_completion.id LEFT JOIN products_details ON products_details.id = orders.product_details_id LEFT JOIN products ON products.id = products_details.product_id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id WHERE form_completion.id = ?",
    formid,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const updatedOrders = (req, res) => {
  const formid = req.params.formid;
  console.log('FORM ID:', formid);
  db.query(
    "SELECT * FROM form_completion LEFT JOIN orders_updates ON orders_updates.form_id = form_completion.id LEFT JOIN products_details ON products_details.id = orders_updates.product_details_id LEFT JOIN products ON products.id = products_details.product_id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id WHERE form_completion.id = ?",
    formid,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const modifiedFormOrders = (req, res) => {
  db.query(
    "SELECT *, form_completion.id AS formid, users.id AS uid, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id AND form_completion.id IN (SELECT DISTINCT form_id FROM orders_updates)",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const getUpdates = (req, res) => {
  console.log('UPDATE CHECK');
  db.query(
    "SELECT form_id FROM orders_updates",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const deleteForm = (req, res) => {
  const formid = req.params.formid;
  db.query(
    "DELETE FROM form_completion WHERE id = ?",
    formid,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const updateOrderConfirmDeliverById = (req, res) => {
  const formid = req.params.formid;
  const {
    confirm1,
    confirm2,
    confirm3,
    deliver1,
    deliver2,
    deliver3
  } = req.body;

  let order = {
    confirm1,
    confirm2,
    confirm3,
    deliver1,
    deliver2,
    deliver3
  };

  order = clean(order);

  db.query(
    "UPDATE form_completion SET ? WHERE id = ?",
    [order, formid],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

module.exports = {
    ordersByUserRouter,
    orders,
    deleteForm,
    originalOrders,
    updatedOrders,
    modifiedFormOrders,
    getUpdates,
    updateOrderConfirmDeliverById
};