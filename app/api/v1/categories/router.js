const express = require("express");
const router = express();
const { index, create, find, update, destroy } = require("./controller");
const {
  authenticatedUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get(
  "/categories",
  authenticatedUser,
  authorizeRoles("organizer"),
  index
);
router.post(
  "/categories",
  authenticatedUser,
  authorizeRoles("organizer"),
  create
);
router.get(
  "/categories/:id",
  authenticatedUser,
  authorizeRoles("organizer"),
  find
);
router.put(
  "/categories/:id",
  authenticatedUser,
  authorizeRoles("organizer"),
  update
);
router.delete(
  "/categories/:id",
  authenticatedUser,
  authenticatedUser,
  authorizeRoles("organizer"),
  destroy
);

module.exports = router;
