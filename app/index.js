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
  orders,
  deleteForm,
  originalOrders,
  updatedOrders,
  modifiedFormOrders,
  updateOrderConfirmDeliverById,
  updateDeliveryDateById,
  getUpdates,
  getStatistics,
  getSummary,
  createOrder,
  updateOrderFormById,
  createOrderDetails,
  deleteUpdatedOrderDetails,
  updateOrderDetails,
  getOrderDetailsByFormId,
  getUpdateDetailsByFormId,
  updateOrderSalesRepById,
  resetOrder,
  orderFormByFormId
} = require('./api/orders');

const {
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
} = require('./api/users');

const {
  emailTemplateById,
  updateEmailTemplateById,
  getEmailTemplates
} = require('./api/templates');

const {
  getProducts,
  getProductDetails,
  updateProductById,
  productById,
  deleteProduct,
  categories,
  createProduct,
  packagingByProductId,
  updateCategoryById,
  deleteCategory,
  createCategory,
  categoryById
} = require('./api/products');

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
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

app.get("/form/:formid", orderFormByFormId);

app.get("/ordersmodified", modifiedFormOrders);

app.get("/orders/original/:formid", originalOrders);

app.get("/orders/updated/:formid", updatedOrders);

app.get("/orderscheck/updated", getUpdates);

app.delete("/orders/delete/:formid", deleteForm);

app.delete("/orders_details/update/delete/:formid", deleteUpdatedOrderDetails);

app.post("/orders/create", createOrder);

app.post("/orders/update/update/:formid", updateOrderFormById);

app.get("/orders_details/:formid", getOrderDetailsByFormId);

app.get("/orders_details/update/:formid", getUpdateDetailsByFormId);

app.post("/orders_details/update/create", updateOrderDetails);

app.post("/orders_details/create", createOrderDetails);

app.post("/orders/update/:formid", updateOrderConfirmDeliverById);

app.post("/orders/staff/:formid", updateOrderSalesRepById);

app.post("/orders/reset/:formid", resetOrder);

app.post("/orders/delivery/update/:formid", updateDeliveryDateById)

app.get("/summary/date/:date", getSummary);

app.get("/user/:id", userById);

app.get("/users", usersByRole);

app.get("/users/form/:id", userByFormId);

app.post("/user/:id", updateUserById);

app.delete("/user/delete/:id", deleteUser);

app.get("/staff", getStaff);

app.get("/staff/:id", staffById);

app.post("/staff/:id", updateStaffById);

app.post("/register/staff", registerStaff);

app.delete("/staff/delete/:id", deleteStaff);

app.get("/templates/email", getEmailTemplates);

app.get("/templates/email/:id", emailTemplateById);

app.post("/templates/email/:id", updateEmailTemplateById);

app.get("/products", getProducts);

app.get("/productdetails", getProductDetails);

app.get("/products/:id", productById);

app.post("/products/:id", updateProductById);

app.put("/products/:id", createProduct);

app.delete("/product/delete/:id", deleteProduct);

app.get("/categories", categories);

app.get("/categories/:id", categoryById);

app.post("/categories/:id", updateCategoryById);

app.put("/categories/:id", createCategory);

app.delete("/category/delete/:id", deleteCategory);

app.get("/packaging/product/:id", packagingByProductId);


app.get("/statistics", getStatistics);

module.exports = app;