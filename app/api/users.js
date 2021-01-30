const db = require("../../databasePool");
const { clean } = require('../utils/utils');

const userById = (req, res) => {
    const id = req.params.id;
  
    db.query(
      "SELECT email, firstName, lastName, password, streetAddress, city, postalCode, province, phoneNumber, weekAmount FROM users WHERE id = ?",
      id,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
}

const updateUserById = (req, res) => {
  const id = req.params.id;
  const {
    email,
    firstName,
    lastName,
    streetAddress,
    city,
    postalCode,
    province,
    phoneNumber,
    weekAmount,
    password
  } = req.body;

  let user = {
    email,
    firstName,
    lastName,
    streetAddress,
    city,
    postalCode,
    province,
    phoneNumber,
    weekAmount,
    password
  };

  user = clean(user);

  if (user.password) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "UPDATE users SET ? WHERE id = ?",
        [user, id],
        (errr, result) => {
          if (err) {
            res.send({ err: errr });
          }
          res.send(result);
        }
      );
    });
  }
  else {
    db.query(
      "UPDATE users SET ? WHERE id = ?",
      [user, id],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
  }

  
}

module.exports = {
  userById,
  updateUserById
};
