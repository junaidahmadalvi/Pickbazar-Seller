const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");
var bodyParser = require("body-parser");

//------------- group rputes have to test on postman-----------------

// require all routes

const authRoute = require("./routes/auth.route");
const adminRoute = require("./routes/admin.route");
const customerRoute = require("./routes/customer.route");
const sellerRoute = require("./routes/seller.route");
const authorRoute = require("./routes/auhtor.route");
const groupRoute = require("./routes/group.route");

// DB-Connection
connection();

// middlewares

//  use  cors to run multiple servers
app.use(cors());

//  express's body parser to convetert data into JSON form
app.use(express.json());
// to parse data in json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

//-----defining base routes of all entities--------

// auth for user-login-type
app.use("/api/auth", authRoute);

// admin route
app.use("/api/admin", adminRoute);

// customer route
app.use("/api/customer", customerRoute);

// seller route
app.use("/api/seller", sellerRoute);

// author route
app.use("/api/author", authorRoute);

// group route
app.use("/api/group", groupRoute);

// start node server
const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
