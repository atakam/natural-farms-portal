const express = require("express");
const app = express();

const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const {
    registerRouter,
    loginGetRouter,
    loginPostRouter,
    logoutRouter
} = require('./api/credentials');

const {
  ordersByUserRouter
} = require('./api/orders');

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.post("/register", registerRouter);

app.get("/login", loginGetRouter);

app.get("/logout", logoutRouter);

app.post("/login", loginPostRouter);

app.get("/orders/:id", ordersByUserRouter);

module.exports = app;