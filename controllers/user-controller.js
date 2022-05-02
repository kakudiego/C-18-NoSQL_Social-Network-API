const { User } = require('../models');
const { remove } = require('../models/User');

const UserController = {
  // get all Users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one User by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // createUser
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // update User by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'ERROR! try another userID!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // delete User and all associated thoughts when user is deleted
  // deleteUser({ params }, res) {
  //   User.findOneAndDelete({ _id: params.id })
  //     .then((dbUserData) => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: 'ERROR! try another userID!' });
  //         return;
  //       }
  //       Thought.deleteMany({ _id: { $in: dbUserData.thoughts } }).then(() => res.json(dbUserData));
  //     })
  //     .catch((err) => res.json(err));
  // },

  // deleteUser({ params }, res) {
  //   User.findOneAndDelete({ _id: params.id })
  //     .then((dbUserData) => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: 'ERROR! try another userID!' });
  //         return;
  //       }
  //       remove(dbUserData.thoughts).then(() => res.json(dbUserData));
  //     })
  //     .catch((err) => res.json(err));
  // },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // add a new friend to a user's friends list
  addFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'ERROR! try another userID!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete a friend from a user's friends list
  deleteFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'ERROR! try another friendID!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = UserController;
