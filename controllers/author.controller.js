const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const {
  Author,
  addAuthorSchema,
  authorUpdateSchema,
} = require("../models/author.model");

module.exports = {
  addAuthor: async (req, res) => {
    try {
      let authorData = req.body;

      authorData &&
        (await addAuthorSchema.validate(authorData, {
          abortEarly: false,
        }));

      const author = new Author(authorData);

      const result = await author.save();

      author &&
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
          error: `Internal server Error: ${error}`,
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

  updateAuthor: async (req, res) => {
    try {
      const authorId = req?.params?.authorId;

      const updateFields = req.body;

      updateFields &&
        (await authorUpdateSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const author = await Author.findById(authorId);

      if (!author) {
        return res
          .status(404)
          .json({ status: "fail", error: "Author not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the author schema
          if (author.schema.path(field)) {
            // Update the field with the new value
            author[field] = updateFields[field];
          }
        }
      }

      // Save the updated author document
      const updatedAuthor = await author.save();

      res.status(200).json({
        status: "success",
        message: "Author updated successfully",
        data: updatedAuthor,
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

  deleteAuthor: async (req, res) => {
    try {
      const authorId = req.params?.authorId;

      let deletedResult = await Author.findByIdAndDelete(authorId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Author deleted",
          data: deletedResult,
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
