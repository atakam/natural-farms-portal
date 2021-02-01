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

const updateDeliveryDateById = (req, res) => {
  const formid = req.params.formid;
  const {
    conditions_firstdeliverydate,
    conditions_seconddeliverydate,
    conditions_thirddeliverydate
  } = req.body;

  let order = {
    conditions_firstdeliverydate,
    conditions_seconddeliverydate,
    conditions_thirddeliverydate
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

const getStatistics = (req, res) => {
  console.log('STATISTICS');
  db.query(
    "SELECT COUNT(id) AS count FROM form_completion",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      let stat = {
        orderCount: result[0].count
      };
      db.query(
        "SELECT COUNT(id) AS count FROM form_completion WHERE signature_date > NOW() - INTERVAL 30 DAY",
        (err2, result2) => {
          if (err2) {
            res.send({ err2: err2 });
          }
          stat.monthCount = result2[0].count;
          db.query(
            "SELECT COUNT(form_completion.id) AS count FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id AND form_completion.id IN (SELECT DISTINCT form_id FROM orders_updates) AND form_completion.edited_status = 0",
            (err3, result3) => {
              if (err3) {
                res.send({ err3: err3 });
              }
              stat.pendingCount = result3[0].count;
              db.query(
                "SELECT COUNT(id) AS count FROM users",
                (err4, result4) => {
                  if (err4) {
                    res.send({ err4: err4 });
                  }
                  stat.customerCount = result4[0].count;
                  db.query(
                    "SELECT *, form_completion.id AS formid, users.id AS uid, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id ORDER BY form_completion.signature_date DESC LIMIT 10",
                    (err5, result5) => {
                      if (err5) {
                        res.send({ err5 });
                      }
                      stat.latestOrders = result5;
                      db.query(
                        "SELECT * FROM orders lEFT JOIN products_details ON products_details.id = orders.product_details_id LEFT JOIN products ON products.id = products_details.product_id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id WHERE orders.form_id NOT IN (SELECT DISTINCT orders_updates.form_id FROM orders_updates)",
                        (err6, result6) => {
                          if (err6) {
                            res.send({ err6 });
                          }
                          stat.unModifiedOrders = result6;
                          db.query(
                            "SELECT * FROM orders_updates lEFT JOIN products_details ON products_details.id = orders_updates.product_details_id LEFT JOIN products ON products.id = products_details.product_id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id WHERE orders_updates.form_id",
                            (err7, result7) => {
                              if (err7) {
                                res.send({ err7 });
                              }
                              stat.modifiedOrders = result7;
                              res.send(stat);
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
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
    updateOrderConfirmDeliverById,
    updateDeliveryDateById,
    getStatistics
};