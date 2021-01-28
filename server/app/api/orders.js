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

module.exports = {
    ordersByUserRouter
};