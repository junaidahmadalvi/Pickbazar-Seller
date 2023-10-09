const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const authorModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    quote: {
      type: String,
    },
    bio: {
      type: String,
    },
    approval: {
      type: Boolean,
      default: true,
    },
    birthDate: {
      type: Date,
    },
    deathDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

//---------- Author Yup(validating schemas)---------

// Yup register author schema
const addAuthorSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),

  avatar: yup.string(),
  quote: yup.string(),
  bio: yup.string(),

  approval: yup.boolean().default(true),
  birthDate: yup.date(),

  deathDate: yup.date(),
});

const authorUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),

  avatar: yup.string(),
  quote: yup.string(),
  bio: yup.string(),

  approval: yup.boolean().default(true),

  birthDate: yup.date(),

  deathDate: yup.date(),
});

// <============create collection============>
const Author = new mongoose.model("Author", authorModel);

module.exports = {
  Author,
  addAuthorSchema,
  authorUpdateSchema,
};
