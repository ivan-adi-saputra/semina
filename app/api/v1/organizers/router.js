const express = require("express");
const router = express();
const { createCMSOrganizer, createCMSUser } = require("./controller");
const {
  authenticatedUser,
  //   authorizeRoles,
} = require("../../../middlewares/auth");

router.post("/organizer", createCMSOrganizer);
router.post("/user", authenticatedUser, createCMSUser);

module.exports = router;
