const express = require("express");
const path = require('path');
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const {
    registerRouter,
    loginGetRouter,
    loginPostRouter,
    logoutRouter
} = require('./api/credentials');

const {
  ordersByUserRouter,
  orders
} = require('./api/orders');

const {
  userById,
  updateUserById
} = require('./api/users');

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: false
  })
);

app.post("/register", registerRouter);

app.get("/login", loginGetRouter);

app.get("/logout", logoutRouter);

app.post("/login", loginPostRouter);

app.get("/orders/:id", ordersByUserRouter);

app.get("/orders", orders);

app.get("/user/:id", userById);

app.post("/user/:id", updateUserById);

module.exports = app;