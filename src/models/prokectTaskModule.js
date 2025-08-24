const mongoose = require('mongoose');
const projectsModuleSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    moduleName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tasks: [{
        taskName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            required: true
        },
        estimatedHours: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending'
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]

}, { timestamps: true });
const ProjectTaskModuleModel = mongoose.model('ProjectTaskModule', projectsModuleSchema);
module.exports = { ProjectTaskModuleModel };