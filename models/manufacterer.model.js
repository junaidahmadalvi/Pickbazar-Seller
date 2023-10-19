const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const manufacturerModel = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference to the "Group" model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    approval: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//---------- Manufacturer Yup(validating schemas)---------

const yupManufacturerSchema = yup.object().shape({
  groupId: yup
    .string()
    .trim()
    .required("Group ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Group ID format"), // Ensure it's a valid ObjectId

  name: yup
    .string()
    .required("Name is required")
    .matches(/^[A-Za-z0-9\s]+$/, "Symbols are not allowd in name"),
  logo: yup.string().url("Invalid URL format"),

  website: yup.string().url("Invalid URL format"),

  description: yup.string(),

  approval: yup.boolean().default(true),
});

// <============create collection============>
const Manufacturer = new mongoose.model("Manufacturer", manufacturerModel);

module.exports = {
  Manufacturer,
  yupManufacturerSchema,
};
