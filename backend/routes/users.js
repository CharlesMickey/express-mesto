const router = require("express").Router();
const { getAllUsers, getUserId, createUser } = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/:userId", getUserId);
router.post("/users", createUser);
