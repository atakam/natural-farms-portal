const bcrypt = require("bcrypt");
const saltRounds = 10;
const { clean } = require('../utils/utils');
const ndb = require("../../databasePool");

const userById = (req, res) => {
    const id = req.params.id;
  
    const db = ndb();
    db.query(
      "SELECT id, nff, email, firstName, lastName, password, streetAddress, city, postalCode, province, phoneNumber, weekAmount FROM users WHERE id = ?",
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

const userByFormId = (req, res) => {
  const id = req.params.id;

  const db = ndb();
  db.query(
    "SELECT id, email, firstName, lastName, streetAddress, city, postalCode, province, phoneNumber, role FROM users LEFT JOIN form_completion ON form_completion.customer_id = users.id WHERE form_completion.id = ?",
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

const usersByRole = (req, res) => {
  const db = ndb();
  db.query(
    "SELECT id, email, firstName, lastName, streetAddress, city, postalCode, province, phoneNumber, weekAmount FROM users"
    ,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
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
    password,
    nff
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
    password,
    nff
  };

  user = clean(user);
  console.log(user);

  if (user.password) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      user = {
        ...user,
        password: hash
      };
      const db = ndb();
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
      db.end();
    });
  }
  else {
    const db = ndb();
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
    db.end();
  }
}

const deleteUser = (req, res) => {
  const id = req.params.id;
  const db = ndb();
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
  db.end();
}

const deleteStaff = (req, res) => {
  const id = req.params.id;
  const db = ndb();
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
  db.end();
}

const getStaff = (req, res) => {
  const db = ndb();
  db.query(
    "SELECT id, username, name, email, role FROM representative",
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      res.send(result);
    }
  );
  db.end();
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
      const db = ndb();
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
      db.end();
    });
  }
  else {
    const db = ndb();
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
    db.end();
  }
}

const staffById = (req, res) => {
  const id = req.params.id;

  const db = ndb();
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
  db.end();
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

    const db = ndb();
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
    db.end();
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
  registerStaff,
  userByFormId
};
