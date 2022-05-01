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

  // get a single thought by its id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
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

  // getThoughtById(req, res) {
  //   Thought.findOne({ _id: req.params.Id })
  //     .populate({
  //       path: 'reactions',
  //       select: '-__v',
  //     })
  //     .select('-__v')
  //     .sort({ _id: -1 })
  //     .then((dbThoughtData) => {
  //       if (!dbThoughtData) {
  //         res.status(404).json({ message: 'No thought found with this id!' });
  //         return;
  //       }
  //       res.json(dbThoughtData);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.sendStatus(400);
  //     });
  // },

  // create a new thought
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate({ _id: params.userId }, { $push: { thoughts: _id } }, { new: true });
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

  // update a thought by its _id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // remove a thought by its _id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.Id })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate({ _id: params.userId }, { $pull: { thoughts: params.Id } }, { new: true });
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

  // create Reaction to thought
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.Id }, { $push: { replies: body } }, { new: true, runValidators: true })
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
    Thought.findOneAndUpdate({ _id: params.Id }, { $pull: { replies: { reactionId: params.reactionId } } }, { new: true })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
