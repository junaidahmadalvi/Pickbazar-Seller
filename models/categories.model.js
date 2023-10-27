const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const categoryModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference to the "Group" model
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

//---------- Category Yup(validating schemas)---------

// Yup register category schema
const addCategorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),
  groupId: yup
    .string()
    .trim()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Group ID format"), // Ensure it's a valid ObjectId

  groupName: yup.string().required("Group Name is required"),

  icon: yup.string(),

  description: yup.string(),
});

const categoryUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),
  groupId: yup
    .string()
    .trim()
    // .required("Group ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Group ID format"), // Ensure it's a valid ObjectId

  groupName: yup.string().required("Group Name is required"),

  icon: yup.string(),

  description: yup.string(),
});

// <============create collection============>
const Category = new mongoose.model("Category", categoryModel);

module.exports = {
  Category,
  addCategorySchema,
  categoryUpdateSchema,
};
