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

// <---------shops---------->
router.post("/addShop", sellerController.addShop);
// get single author
router.get("/shop/:shopId", sellerController.getShopById);
// dynamic update any field(Single or multiple) of author(only by admin)
router.put("/updateShop/:shopId", sellerController.updateShop);
// update shop address after validation
router.patch("/shopAddress/:shopId", sellerController.updateShopAddresses);

module.exports = router;
