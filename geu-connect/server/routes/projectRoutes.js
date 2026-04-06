const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getMyProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createProject);
router.get('/', getAllProjects);
router.get('/me', authMiddleware, getMyProjects);

module.exports = router;
