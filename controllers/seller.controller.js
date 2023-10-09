const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const {
  Seller,
  sellerRegisterSchema,
  sellerLoginSchema,
  sellerUpdateSchema,
} = require("../models/seller.model");

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
          error: `Internal server Error: ${error}`,
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

  // // show  all Sellers
  getAllSeller: async (req, res) => {
    try {
      // get all sellers data except password property
      let seller = await Seller.find({}, "-password");

      if (seller) {
        res.status(200).send({
          status: "success",
          message: "Sellers got successfully",
          data: seller,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getSellerById: async (req, res) => {
    try {
      const sellerId = req.params?.sellerId;

      // get desired seller data except password
      const seller = await Seller.findById(sellerId, "-password");

      if (seller) {
        res.status(200).send({
          status: "success",
          message: "Seller founded",
          data: seller,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  updateSeller: async (req, res) => {
    try {
      const sellerId = req.sellerId;

      const updateFields = req.body;

      updateFields &&
        (await sellerUpdateSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const seller = await Seller.findById(sellerId);

      if (!seller) {
        return res
          .status(404)
          .json({ status: "fail", error: "Seller not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the seller schema
          if (seller.schema.path(field)) {
            // Update the field with the new value
            seller[field] = updateFields[field];
          }
        }
      }

      // Save the updated seller document
      const updatedSeller = await seller.save();

      res.status(200).json({
        status: "success",
        message: "Credential(s) updated successfully",
        data: updatedSeller,
      });
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
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  updateSellerPassword: async (req, res) => {
    try {
      const sellerId = req.sellerId;
      const { oldPassword, newPassword, confirmPassword } = req?.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          status: "fail",
          error: "All fields are required",
        });
      } else {
        const seller = await Seller.findById(sellerId);
        if (!seller) {
          return res
            .status(404)
            .json({ status: "fail", error: "Seller not found" });
        } else {
          const isMatch = await bcrypt.compare(oldPassword, seller?.password);

          if (isMatch) {
            if (newPassword === confirmPassword) {
              const salt = await bcrypt.genSalt(Number(process.env.SALT));
              const hashedPassword = await bcrypt.hash(newPassword, salt);

              // update password field in privious data
              seller.password = hashedPassword;

              // Save the updated seller document
              const updatedSeller = await seller.save();

              updatedSeller &&
                res.status(200).json({
                  status: "success",
                  message: "Password updated successfully",
                  data: updatedSeller,
                });
            } else {
              res.status(400).json({
                status: "fail",
                error: "New Password And Confirm Password must be same",
              });
            }
          } else {
            res.status(400).json({
              status: "fail",
              error: "Invalid old Password",
            });
          }
        }
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  deleteSeller: async (req, res) => {
    try {
      const sellerId = req.params?.sellerId;

      let deletedResult = await Seller.findByIdAndDelete(sellerId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Seller deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },
};
