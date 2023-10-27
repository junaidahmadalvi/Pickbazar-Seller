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

// <-------------categories----------->

// get all categories
router.get("/categories", sellerController.getAllCategory);
// get single category
router.get("/category/:categoryId", sellerController.getCategoryById);

// <----------Products------------------------>

// add-product
router.post("/addProduct", sellerController.addProduct);
// get all product
router.get("/products", sellerController.getAllShopProduct);
// get single product
router.get("/product/:productId", sellerController.getShopProductById);
// dynamic update any field(Single or multiple) of product
router.put("/updateProduct/:productId", sellerController.updateProduct);
//---Delete Product by id
router.delete("/deleteProduct/:productId", sellerController.deleteProduct);

// <---------Author--------->

// add-author
router.post("/addAuthor", sellerController.addAuthor);

// get all authors
router.get("/authors", sellerController.getAllAuthor);

// <----------------Manufacturer--------------------->

// add-manufacturer
router.post("/addManufacturer", sellerController.addManufacturer);
// get all manufacturers
router.get("/manufacturers", sellerController.getAllManufacturer);

// <---------shops---------->

router.post("/addShop", sellerController.addShop);
// get single author
router.get("/shop/:shopId", sellerController.getShopById);
// dynamic update any field(Single or multiple) of author(only by admin)
router.put("/updateShop/:shopId", sellerController.updateShop);
// update shop address after validation
router.patch("/shopAddress/:shopId", sellerController.updateShopAddresses);

module.exports = router;
