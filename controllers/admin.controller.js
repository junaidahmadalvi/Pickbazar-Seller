const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const {
  Admin,
  adminRegisterSchema,
  adminLoginSchema,
} = require("../models/admin.model");

module.exports = {
  registerAdmin: async (req, res) => {
    try {
      let adminData = req.body;

      adminData &&
        (await adminRegisterSchema.validate(adminData, {
          abortEarly: false,
        }));

      let admin = await Admin.findOne({ email: adminData?.email });

      // validate email exist
      if (admin) {
        res.status(400).json({
          status: "fail",
          error: "email already exist",
        });
      } else {
        // validate password and confirmPassword match
        if (adminData?.password != adminData?.confirmPassword) {
          res.status(400).json({
            status: "fail",
            error: "Password and Confirm Password must be same",
          });
        } else {
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashpswd = await bcrypt.hash(adminData?.password, salt);

          let requestData = {
            name: adminData?.name,
            email: adminData?.email,
            password: hashpswd,
          };

          admin = new Admin(requestData);

          const result = await admin.save();

          res.status(200).send({
            status: "success",
            message: "Admin added Successfully",
            data: result,
          });
        }
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
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  // Admin login controller
  loginAdmin: async (req, res) => {
    try {
      const adminData = req.body;

      adminData &&
        (await adminLoginSchema.validate(adminData, {
          abortEarly: false,
        }));
      const { email, password } = req.body;
      let admin = await Admin.findOne({ email: email });

      if (admin != null) {
        // check given password match with DB password of particular admin OR not and return true/false

        const isMatch = await bcrypt.compare(password, admin?.password);

        if (admin.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
          );

          res.setHeader("Authorization", `Bearer ${token}`);

          //remove password field from admin object
          delete admin?.password;
          res.status(200).send({
            status: "success",
            message: "Login Success",
            token: token,
            data: admin,
          });
        } else {
          res.status(400).json({
            status: "fail",
            error: "Email or password is not Valid",
          });
        }
      } else {
        res.status(400).json({
          status: "fail",
          error: "Email or password is not Valid",
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

  // // show  all Admins
  getAllAdmin: async (req, res) => {
    try {
      // get all admins data except password property
      let admin = await Admin.find({}, "-password");

      if (admin) {
        res.status(200).send({
          status: "success",
          message: "Admins got successfully",
          data: admin,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Admin not found",
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

  getAdminById: async (req, res) => {
    try {
      const adminId = req.params?.adminId;

      // get desired admin data except password
      const admin = await Admin.findById(adminId, "-password");

      if (admin) {
        res.status(200).send({
          status: "success",
          message: "Admin founded",
          data: admin,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Admin not found",
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
