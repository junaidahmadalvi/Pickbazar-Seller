const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const groupModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sliderImage: {
      type: String,
    },
  },
  { timestamps: true }
);

//---------- Group Yup(validating schemas)---------

// Yup register group schema
const addGroupSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),

  icon: yup.string(),

  title: yup.string().required("title is required"),

  description: yup.string().required("description is required"),

  sliderImage: yup.string(),
});

const groupUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),

  icon: yup.string(),

  title: yup.string(),

  description: yup.string(),

  sliderImage: yup.string(),
});

// <============create collection============>
const Group = new mongoose.model("Group", groupModel);

module.exports = {
  Group,
  addGroupSchema,
  groupUpdateSchema,
};
