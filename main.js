const express = require("express");
// const connection =require("./dbConnection");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/dbConnection");
var bodyParser = require("body-parser");

//---------------Controllers-----------------------

// const userController = require("./Controllers/userController");
// const postController = require("./Controllers/postController");

// require all routes

const customerRoute = require("./routes/customerRoute");
// const toDoListRoutes = require("./routes/toDoListRoutes");

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

//Customer route
app.use("/api/customer", customerRoute);

// // Category route
// app.use("/api/toDoList", toDoListRoutes);

const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
