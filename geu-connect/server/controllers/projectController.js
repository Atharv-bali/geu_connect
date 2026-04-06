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
    res.status(201).json(project);
};

exports.getAllProjects = async (req, res) => {
    const projects = await Project.find().populate('user', ['name', 'email']);
    res.json(projects);
}

exports.getMyProjects = async (req, res) => {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
}