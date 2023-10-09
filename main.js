const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");
var bodyParser = require("body-parser");

// require all routes

const adminRoute = require("./routes/admin.route");
const customerRoute = require("./routes/customer.route");
const sellerRoute = require("./routes/seller.route");

// DB-Connection
connection();

// middlewares

//  use  cors to run multiple servers
app.use(cors());

//  express's body parser to convetert data into JSON form
app.use(express.json());
// to parse data in json
app.use(bodyParser.json());
// var jsonParser = bodyParser.json()

app.get("/", (req, res) => {
  res.send("API is running...");
});

// admin route
app.use("/api/admin", adminRoute);

// customer route
app.use("/api/customer", customerRoute);

// seller route
app.use("/api/seller", sellerRoute);

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
