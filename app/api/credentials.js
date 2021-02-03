const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../../databasePool");

const registerRouter = (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        streetAddress,
        city,
        postalCode,
        province,
        phoneNumber,
        weekAmount,
        role
     } = req.body;

     const entry = {
        firstName,
        lastName,
        email,
        password,
        streetAddress,
        city,
        postalCode,
        province,
        phoneNumber,
        weekAmount,
        role,
        dateCreated: today()
      };

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO users SET ?",
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

const loginGetRouter = (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
}

const loginPostRouter = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const isStaff = req.body.isStaff;

    const sql = isStaff ? "SELECT * FROM representative WHERE username = ? OR email = ?"
      : "SELECT * FROM users WHERE email = ? OR email = ?";

    isStaff ? console.log('STAFF LOGIN') : console.log('CUSTOMER LOGIN');
  
    db.query(
      sql,
      [email, email],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
  
        if (result.length > 0) {
          return bcrypt.compare(password, result[0].password, (error, response) => {
              if (response) {
                  req.session.user = result;
                  console.log(req.session.user);
                  res.send(result);
              } else {
                  res.send({ message: "Wrong username/password combination!" });
              }
          });
        } else {
          res.send({ message: "User doesn't exist" });
        }
      }
    );
}

const logoutRouter = (req, res) => {
    if (req.session.user) {
        req.session.user = null;
      res.send({ loggedIn: false, message: 'Successfully logged out' });
    } else {
        res.send({ loggedIn: false, message: 'Already logged out' });
    }
}

const today = () => {
    var ntoday = new Date();
    var dd = String(ntoday.getDate()).padStart(2, '0');
    var mm = String(ntoday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = ntoday.getFullYear();
  
    ntoday = yyyy + '-' + mm +'-' + dd;
    return ntoday;
}

module.exports = {
    registerRouter,
    loginGetRouter,
    loginPostRouter,
    logoutRouter
};