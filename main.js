const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");
var bodyParser = require("body-parser");

// require all routes

const customerRoute = require("./routes/customer.route");
const adminRoute = require("./routes/admin.route");

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

// customer route
app.use("/api/customer", customerRoute);

// admin route
app.use("/api/admin", adminRoute);

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
