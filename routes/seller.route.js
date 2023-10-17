const express = require("express");
const router = express.Router();

// require controller
const sellerController = require("../controllers/seller.controller");

//----------------------------------------------------------------------------

// get single seller
router.get("/", sellerController.getSellerById);

// //-----------Update Data----------------------

// dynamic update any field of seller (Single or multiple)
router.put("/", sellerController.updateSeller);

//endpoint to update seller Password
router.put(
  "/password",

  sellerController.updateSellerPassword
);

// <---------Group--------->

// get all groups
router.get("/groups", sellerController.getAllGroup);

// get single group
router.get("/group/:groupId", sellerController.getGroupById);

// <---------Author--------->

// add-author
router.post("/addAuthor", sellerController.addAuthor);

// get all authors
router.get("/authors", sellerController.getAllAuthor);

module.exports = router;
