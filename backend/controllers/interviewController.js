const Interview = require('../models/Interview');

exports.scheduleInterview = async (req, res) => {
    const { interviewerId, title, type, date, time, meetingLink } = req.body;

    const newInterview = new Interview({
        student: req.user.id,
        interviewer: interviewerId,
        title,
        type,
        date,
        time,
        meetingLink
    });

    const interview = await newInterview.save();
    res.status(201).json(interview);
};

exports.getUserInterviews = async (req, res) => {
    const interviews = await Interview.find({
        $or: [
            { student: req.user.id },
            { interviewer: req.user.id }
        ]
    }).populate('student', ['fullName', 'role']).populate('interviewer', ['fullName', 'role']);
    res.json(interviews);
};