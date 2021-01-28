const express = require("express");
const app = express();

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

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
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

module.exports = app;