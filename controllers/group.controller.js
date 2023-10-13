const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const {
  Group,
  addGroupSchema,
  groupUpdateSchema,
} = require("../models/group.model");

module.exports = {
  addGroup: async (req, res) => {
    try {
      let groupData = req.body;

      groupData &&
        (await addGroupSchema.validate(groupData, {
          abortEarly: false,
        }));

      let group = await Group.findOne({ name: groupData?.name });

      // validate same name
      if (group) {
        res.status(400).json({
          status: "fail",
          error: "Try another group name",
        });
      } else {
        group = new Group(groupData);

        const result = await group.save();

        result &&
          res.status(200).send({
            status: "success",
            message: "Group added Successfully",
            data: result,
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

  // // show  all Groups
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
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  updateGroup: async (req, res) => {
    try {
      const groupId = req?.params?.groupId;

      const updateFields = req.body;

      updateFields &&
        (await groupUpdateSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const group = await Group.findById(groupId);

      if (!group) {
        return res
          .status(404)
          .json({ status: "fail", error: "Group not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the group schema
          if (group.schema.path(field)) {
            // Update the field with the new value
            group[field] = updateFields[field];
          }
        }
      }

      // let isNameExist = await Group.findOne({ name: group?.name });

      // // validate email exist
      // if (isNameExist) {
      //   console.log("pre-finded group id", group?._id);
      //   console.log("Current-finded group id", isNameExist?._id);

      //   if (isNameExist?._id != group?._id) {
      //     res.status(400).json({
      //       status: "fail",
      //       error: "-------Try another group name ",
      //     });
      //   }
      // } else {
      //   // Save the updated group document
      const updatedGroup = await group.save();

      updatedGroup &&
        res.status(200).json({
          status: "success",
          message: "Group updated successfully",
          data: updatedGroup,
        });
      // }
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

  deleteGroup: async (req, res) => {
    try {
      const groupId = req.params?.groupId;

      let deletedResult = await Group.findByIdAndDelete(groupId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Group deleted",
          data: deletedResult,
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
};
