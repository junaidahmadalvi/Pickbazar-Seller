const { Seller } = require("../models/seller.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const bcrypt = require("bcrypt");

module.exports = {
  //----------< Authentification>  ------------------

  authenticateSeller: async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];

    // Check if the Authorization header exists and starts with 'Bearer '
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      // Extract the token (remove 'Bearer ' from the beginning)
      try {
        const token = authorizationHeader.slice(7);

        // Check if a token is provided
        if (!token) {
          return res
            .status(401)
            .json({ message: "Authentication token is missing." });
        } else {
          const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

          const sellerId = decode.sellerId;
          req.sellerId = sellerId;

          // Get Seller from Token
          const seller = await Seller.findById(sellerId);

          if (seller) {
            console.log("seller authenticated");
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
