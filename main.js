const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");
var bodyParser = require("body-parser");

//------------- group routes have to test on postman-----------------

// require all routes
const sellerRoute = require("./routes/seller.route");

// require auth middleware
const sellerAuth = require("./middleware/seller.auth");

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

// <--------------------------OPEN ROUTES----------------------------->
// auth for user-login-type
app.post("/auth/sellerRegister", sellerAuth.registerSeller);
app.post("/auth/sellerLogin", sellerAuth.loginSeller);

// auth globle middleware
app.use(sellerAuth.authenticateSeller);
// <--------------------------PROTECTED ROUTES----------------------------->

// seller route
app.use("/api/seller", sellerRoute);

// start node server
const PORT = process.env.PORT || 6000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
