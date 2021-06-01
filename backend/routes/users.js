const router = require("express").Router();
const { getAllUsers, getUserId, createUser, updateProfile, updateAvatar } = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/:userId", getUserId);
router.post("/users", createUser);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
