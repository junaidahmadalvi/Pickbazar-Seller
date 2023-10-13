const express = require("express");
const router = express.Router();

// require controller
const loginAuthController = require("../controllers/loginauth.controller");

//  Login route for all users
router.post("/", loginAuthController.loginUser);

module.exports = router;
