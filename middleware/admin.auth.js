const { Customer } = require("../models/customer.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "jd897#$%dsjY*%#ldEddwmQ";
const env = require("dotenv").config();

const bcrypt = require("bcrypt");

module.exports = {
  //----------< Authentification>  ------------------

  authorizeAdmin: async (req, res, next) => {
    try {
      const adminId = req.body.adminId;
      console.log(adminId, "adminId");

      // let getresult = connection();
      let user = await User.findOne({
        _id: ObjectId(adminId),
      });
      //  console.log(getresult);

      if (user) {
        if (user.role === "admin") {
          console.log("Admin Authoriazed");
          next();
        } else {
          res
            .status(400)
            .send({ status: "failed", message: "Rout Not Authorized" });
          console.log("Admin Not Authoriazed");
        }
      } else {
        res.status(400).send({
          status: "failed",
          message: "Invalid User OR Authentication failed",
        });
        console.log("Invalid User OR Authentication failed");
      }
    } catch (e) {
      res.status(500).send({ message: "Server Error", Error: e });
      console.log(e);
    }
  },
};
