const express = require("express");
const router = express.Router();

// require controller
const customerController = require("../controllers/customer.controller");

// require middleware
const { authenticateCustomer } = require("../middleware/customer.auth");
//----------------------------------------------------------------------------

//              User CRUD
//----------------------------------------------------------------------------

// customer Register
router.post("/", customerController.registerCustomer);

// Customer Login
router.post("/login", customerController.loginCustomer);

// get all customers
router.get("/", customerController.getAllCustomer);

// get single customer
router.get("/:customerId", customerController.getCustomerById);

// //-----------Update Data----------------------

// dynamic update any field of customer (Single or multiple)
router.put("/", authenticateCustomer, customerController.updateCustomer);

//endpoint to update customer address(nested document)
router.put(
  "/addresses",
  authenticateCustomer,
  customerController.updateCustomerAddresses
);

//---Delete Customer by id

router.delete("/:customerId", customerController.deleteCustomer);

module.exports = router;
