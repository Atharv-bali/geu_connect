const express = require('express');
const router = express.Router();

const { createPost, getFeed, toggleLike, addComment } = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createPost);
router.get('/', authMiddleware, getFeed);
router.put('/like/:id', authMiddleware, toggleLike);
router.post('/:id/comment', authMiddleware, addComment);

module.exports = router;