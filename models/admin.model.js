const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const adminModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      // required: true
    },
  },
  { timestamps: true }
);

const pakistanPhoneNumberRegex = /^(?:\+92|0)[1-9]\d{9}$/; // Pakistan phone number pattern

//---------- Admin Yup(validating schemas)---------

// Yup register admin schema
const adminRegisterSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password length must be 4"),

  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .min(4, "Confirm Password length must be 4"),
});

// Yup Login admin schema
const adminLoginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password length must be 4"),
});

// <============create collection============>
const Admin = new mongoose.model("Admin", adminModel);

module.exports = {
  Admin,
  adminRegisterSchema,
  adminLoginSchema,
};
