const bcrypt = require("bcrypt");
const saltRounds = 10;
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

const usersByRole = (req, res) => {
  const role = req.params.role;

  db.query(
    "SELECT id, email, firstName, lastName, streetAddress, city, postalCode, province, phoneNumber, weekAmount FROM users WHERE role = ?",
    role,
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

const deleteUser = (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM users WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const deleteStaff = (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM representative WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const getStaff = (req, res) => {
  db.query(
    "SELECT id, username, name, email, role FROM representative",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const updateStaffById = (req, res) => {
  const id = req.params.id;
  const {
    email,
    name,
    role,
    password
  } = req.body;

  let staff = {
    email,
    name,
    role,
    password
  };

  staff = clean(staff);

  if (staff.password) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "UPDATE representative SET ? WHERE id = ?",
        [staff, id],
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
      "UPDATE representative SET ? WHERE id = ?",
      [staff, id],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send(result);
      }
    );
  }
}

const staffById = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT id, username, name, email, role, password FROM representative WHERE id = ?",
    id,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
}

const registerStaff = (req, res) => {
  const {
      username,
      name,
      email,
      password,
      role
   } = req.body;

   const entry = {
      username,
      name,
      email,
      password,
      role
    };

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO representative SET ?",
      { ...entry, password: hash},
      (error, result) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
            console.log(result);
            res.send(result);
          }
      }
    );
  });
};

module.exports = {
  userById,
  updateUserById,
  usersByRole,
  deleteUser,
  getStaff,
  deleteStaff,
  staffById,
  updateStaffById,
  registerStaff
};
