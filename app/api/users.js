const db = require("../../databasePool");

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

module.exports = {
  userById,
  updateUserById
};

const clean = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj
}