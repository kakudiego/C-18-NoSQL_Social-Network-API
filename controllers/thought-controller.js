const { Thought, User } = require('../models');

const thoughtController = {
  // get all thought
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.ThoughtId })
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // add thought to user
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate({ _id: params.userId }, { $push: { comments: _id } }, { new: true });
      })
      .then((dbUserData) => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // update thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.ThoughtId }, body, { new: true, runValidators: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // create Reaction to thought
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.commentId }, { $push: { replies: body } }, { new: true, runValidators: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // delete thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate({ _id: params.userId }, { $pull: { comments: params.commentId } }, { new: true });
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // delete Reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate({ _id: params.commentId }, { $pull: { replies: { ReactionId: params.ReactionId } } }, { new: true })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
