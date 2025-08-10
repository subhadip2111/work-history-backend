const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    organization: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'member', 'contributor', 'owner'],
        default: 'member'
    },
    organizationId:{
        type: String,
        default: ''
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    githubId: {
        type: String, 
        required: true,
        unique: true
    },
    username: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    githubAccessToken: {
        type: String,
        default: ''
    },
    organizations: {
        type: [organizationSchema],
        default: []
    },
    publicRepos: {
        type: Number,
        default: 0
    },
    totalRepos: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    isGitHubAdmin: {
        type: Boolean,
        default: false
    },
    isOrgAdmin: {
        type: Boolean,
        default: false
    },

    githubAccessToken:{
        type: String,
        default: ''
    },
    workHistoryRole:{
        type: String,
        enum: ['admin', 'member', 'contributor'],
        default: 'member'
    },
    gitHubRole: {
        type: String,
        enum: ['admin', 'member', 'contributor'],
        default: 'member'
    },
    skills: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    githubCreatedAt: {
        type: Date
    },
    fetchedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
