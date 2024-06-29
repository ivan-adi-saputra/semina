const express = require("express");
const router = express();
const { create, index, find, update, destroy } = require("./controller");
const {
  authenticatedUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get("/payments", authenticatedUser, authorizeRoles("organizer"), index);
router.get(
  "/payments/:id",
  authenticatedUser,
  authorizeRoles("organizer"),
  find
);
router.put(
  "/payments/:id",
  authenticatedUser,
  authorizeRoles("organizer"),
  update
);
router.delete(
  "/payments/:id",
  authenticatedUser,
  authorizeRoles("organizer"),
  destroy
);
router.post(
  "/payments",
  authenticatedUser,
  authorizeRoles("organizer"),
  create
);

module.exports = router;
