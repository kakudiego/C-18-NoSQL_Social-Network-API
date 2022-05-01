const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
    },
    thoughts: {
      // array of _id values referencing the thought model
      type: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    },
    friends: {
      // array of _id values referencing the user model (self-reference)
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    // prevents virtuals from creating duplicate of _id as `id`
    id: false,
  }
);

// virtual called friendCount that retrieves the length of the user's friends array field on query
UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
