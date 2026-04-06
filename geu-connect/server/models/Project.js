const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    techStack: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed'],
        default: 'Open'
    },
    isResearchProject: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
