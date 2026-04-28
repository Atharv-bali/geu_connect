const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    const { title, description, techStack, status, isResearchProject } = req.body;

    const newProject = new Project({
        title,
        description,
        techStack,
        status,
        isResearchProject,
        user: req.user.id
    });

    console.log("Logged in User ID:", req.user ? req.user.id : "No User Found");

    const project = await newProject.save();
    const populatedProject = await Project.findById(project._id).populate('user', ['fullName', 'role']);
    res.status(201).json(populatedProject);
};

exports.getAllProjects = async (req, res) => {
    const projects = await Project.find().populate('user', ['fullName', 'role']);
    res.json(projects);
}

exports.getMyProjects = async (req, res) => {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
}

exports.requestToJoin = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Check if already requested
        const alreadyRequested = project.joinRequests?.some(
            request => request.user.toString() === req.user.id
        );

        if (alreadyRequested) {
            return res.status(400).json({ message: 'You have already requested to join this project' });
        }

        // Check if already a member
        const alreadyMember = project.members?.some(
            member => member.toString() === req.user.id
        );

        if (alreadyMember) {
            return res.status(400).json({ message: 'You are already a member of this project' });
        }

        // Add join request
        if (!project.joinRequests) {
            project.joinRequests = [];
        }

        project.joinRequests.push({
            user: req.user.id,
            status: 'pending',
            message: req.body.message || '',
            createdAt: new Date()
        });

        await project.save();

        const updatedProject = await Project.findById(req.params.id)
            .populate('user', ['fullName', 'role'])
            .populate('joinRequests.user', ['fullName', 'role', 'email']);

        res.json({ 
            message: 'Join request sent successfully',
            project: updatedProject
        });
    } catch (err) {
        console.error('Error in requestToJoin:', err);
        res.status(500).json({ message: 'Server error' });
    }
};