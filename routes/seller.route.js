const express = require("express");
const router = express.Router();

// require controller
const sellerController = require("../controllers/seller.controller");

// require middleware
const { authenticateSeller } = require("../middleware/seller.auth");
const { authenticateAdmin } = require("../middleware/admin.auth");
//----------------------------------------------------------------------------

//              User CRUD
//----------------------------------------------------------------------------

// seller Register
router.post("/", sellerController.registerSeller);

// Seller Login
router.post("/login", sellerController.loginSeller);

// get all sellers
router.get("/", authenticateAdmin, sellerController.getAllSeller);

// get single seller
router.get("/:sellerId", authenticateSeller, sellerController.getSellerById);

// //-----------Update Data----------------------

// dynamic update any field of seller (Single or multiple)
router.put("/", authenticateSeller, sellerController.updateSeller);

//endpoint to update seller Password
router.put(
  "/password",
  authenticateSeller,
  sellerController.updateSellerPassword
);
//---Delete Seller by id

router.delete("/:sellerId", authenticateAdmin, sellerController.deleteSeller);

module.exports = router;
