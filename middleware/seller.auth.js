const {
  Seller,
  sellerRegisterSchema,
  sellerLoginSchema,
} = require("../models/seller.model");

var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const bcrypt = require("bcrypt");

module.exports = {
  registerSeller: async (req, res) => {
    try {
      let sellerData = req.body;

      sellerData &&
        (await sellerRegisterSchema.validate(sellerData, {
          abortEarly: false,
        }));

      let seller = await Seller.findOne({ email: sellerData?.email });

      // validate email exist
      if (seller) {
        res.status(400).json({
          status: "fail",
          error: "email already exist",
        });
      } else {
        // validate password and confirmPassword match
        if (sellerData?.password != sellerData?.confirmPassword) {
          res.status(400).json({
            status: "fail",
            error: "Password and Confirm Password must same",
          });
        } else {
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashpswd = await bcrypt.hash(sellerData?.password, salt);
          let requestData = {
            name: sellerData?.name,
            email: sellerData?.email,
            password: hashpswd,
          };

          seller = new Seller(requestData);

          const result = await seller.save();

          res.status(200).send({
            status: "success",
            message: "Seller added Successfully",
            data: result,
          });
        }
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  // Seller login controller
  loginSeller: async (req, res) => {
    try {
      const sellerData = req.body;

      sellerData &&
        (await sellerLoginSchema.validate(sellerData, {
          abortEarly: false,
        }));
      const { email, password } = req.body;

      let seller = await Seller.findOne({ email: email });

      if (seller != null) {
        // check given password match with DB password of particular seller OR not and return true/false

        const isMatch = await bcrypt.compare(password, seller?.password);

        if (seller.email === email && isMatch) {
          if (seller.status === "active") {
            // Generate JWT Token
            const token = jwt.sign(
              { sellerId: seller._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );

            res.setHeader("Authorization", `Bearer ${token}`);

            //remove password field from seller object
            delete seller?.password;
            res.status(200).send({
              status: "success",
              message: "Login Success",
              token: token,
              data: seller,
            });
          } else {
            res.status(400).send({
              status: "fail",
              error: "Access Denied by Admin",
            });
            console.log("Seller Access Denied by Admin");
          }
        } else {
          res.status(400).json({
            status: "fail",
            error: "Email or password is not Valid",
          });
        }
      } else {
        res.status(400).json({
          status: "fail",
          error: "Email or password is not Valid",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

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
