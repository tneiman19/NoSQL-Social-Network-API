const { User, Thought } = require("../models");

const userController = {
  // Get all users
  getUsers: async (req, res) => {
    try {
      const users = await User.find({}).populate("thoughts"); //.populate("friends");
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Get a single user
  getSingleUser: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .select("-__v");
      if (!user) {
        res.status(404).json({ message: "No user with that ID" });
      } else {
        res.json({ user });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // create a new User
  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update an existing user
  updateUser: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.userId }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        res.status(404).json({ message: "No user with that ID" });
      } else {
        res.json({ user });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and associated thoughts
  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and associated thoughts were deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend's ID to a user's friend list
  updateFriend: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json({ user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove a friend's ID from a user's friend list
  deleteFriend: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json({ user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
