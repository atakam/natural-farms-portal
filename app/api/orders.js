const { clean } = require('../utils/utils');
const ndb = require("../../databasePool");

const ordersByUserRouter = (req, res) => {
    const id = req.params.id;
    const db = ndb();
    db.query(
      "SELECT *, form_completion.id AS formid, users.email AS userEmail, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = ?",
      id,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
    db.end();
}

const orders = (req, res) => {
  const db = ndb();
  db.query(
    "SELECT *, form_completion.id AS formid, users.id AS uid, users.email AS userEmail, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id ORDER BY form_completion.id DESC",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

const orderFormByFormId = (req, res) => {
  const formid = req.params.formid;
  const db = ndb();
  db.query(
    "SELECT *, form_completion.id AS formid, users.id AS uid, users.email AS userEmail, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id AND form_completion.id = ?",
    formid,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

const createOrder = (req, res) => {
  const {
      conditions_firstdeliverydate,
      conditions_seconddeliverydate,
      conditions_thirddeliverydate,
      deposit,
      price,
      rebate,
      signature_address,
      signature_consumer_name,
      signature_merchant_name,
      signature_date,
      total,
      total_points,
      customer_id,
      representative_id,
      notice
    } = req.body;

    const newOrders = {
      conditions_firstdeliverydate,
      conditions_seconddeliverydate,
      conditions_thirddeliverydate,
      deposit,
      price,
      rebate,
      signature_address,
      signature_consumer_name,
      signature_merchant_name,
      signature_date,
      total,
      total_points,
      customer_id,
      representative_id,
      confirm1: 0,
      edited_points: -1,
      edited_price: -1,
      edited_rebate: -1,
      edited_deposit: -1,
      edited_total: -1,
      notice
    };

    const db = ndb();
    db.query(
      "INSERT INTO form_completion SET ?",
      newOrders,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
    db.end();
}

const createOrderDetails = (req, res) => {
  const {
      form_id,
      product_details_id,
      quantity1,
      quantity2,
      quantity3
    } = req.body;

    const orderDetails = {
      form_id,
      product_details_id,
      quantity1,
      quantity2,
      quantity3
    };

    const db = ndb();
    db.query(
      "INSERT INTO orders SET ?",
      orderDetails,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
    db.end();
}

const deleteUpdatedOrderDetails = (req, res) => {
    const formid = req.params.formid;
    const db = ndb();
    db.query(
      "DELETE FROM orders_updates WHERE form_id = ?",
      formid,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result)
      }
    );
    db.end();
}

const updateOrderDetails = (req, res) => {
  const {
    form_id,
    product_details_id,
    quantity1,
    quantity2,
    quantity3
  } = req.body;

  const orderDetails = {
    form_id,
    product_details_id,
    quantity1,
    quantity2,
    quantity3
  };

  console.log('orders being updates');

  const db = ndb();
  db.query(
    "INSERT INTO orders_updates SET ?",
    orderDetails,
    (err, result) => {
      if (err) {
        res.send({ err });
      }
      res.send(result);
    }
  );
  db.end();
}

const originalOrders = (req, res) => {
  const formid = req.params.formid;
  console.log('FORM ID:', formid);
  const db = ndb();
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
  db.end();
}

const updatedOrders = (req, res) => {
  const formid = req.params.formid;
  console.log('FORM ID:', formid);
  const db = ndb();
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
  db.end();
}

const modifiedFormOrders = (req, res) => {
  const db = ndb();
  db.query(
    "SELECT *, form_completion.id AS formid, users.id AS uid, users.email AS userEmail, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id AND form_completion.id IN (SELECT DISTINCT form_id FROM orders_updates)",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

const getUpdates = (req, res) => {
  console.log('UPDATE CHECK');
  const db = ndb();
  db.query(
    "SELECT form_id FROM orders_updates",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

const getOrderDetailsByFormId = (req, res) => {
  const formid = req.params.formid;
  const db = ndb();
  db.query(
    "SELECT * FROM orders LEFT JOIN products_details ON products_details.id = orders.product_details_id WHERE form_id = ?",
    formid,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

const getUpdateDetailsByFormId = (req, res) => {
  const formid = req.params.formid;
  const db = ndb();
  db.query(
    "SELECT * FROM orders_updates LEFT JOIN products_details ON products_details.id = orders_updates.product_details_id WHERE form_id = ?",
    formid,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
}

const deleteForm = (req, res) => {
  const formid = req.params.formid;
  const db = ndb();
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
  db.end();
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

  const db = ndb();
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
  db.end();
}

const updateOrderSalesRepById = (req, res) => {
  const formid = req.params.formid;
  const {
    representative_id
  } = req.body;

  let order = {
    representative_id
  };

  const db = ndb();
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
  db.end();
}

const updateOrderFormById = (req, res) => {
  const formid = req.params.formid;
  const {
    conditions_firstdeliverydate,
    conditions_seconddeliverydate,
    conditions_thirddeliverydate,
    deposit,
    price,
    rebate,
    signature_address,
    signature_consumer_name,
    signature_merchant_name,
    total,
    total_points,
    confirm1,
    status,
    edited_deposit,
    edited_price,
    edited_rebate,
    edited_points,
    notice
  } = req.body;

  let order = {
    conditions_firstdeliverydate,
    conditions_seconddeliverydate,
    conditions_thirddeliverydate,
    deposit,
    price,
    rebate,
    signature_address,
    signature_consumer_name,
    signature_merchant_name,
    total,
    total_points,
    confirm1,
    status,
    edited_deposit,
    edited_price,
    edited_rebate,
    edited_points,
    notice
  };

  console.log({order})

  order = clean(order);

  const db = ndb();
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
  db.end();
}

const resetOrder = (req, res) => {
  const formid = req.params.formid;
  const order = {
    status: 1,
    edited_deposit: -1,
    edited_price: -1,
    edited_rebate:-1,
    edited_points: -1
  }

  const db = ndb();
  db.query(
    "UPDATE form_completion SET ? WHERE id = ?",
    [order, formid],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      const db2 = ndb();
      db2.query(
        "DELETE FROM orders_updates WHERE form_id = ?",
        formid,
        (err2, result2) => {
          if (err2) {
            res.send({ err: err2 });
          }
          res.send({result, result2});
        }
      );
      db2.end();
    }
  );
  db.end();
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

  const db = ndb();
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
  db.end();
}

const getStatistics = (req, res) => {
  console.log('STATISTICS');
  const db1 = ndb(), db2 = ndb(), db3 = ndb(), db4 = ndb(), db5 = ndb(), db6 = ndb(), db7 = ndb();
  db1.query(
    "SELECT COUNT(id) AS count FROM form_completion",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      let stat = {
        orderCount: result[0].count
      };
      db2.query(
        "SELECT COUNT(id) AS count FROM form_completion WHERE signature_date > NOW() - INTERVAL 30 DAY",
        (err2, result2) => {
          if (err2) {
            res.send({ err2: err2 });
          }
          stat.monthCount = result2[0].count;
          db3.query(
            "SELECT COUNT(form_completion.id) AS count FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id AND form_completion.id IN (SELECT DISTINCT form_id FROM orders_updates) AND form_completion.edited_status = 0",
            (err3, result3) => {
              if (err3) {
                res.send({ err3: err3 });
              }
              stat.pendingCount = result3[0].count;
              db4.query(
                "SELECT COUNT(id) AS count FROM users",
                (err4, result4) => {
                  if (err4) {
                    res.send({ err4: err4 });
                  }
                  stat.customerCount = result4[0].count;
                  db5.query(
                    "SELECT *, form_completion.id AS formid, users.id AS uid, users.email AS userEmail, representative.name AS repName FROM form_completion LEFT JOIN users ON users.id = form_completion.customer_id LEFT JOIN representative ON representative.id = form_completion.representative_id WHERE form_completion.customer_id = users.id ORDER BY form_completion.signature_date DESC LIMIT 10",
                    (err5, result5) => {
                      if (err5) {
                        res.send({ err5 });
                      }
                      stat.latestOrders = result5;
                      db6.query(
                        "SELECT * FROM orders lEFT JOIN products_details ON products_details.id = orders.product_details_id LEFT JOIN products ON products.id = products_details.product_id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id WHERE orders.form_id NOT IN (SELECT DISTINCT orders_updates.form_id FROM orders_updates)",
                        (err6, result6) => {
                          if (err6) {
                            res.send({ err6 });
                          }
                          stat.unModifiedOrders = result6;
                          db7.query(
                            "SELECT * FROM orders_updates lEFT JOIN products_details ON products_details.id = orders_updates.product_details_id LEFT JOIN products ON products.id = products_details.product_id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id WHERE orders_updates.form_id",
                            (err7, result7) => {
                              if (err7) {
                                res.send({ err7 });
                              }
                              stat.modifiedOrders = result7;
                              res.send(stat);
                            }
                          );
                          db7.end();
                        }
                      );
                      db6.end();
                    }
                  );
                  db5.end();
                }
              );
              db4.end();
            }
          );
          db3.end();
        }
      );
      db2.end();
    }
  );
  db1.end();
}

const getSummary = (req, res) => {
  const date = req.params.date;
  console.log('SUMMARY CHECK');
  const db = ndb();
  db.query(
    "SELECT * FROM form_completion LEFT JOIN orders ON orders.form_id = form_completion.id LEFT JOIN products_details ON products_details.id = orders.product_details_id LEFT JOIN products ON products.id = products_details.product_id LEFT JOIN product_packaging ON product_packaging.id = products_details.packaging_id LEFT JOIN users ON users.id = form_completion.customer_id WHERE form_completion.conditions_firstdeliverydate = ? OR form_completion.conditions_seconddeliverydate = ? OR form_completion.conditions_thirddeliverydate = ?",
    [date, date, date],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
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
    getStatistics,
    getSummary,
    createOrder,
    createOrderDetails,
    updateOrderFormById,
    deleteUpdatedOrderDetails,
    updateOrderDetails,
    getOrderDetailsByFormId,
    getUpdateDetailsByFormId,
    updateOrderSalesRepById,
    resetOrder,
    orderFormByFormId
};