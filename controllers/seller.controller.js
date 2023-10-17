const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const { Seller, sellerUpdateSchema } = require("../models/seller.model");
const { Group } = require("../models/group.model");
const { Author } = require("../models/author.model");

module.exports = {
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
      const sellerId = req?.sellerId;

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
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
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

  //----------------------Group---------------------

  getAllGroup: async (req, res) => {
    try {
      // get all groups data
      let group = await Group.find({});

      if (group) {
        res.status(200).send({
          status: "success",
          message: "Groups got successfully",
          data: group,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Group not found",
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

  getGroupById: async (req, res) => {
    try {
      const groupId = req.params?.groupId;

      // get desired group data
      const group = await Group.findById(groupId);

      if (group) {
        res.status(200).send({
          status: "success",
          message: "Group founded",
          data: group,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  // ---------------------Author---------------
  addAuthor: async (req, res) => {
    try {
      let authorData = req.body;

      authorData &&
        (await addAuthorSchema.validate(authorData, {
          abortEarly: false,
        }));

      const author = new Author(authorData);

      const result = await author.save();

      result &&
        res.status(200).send({
          status: "success",
          message: "Author added Successfully",
          data: result,
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
          error: `Internal server Error`,
        });
      }
    }
  },

  // // show  all Authors
  getAllAuthor: async (req, res) => {
    try {
      // get all authors data except password property
      let author = await Author.find({});

      if (author) {
        res.status(200).send({
          status: "success",
          message: "Authors got successfully",
          data: author,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Author not found",
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

  getAuthorById: async (req, res) => {
    try {
      const authorId = req.params?.authorId;

      // get desired author data
      const author = await Author.findById(authorId);

      if (author) {
        res.status(200).send({
          status: "success",
          message: "Author founded",
          data: author,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Author not found",
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
