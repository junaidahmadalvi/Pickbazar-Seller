const { Customer } = require("../models/customer.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "jd897#$%dsjY*%#ldEddwmQ";
const env = require("dotenv").config();

const bcrypt = require("bcrypt");

module.exports = {
  //----------< Authentification>  ------------------

  authenticateCustomer: async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];
    console.log("Authoriazation", authorizationHeader);
    // Check if the Authorization header exists and starts with 'Bearer '
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      // Extract the token (remove 'Bearer ' from the beginning)
      try {
        const token = authorizationHeader.slice(7);
        // Check if a token is provided
        console.log("token at middleware", token);
        if (!token) {
          return res
            .status(401)
            .json({ message: "Authentication token is missing." });
        } else {
          const decode = await jwt.verify(token, JWT_SECRET_KEY);

          const customerId = decode.customerId;
          req.customerId = customerId;
          // var customerId = decode.id;
          // Get Customer from Token
          const customer = await Customer.findById(customerId);

          if (customer) {
            console.log("customer authenticated");
            console.log("customer", customer);
            next();
          } else {
            res
              .status(403)
              .json({ error: "Authentication failed. Invalid token." });
          }
        }
      } catch (error) {
        return res.status(401).json({
          status: "fail",
          error: error.message,
        });
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "Authentication token is missing.",
      });
    }
  },
};
