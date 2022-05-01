const router = require('express').Router();
const { getAllThought, getThoughtById, addThought, updateThought, deleteThought, addReaction, deleteReaction } = require('../../controllers/thought-controller');

// /api/thoughts
router.route('/').get(getAllThought).post(addThought);

router.route('/:ThoughtId').get(getThoughtById).put(updateThought).delete(deleteThought);

// /api/thoughts/<ThoughtId>
router.route('/:ThoughtId').put(addReaction).delete(deleteThought);

// /api/thoughts/<thoughtId>/<reactionId>
router.route('/:ThoughtId/:ReactionId').delete(deleteReaction);

module.exports = router;
