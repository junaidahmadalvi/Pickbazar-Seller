const { Admin } = require("../models/admin.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const bcrypt = require("bcrypt");

module.exports = {
  //----------< Authentification>  ------------------

  authenticateAdmin: async (req, res, next) => {
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

          const adminId = decode.adminId;
          req.adminId = adminId;

          // Get Admin from Token
          const admin = await Admin.findById(adminId);

          if (admin) {
            console.log("admin authenticated");
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
