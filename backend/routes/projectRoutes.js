const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getMyProjects, requestToJoin, handleJoinRequest, getUserProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getAllProjects);
router.get('/me', authMiddleware, getMyProjects);
router.get('/user/:userId', authMiddleware, getUserProjects);
router.post('/:id/join', authMiddleware, requestToJoin);
router.put('/:projectId/requests/:requestId', authMiddleware, handleJoinRequest);

module.exports = router;
