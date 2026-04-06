const express = require('express');
const router = express.Router();

const { createPost, getFeed, toggleLike } = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createPost);
router.get('/', authMiddleware, getFeed);
router.put('/like/:id', authMiddleware, toggleLike);

module.exports = router;