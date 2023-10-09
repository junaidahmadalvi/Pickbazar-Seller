const express = require("express");
const router = express.Router();

// require controller
const authorController = require("../controllers/author.controller");

// require middleware
const { authenticateAdmin } = require("../middleware/admin.auth");
//----------------------------------------------------------------------------

//               CRUD
//----------------------------------------------------------------------------

// add-author
router.post("/", authorController.addAuthor);

// get all authors
router.get("/", authorController.getAllAuthor);

// get single author
router.get("/:authorId", authorController.getAuthorById);

// //-----------Update Data----------------------

// dynamic update any field(Single or multiple) of author(only by admin)
router.put("/:authorId", authenticateAdmin, authorController.updateAuthor);

//---Delete Author by id

router.delete("/:authorId", authenticateAdmin, authorController.deleteAuthor);

module.exports = router;
