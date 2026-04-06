const express = require('express');
const router = express.Router();
const { scheduleInterview, getUserInterviews } = require('../controllers/interviewController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, scheduleInterview);
router.get('/', authMiddleware, getUserInterviews);

module.exports = router;