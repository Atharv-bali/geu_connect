const Interview = require('../models/Interview');

exports.scheduleInterview = async (req, res) => {
    try {
        const { interviewerId, title, type, date, time, meetingLink } = req.body;

        console.log('Schedule interview request:', {
            student: req.user.id,
            interviewerId,
            title,
            type,
            date,
            time,
            meetingLink
        });

        // Validate required fields
        if (!interviewerId || !title || !date || !time || !meetingLink) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['interviewerId', 'title', 'date', 'time', 'meetingLink']
            });
        }

        const newInterview = new Interview({
            student: req.user.id,  // Current user (project owner) is the student
            interviewer: interviewerId,  // The person who requested is the interviewer
            title: title || 'Project Discussion',
            type: type || 'Project Discussion',
            date,
            time,
            meetingLink,
            status: 'Scheduled'
        });

        const interview = await newInterview.save();
        
        // Populate user details
        const populatedInterview = await Interview.findById(interview._id)
            .populate('student', ['fullName', 'role', 'email'])
            .populate('interviewer', ['fullName', 'role', 'email']);

        console.log('Interview scheduled successfully:', populatedInterview._id);

        res.status(201).json(populatedInterview);
    } catch (err) {
        console.error('Error scheduling interview:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
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