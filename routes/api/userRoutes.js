const express = require("express");
const router = express.Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  updateFriend,
  deleteFriend,
} = require("../../controllers/userController");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getSingleUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);
router.post("/:userId/friends/:friendId", updateFriend);
router.delete("/:userId/friends/:friendId", deleteFriend);

module.exports = router;
