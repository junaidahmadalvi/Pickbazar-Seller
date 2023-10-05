const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const customerModel = new mongoose.Schema(
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
    wallet: {
      type: Number,
    },
    bio: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    addresses: {
      billingAddress: {
        title: {
          type: String,
          // required: true,
        },
        country: {
          type: String,
          // required: true,
        },
        city: {
          type: String,
          // required: true,
        },
        state: {
          type: String,
          // required: true,
        },
        zip: {
          type: Number,
          // required: true,
        },
        streetAddress: {
          type: String,
          // required: true,
        },
      },

      shippingAddress: {
        title: {
          type: String,
          // required: true,
        },
        country: {
          type: String,
          // required: true,
        },
        city: {
          type: String,
          // required: true,
        },
        state: {
          type: String,
          // required: true,
        },
        zip: {
          type: Number,
          // required: true,
        },
        streetAddress: {
          type: String,
          // required: true,
        },
      },
    },
  },
  { timestamps: true }
);

const pakistanPhoneNumberRegex = /^(?:\+92|0)[1-9]\d{9}$/; // Pakistan phone number pattern

// Customer Yup(validating schema)
const customerYupSchema = yup.object().shape({
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

  wallet: yup.number().positive("Wallet must be a positive number"),

  bio: yup.string(),

  contactNumber: yup
    .string()
    .matches(
      pakistanPhoneNumberRegex,
      "Contact number must in 03XXXXXXXXX format"
    ),

  addresses: yup.object().shape({
    billingAddress: yup.object().shape({
      title: yup.string(),
      country: yup.string(),
      city: yup.string(),
      state: yup.string(),
      zip: yup
        .number()
        .positive("Billing address Zip must be a positive number")
        .max(100000, "Billing address Zip should be a 4-digit number"),
      streetAddress: yup.string(),
    }),
    shippingAddress: yup.object().shape({
      title: yup.string(),
      country: yup.string(),
      city: yup.string(),
      state: yup.string(),
      zip: yup
        .number()
        .positive("Billing address Zip must be a positive number")
        .max(100000, "Billing address Zip should be a 4-digit number"),
      streetAddress: yup.string(),
    }),
  }),
});

// <============create collection============>
const Customer = new mongoose.model("Customer", customerModel);

module.exports = { Customer, customerYupSchema };
