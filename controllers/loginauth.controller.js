const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const yup = require("yup");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const { Customer, customerLoginSchema } = require("../models/customer.model");

const { Admin, adminLoginSchema } = require("../models/admin.model");

const { Seller, sellerLoginSchema } = require("../models/seller.model");

const userAuthSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password length must be 4"),
});

module.exports = {
  // Customer login controller
  loginUser: async (req, res) => {
    try {
      const userData = req.body;

      userData &&
        (await userAuthSchema.validate(userData, {
          abortEarly: false,
        }));

      const { email, password } = req.body;

      let customer = await Customer.findOne({ email: email });

      if (customer != null) {
        // check given password match with DB password of particular customer OR not and return true/false
        const isMatch = await bcrypt.compare(password, customer?.password);

        if (customer.email === email && isMatch) {
          if (customer.status === "active") {
            // Generate JWT Token
            const token = jwt.sign(
              { customerId: customer._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );

            res.setHeader("Authorization", `Bearer ${token}`);

            //remove password field from customer object
            delete customer?.password;

            res.status(200).send({
              status: "success",
              message: "Login Successfully",
              data: {
                customer: customer,
                token: token,
                userType: "customer",
              },
            });
          } else {
            res.status(400).send({
              status: "fail",
              error: "Access Denied by Admin",
            });
            console.log("Customer Access Denied by Admin");
          }
        } else {
          res.status(400).json({
            status: "fail",
            error: "Email or password is not Valid",
          });
        }
      } else {
        let admin = await Admin.findOne({ email: email });

        if (admin != null) {
          // check given password match with DB password of particular admin OR not and return true/false
          const isMatch = await bcrypt.compare(password, admin?.password);

          if (admin.email === email && isMatch) {
            // Generate JWT Token
            const token = jwt.sign(
              { adminId: admin._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );

            res.setHeader("Authorization", `Bearer ${token}`);

            //remove password field from admin object
            delete admin?.password;
            res.status(200).send({
              status: "success",
              message: "Login Successfully",
              data: {
                admin: admin,
                token: token,
                userType: "admin",
              },
            });
          } else {
            res.status(400).json({
              status: "fail",
              error: "Email or password is not Valid",
            });
          }
        } else {
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
                  message: "Login Successfully",
                  data: {
                    seller: seller,
                    token: token,
                    userType: "seller",
                  },
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
};
