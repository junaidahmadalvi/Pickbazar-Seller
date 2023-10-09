const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const {
  Customer,
  customerRegisterSchema,
  customerLoginSchema,
  customerUpdateSchema,
  customerAddressesUpdateSchema,
} = require("../models/customer.model");

module.exports = {
  registerCustomer: async (req, res) => {
    try {
      let customerData = req.body;

      customerData &&
        (await customerRegisterSchema.validate(customerData, {
          abortEarly: false,
        }));

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
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashpswd = await bcrypt.hash(customerData?.password, salt);
          console.log("hashpswd", hashpswd);
          let requestData = {
            name: customerData?.name,
            email: customerData?.email,
            password: hashpswd,
          };
          // if (req?.body && req?.body?.status) {
          //   requestData?.status = req?.body?.status;
          // }
          console.log("requestData", requestData);

          customer = new Customer(requestData);

          console.log("customer", customer);

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

  // Customer login controller
  loginCustomer: async (req, res) => {
    try {
      const customerData = req.body;

      customerData &&
        (await customerLoginSchema.validate(customerData, {
          abortEarly: false,
        }));
      const { email, password } = req.body;
      let customer = await Customer.findOne({ email: email });

      if (customer != null) {
        // check given password match with DB password of particular customer OR not and return true/false
        console.log("DB Passsword", customer.password);
        console.log("given Passsword", password);
        const isMatch = await bcrypt.compare(password, customer?.password);
        console.log("Password match", isMatch);

        if (customer.email === email && isMatch) {
          if (customer.status === "active") {
            // Generate JWT Token
            const token = jwt.sign(
              { customerId: customer._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );

            // console.log("token", token);
            res.setHeader("Authorization", `Bearer ${token}`);

            //remove password field from customer object
            delete customer?.password;
            console.log("--------customer--------", customer);
            res.status(200).send({
              status: "success",
              message: "Login Success",
              token: token,
              data: customer,
            });
          } else {
            res.status(400).send({
              status: "fail",
              error: "Access Denied by Admin",
            });
            console.log("Customer Access Denied by Admin");
          }
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

  // // show  all Customers
  getAllCustomer: async (req, res) => {
    try {
      // get all customers data except password property
      let customer = await Customer.find({}, "-password");

      if (customer) {
        res.status(200).send({
          status: "success",
          message: "Customers got successfully",
          data: customer,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Customer not found",
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

  getCustomerById: async (req, res) => {
    try {
      const customerId = req.params?.customerId;
      console.log("id at controller", customerId);

      // get desired customer data except password
      const customer = await Customer.findById(customerId, "-password");
      console.log("customer", customer);

      if (customer) {
        res.status(200).send({
          status: "success",
          message: "Customer founded",
          data: customer,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Customer not found",
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

  updateCustomer: async (req, res) => {
    try {
      const customerId = req.customerId;

      console.log("customerId", customerId);
      const updateFields = req.body;
      console.log("fields got from body to update----", updateFields);
      // Get the customer document by ID

      updateFields &&
        (await customerUpdateSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const customer = await Customer.findById(customerId);

      if (!customer) {
        return res
          .status(404)
          .json({ status: "fail", error: "Customer not found" });
      }

      console.log("customer object before update--", customer);
      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the customer schema
          if (customer.schema.path(field)) {
            // Update the field with the new value
            customer[field] = updateFields[field];
          }
        }
      }
      console.log("customer object after update------------", customer);

      // Save the updated customer document
      const updatedCustomer = await customer.save();

      res.status(200).json({
        status: "success",
        message: "Credential(s) updated successfully",
        data: updatedCustomer,
      });
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

  updateCustomerAddresses: async (req, res) => {
    try {
      const customerId = req.customerId;
      const { title } = req.body; // geting adresss-type('shipping' or 'billing') from request body

      // Validate that title is provided and is either 'shipping' or 'billing'
      if (!title || (title !== "shipping" && title !== "billing")) {
        return res
          .status(400)
          .json({ status: "fail", error: "Invalid address type" });
      }

      // Get the customer document by ID
      const customer = await Customer.findById(customerId);

      if (!customer) {
        return res
          .status(404)
          .json({ status: "fail", error: "Customer not found" });
      }

      req?.body &&
        (await customerAddressesUpdateSchema.validate(req?.body, {
          abortEarly: false,
        }));

      // Update the address based on the specified title
      if (title === "shipping") {
        const { title, country, city, state, zip, streetAddress } = req.body;
        customer.addresses.shippingAddress = {
          title,
          country,
          city,
          state,
          zip,
          streetAddress,
        };
      } else if (title === "billing") {
        const { title, country, city, state, zip, streetAddress } = req.body;
        customer.addresses.billingAddress = {
          title,
          country,
          city,
          state,
          zip,
          streetAddress,
        };
      }

      // Save the updated customer document
      const updatedCustomer = await customer.save();

      res.status(200).json({
        status: "success",
        message: `${title} address updated successfully`,
        data: updatedCustomer,
      });
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

  deleteCustomer: async (req, res) => {
    try {
      const customerId = req.params?.customerId;

      let deletedResult = await Customer.findByIdAndDelete(customerId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Customer deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Customer not found",
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
