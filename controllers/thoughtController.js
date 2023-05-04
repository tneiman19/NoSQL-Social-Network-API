const { Thought, User } = require("../models"); // Import the "Thought" and "User" models

const thoughtController = {
  getThoughts: async (req, res) => {
    try {
      const thought = await Thought.find();
      if (thoughts.length === 0) {
        return res.status(404).json({ message: "No thoughts found" });
      }
    } catch (error) {
      res.status(500).json(err);
    }
  },

  // Function to get all thoughts
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      if (thoughts.length === 0) {
        return res.status(404).json({ message: "No thoughts found" });
      }
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Function to get a single thought by ID
  getSingleThought: async (req, res) => {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId }).select("-__v"); // Use the "Thought" model to find a thought by ID
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createThought: async (req, res) => {
    try {
      const createdThought = await Thought.create(req.body); // Use the "Thought" model to create a new thought
      await User.findOneAndUpdate(
        // Use the "User" model to add the new thought to the user's thoughts array
        { _id: req.body.userId },
        { $addToSet: { thoughts: createdThought._id } },
        { new: true }
      );
      res.json(createdThought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  updateThought: async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteThought: async (req, res) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json({ message: "Thought deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add reaction to thought by ID
  addReaction: async (req, res) => {
    try {
      const createdReaction = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!createdReaction) {
        return res.status(404).json({ message: "No thought with that ID was found!" });
      }

      await User.findOneAndUpdate(
        { _id: createdReaction.userId },
        { $addToSet: { thoughts: createdReaction._id } },
        { new: true }
      );

      return res.json(createdReaction);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // Delete reaction by reaction ID
  deleteReaction: async (req, res) => {
    try {
      // Check if the reaction ID exists in the thought's reactions array
      const thought = await Thought.findOneAndUpdate(
        {
          _id: req.params.thoughtId,
          reactions: { $elemMatch: { reactionId: req.params.reactionId } },
        },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No reaction with that ID" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
