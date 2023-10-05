const express = require("express");
const router = express.Router();

// const {
//   setUser,
//   getUser,
//   logoutUser,
//   changePassword,
// } = require('../controllers/userController');

// require controller
const customerController = require("../controllers/customerController");

// require middleware
// const {
//   authorizeAdmin,
//   authenticateUser,
// } = require("../middleware/authMiddleware");
//----------------------------------------------------------------------------

//              User CRUD
//----------------------------------------------------------------------------

// router.get('/users', userController.getUser );0

router.post("/", customerController.registerCustomer);

// router.post("/login", userController.loginUser);

// router.get("/", authenticateUser, authorizeAdmin, userController.getAllUsers);

// router.get("/:userId", authenticateUser, userController.getUserById);

// //-----------Update Data----------------------

// // router.use(express.json())
// router.put("/:userId", authenticateUser, userController.updateUser);
// //-------update User STATUS --------------
// router.patch(
//   "/status/:userId",
//   authenticateUser,
//   authorizeAdmin,
//   userController.updateUserStatus
// );

// //----------Delete Records -----------------------

// router.delete(
//   "/:userId",
//   authenticateUser,
//   authorizeAdmin,
//   userController.deleteUser
// );

module.exports = router;
