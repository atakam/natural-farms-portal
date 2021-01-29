const db = require("../../databasePool");

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

module.exports = {
    ordersByUserRouter,
    orders,
    deleteForm
};