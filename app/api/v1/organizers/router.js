const express = require("express");
const router = express();
const {
  createCMSOrganizer,
  createCMSUser,
  getCMSUser,
} = require("./controller");
const {
  authenticatedUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get("/user", authenticatedUser, authorizeRoles("owner"), getCMSUser);
router.post(
  "/organizer",
  authenticatedUser,
  authorizeRoles("owner"),
  createCMSOrganizer
);
router.post(
  "/user",
  authenticatedUser,
  authorizeRoles("organizer"),
  createCMSUser
);

module.exports = router;
