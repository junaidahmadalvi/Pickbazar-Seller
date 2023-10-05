const { Customer, customerYupSchema } = require("../models/customerModel");

var ObjectId = require("mongodb").ObjectId;

const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  registerCustomer: async (req, res) => {
    try {
      const customerData = req.body;
      console.log("customerData", customerData);
      customerData &&
        (await customerYupSchema.validate(customerData, { abortEarly: false }));

      let customer = await Customer.findOne({ email: customerData?.email });

      // validate email exist
      if (customer) {
        res.status(400).json({
          status: "fail",
          error: "email already exist",
        });
      } else {
        // validate password and confirmPassword match
        if (customerData?.password != customerData?.confirmPassword) {
          res.status(400).json({
            status: "fail",
            error: "Password and Confirm Password must same",
          });
        } else {
          customer = new Customer(customerData);
          // console.log("customer", customer);

          const result = await customer.save();
          console.log("result", result);

          res.status(200).send({
            status: "success",
            message: "Student added Successfully",
            data: result,
          });
        }
      }
    } catch (error) {
      console.log("-----errors-------", error);
      if (error.name === "ValidationError") {
        const validationErrors = {};
        // console.log("error.inner", error.inner);
        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        // console.log("-----entries-------", entries);

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

  // login
  // loginUser: async (req, res) => {
  //   try {
  //     const { email, password } = req.body;

  //     console.log(email);
  //     console.log(password);
  //     //   if (email && password) {

  //     if (!email || !password) {
  //       return res
  //         .status(400)
  //         .send({ status: "failed", message: "All fields are Required" });
  //     } else {
  //       if (emailvalidator.validate(req.body.email)) {
  //         // let user = connection();
  //         let user = await User.findOne({ email: email });
  //         if (user != null) {
  //           // check given password match with DB password of particular user OR not and return true/false
  //           const isMatch = await bcrypt.compare(password, user.password);
  //           console.log("Password match", isMatch);

  //           if (user.email === email && isMatch) {
  //             if (user.status === "enable") {
  //               // Generate JWT Token
  //               const token = jwt.sign(
  //                 { userID: user._id },
  //                 process.env.JWT_SECRET_KEY,
  //                 { expiresIn: "2d" }
  //               );

  //               // let headerToken = req.headers["authorization"];
  //               // console.log(
  //               //   "before------headerToken",
  //               //   req.headers["authorization"]
  //               // );

  //               // Send the token in the response header
  //               // console.log("token", token);
  //               res.setHeader("Authorization", `Bearer ${token}`);

  //               // console.log("headerToken", req.headers["authorization"]);

  //               res.status(200).send({
  //                 status: "success",
  //                 message: "Login Success",
  //                 token: token,
  //                 user: user,
  //               });
  //             } else {
  //               res.status(400).send({
  //                 status: "failed",
  //                 message: "Access Denied by Admin",
  //               });
  //               console.log("User Access Denied by Admin");
  //             }
  //           } else {
  //             res.status(400).send({
  //               status: "failed",
  //               message: "Email or password is not Valid",
  //             });
  //           }
  //         } else {
  //           res.status(400).send({
  //             status: "failed",
  //             message: "Email or password is not Valid",
  //           });
  //           // this log generated for debuging that tell email not found in user collection
  //           console.log("Email not Found");
  //         }
  //       } else {
  //         res.status(400).send({
  //           message: "Invalid Email",
  //         });
  //         console.log("Invalid Email Formate");
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     res.status(500).send({ message: "Server Error", Error: e });
  //   }
  // },

  // // show  all Users
  // getAllUsers: async (req, res) => {
  //   try {
  //     let student = await Student.find();

  //     if (student) {
  //       res.status(200).send({ student });
  //     } else {
  //       res.status(400).send({ message: "No Student found" });
  //     }
  //   } catch (e) {
  //     res.status(500).send({ message: "Server Error", Error: e });
  //     console.log(e);
  //   }
  // },

  // getUserById: async (req, res) => {
  //   try {
  //     const id = req.params.userId;
  //     console.log("id at controller", id);
  //     let user = await User.findById(id);
  //     console.log("user at controller", user);

  //     // console.log(getresult);

  //     if (user) {
  //       res.status(200).send({ status: "success", user: user });
  //     } else {
  //       res.status(400).send({ status: "failed", message: "User not found" });
  //     }
  //   } catch (e) {
  //     res.status(500).send({ message: "Server Error", Error: e });
  //     console.log(e);
  //   }
  // },

  // updateUser: async (req, res) => {
  //   try {
  //     const std_id = req.params.std_id;

  //     let { name, subject, grads, marks, date } = req.body;

  //     await studentSchemaValidation.validate(
  //       { name, subject, grads, marks, date },
  //       { abortEarly: false }
  //     ); // Validate the data

  //     const updateResult = await Student.updateOne(
  //       { _id: std_id },
  //       { $set: { name, subject, grads, marks, date } }
  //     );

  //     if (updateResult.modifiedCount === 1) {
  //       res.status(200).send({
  //         message: "Student updated",
  //         student: updateResult,
  //       });
  //     } else {
  //       res.status(400).send({ message: "Student not found" });
  //     }
  //   } catch (error) {
  //     if (error.name === "ValidationError") {
  //       const validationErrors = {};

  //       error.inner.forEach((validationError) => {
  //         validationErrors[validationError.path] = validationError.message;
  //       });

  //       const entries = Object.entries(validationErrors);

  //       res.status(400).json({ errors: entries[0][1] });
  //     } else {
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }
  // },

  // updateUserStatus: async (req, res) => {
  //   try {
  //     // const adminId = req.params.adminId;
  //     const userId = req.params.userId;
  //     console.log(userId, "userId");
  //     // let updateResult = connection();
  //     console.log(req.body.status, "user status");
  //     if (req?.body?.status === "enable") {
  //       const updateResult = await User.updateOne(
  //         { _id: userId },
  //         { $set: { status: "disable" } }
  //       );
  //       console.log(updateResult, "updateResult");
  //       if (updateResult.modifiedCount === 1) {
  //         res.status(200).send({
  //           status: "success",
  //           message: "User updated",
  //           user: updateResult,
  //         });
  //       } else {
  //         res.status(400).send({ status: "failed", message: "User not found" });
  //       }
  //     } else if (req?.body?.status === "disable") {
  //       const updateResult = await User.updateOne(
  //         { _id: userId },
  //         { $set: { status: "enable" } }
  //       );

  //       if (updateResult.modifiedCount === 1) {
  //         res.status(200).send({
  //           status: "success",
  //           message: "User updated",
  //           user: updateResult,
  //         });
  //       } else {
  //         res.status(400).send({ status: "failed", message: "User not found" });
  //       }
  //     } else {
  //       res.status(400).send({ status: "failed", message: "Invalid Input" });
  //     }
  //   } catch (e) {
  //     res.status(500).send({
  //       message: "Server Error",
  //       Error: e,
  //     });
  //     console.log(e, "error");
  //   }
  // },
  // deleteUser: async (req, res) => {
  //   try {
  //     const std_id = req.params.std_id;

  //     let deletedResult = await Student.findByIdAndDelete(std_id);

  //     if (deletedResult) {
  //       res.status(200).send({
  //         message: "User deleted",
  //         User: deletedResult,
  //       });
  //     } else {
  //       res.status(400).send({ status: "failed", message: "User not found" });
  //     }
  //   } catch (e) {
  //     debugger;

  //     res.status(500).send({ message: "Server Error", Error: e });
  //     console.log(e, "Error");
  //   }
  // },
};
