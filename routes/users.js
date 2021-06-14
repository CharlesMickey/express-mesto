const router = require("express").Router();
const {
  getAllUsers,
  getInfoProfile,
  getUserId,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/me", getInfoProfile);
router.get("/users/:userId", getUserId);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
