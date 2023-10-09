const express = require("express");
const router = express.Router();

// require controller
const adminController = require("../controllers/admin.controller");

// require middleware
const { authenticateAdmin } = require("../middleware/admin.auth");
//----------------------------------------------------------------------------

//              User CRUD
//----------------------------------------------------------------------------

// admin Register
router.post("/", adminController.registerAdmin);

// Admin Login
router.post("/login", adminController.loginAdmin);

// get all admins
router.get("/", authenticateAdmin, adminController.getAllAdmin);

// get single admin
router.get("/:adminId", authenticateAdmin, adminController.getAdminById);

module.exports = router;
