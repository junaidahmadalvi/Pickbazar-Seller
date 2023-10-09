const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const sellerModel = new mongoose.Schema(
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
    status: {
      type: String,
      default: "active",
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

const pakistanPhoneNumberRegex = /^(?:\+92|0)[1-9]\d{9}$/; // Pakistan phone number pattern

//---------- Seller Yup(validating schemas)---------

// Yup register seller schema
const sellerRegisterSchema = yup.object().shape({
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

  status: yup.string().default("active"),

  bio: yup.string(),
  avatar: yup.string(),

  contactNumber: yup
    .string()
    .matches(
      pakistanPhoneNumberRegex,
      "Contact number must in 03XXXXXXXXX format"
    ),
});

// Yup Login seller schema
const sellerLoginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password length must be 4"),
});

const sellerUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Only alphabets and spaces are allowed in the name"
    ),

  email: yup.string().email("Invalid email format"),

  password: yup.string().min(4, "Password length must be 4"),

  status: yup.string().default("active"),

  avatar: yup.string(),

  wallet: yup.number().positive("Wallet must be a positive number"),

  bio: yup.string(),

  contactNumber: yup
    .string()
    .matches(
      pakistanPhoneNumberRegex,
      "Contact number must in 03XXXXXXXXX format"
    ),
});

// <============create collection============>
const Seller = new mongoose.model("Seller", sellerModel);

module.exports = {
  Seller,
  sellerRegisterSchema,
  sellerLoginSchema,
  sellerUpdateSchema,
};
