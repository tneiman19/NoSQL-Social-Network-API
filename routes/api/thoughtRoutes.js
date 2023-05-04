const express = require("express");
const router = express.Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

router.get("/", getThoughts);
router.post("/", createThought);
router.get("/:thoughtId", getSingleThought);
router.put("/:thoughtId", updateThought);
router.delete("/:thoughtId", deleteThought);
router.post("/thoughtId/reactions", addReaction);
router.delete("/:thoughtId/reactions/:reactionId", deleteReaction);

module.exports = router;
