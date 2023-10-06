const express = require("express");
const router = express.Router();

// const {
//   setUser,
//   getUser,
//   logoutUser,
//   changePassword,
// } = require('../controllers/userController');

// require controller
const customerController = require("../controllers/customer.controller");

// require middleware
const { authenticateCustomer } = require("../middleware/customer.auth");
//----------------------------------------------------------------------------

//              User CRUD
//----------------------------------------------------------------------------

// router.get('/users', userController.getUser );0

router.post("/", customerController.registerCustomer);

router.post("/login", customerController.loginCustomer);

// get all customers
router.get("/", customerController.getAllCustomer);

// get single customer
router.get("/:customerId", customerController.getCustomerById);

// //-----------Update Data----------------------

// // router.use(express.json())
router.put("/", authenticateCustomer, customerController.updateCustomerInfo);

//-------update User STATUS --------------
router.patch(
  "/:fieldName",
  authenticateCustomer,
  customerController.updateCustomerProperty
);

//---Delete Customer by id

router.delete("/:customerId", customerController.deleteCustomer);

module.exports = router;
