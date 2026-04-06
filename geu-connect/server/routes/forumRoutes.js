const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { askQuestion, getAllThreads, answerQuestion } = require('../controllers/forumController');

router.get('/', getAllThreads);
router.post('/ask', auth, askQuestion);
router.post('/answers/:id', auth, answerQuestion);

module.exports = router;