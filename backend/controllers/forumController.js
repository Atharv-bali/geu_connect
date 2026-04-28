const forum = require('../models/Forum');

exports.askQuestion = async (req, res) => {
    const { title, description, imageURL, tags } = req.body;
    const newQuestion = new forum({
        title,
        description,
        imageURL,
        tags,
        user: req.user.id
    });
    await newQuestion.save();
    res.status(201).json({ message: 'Question posted successfully', question: newQuestion });
}

exports.answerQuestion = async (req, res) => {
    const question = await forum.findById(req.params.id);
    if (!question) {
        return res.status(404).json({ message: 'Question not found' });
    }
    const newAnswer = {
        user: req.user.id,
        text: req.body.text
    }
    question.answers.push(newAnswer);
    await question.save();
    res.json(question.newAnswer);
}

exports.getAllThreads = async (req, res) => {
    const threads = await forum.find().sort({ createdAt: -1 })
        .populate('user', ['fullName', 'role'])
        .populate('answers.user', ['fullName', 'role']);
    res.json(threads);
}