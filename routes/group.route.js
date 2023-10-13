const express = require("express");
const router = express.Router();

// require controller
const groupController = require("../controllers/group.controller");

// require middleware
const { authenticateAdmin } = require("../middleware/admin.auth");
//----------------------------------------------------------------------------

//               CRUD
//----------------------------------------------------------------------------

// add-group
router.post("/", authenticateAdmin, groupController.addGroup);

// get all groups
router.get("/", groupController.getAllGroup);

// get single group
router.get("/:groupId", groupController.getGroupById);

// //-----------Update Data----------------------

// dynamic update any field(Single or multiple) of group(only by admin)
router.put("/:groupId", authenticateAdmin, groupController.updateGroup);

//---Delete Group by id

router.delete("/:groupId", authenticateAdmin, groupController.deleteGroup);

module.exports = router;
