// MongoDB Schema for Project Management System
// Using Mongoose for schema definition

const mongoose = require('mongoose');

// Team Member Schema (can be referenced from a separate collection)
const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  role: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'designer', 'qa', 'devops'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  projectType: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'desktop', 'api', 'ecommerce', 'cms']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  budget: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > this.startDate;
      },
      message: 'Deadline must be after start date'
    }
  },
  estimatedDuration: {
    type: Number, // in weeks
    default: 12
  },
  
  // Project URLs and Resources
  projectUrls: {
    github: {
      type: String,
      trim: true,
      validate: {
        validator: function(url) {
          return !url || url.includes('github.com');
        },
        message: 'Invalid GitHub URL'
      }
    },
    figma: {
      type: String,
      trim: true,
      validate: {
        validator: function(url) {
          return !url || url.includes('figma.com');
        },
        message: 'Invalid Figma URL'
      }
    },
    ui: {
      type: String,
      trim: true
    },
    other: {
      type: String,
      trim: true
    }
  },
  
  // Technology Stack
  techStack: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'cloud', 'tools'],
      required: true
    }
  }],
  
  // Team Assignments by Role
  teamAssignments: {
    frontend: [{
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedDate: {
        type: Date,
        default: Date.now
      }
    }],
    backend: [{
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedDate: {
        type: Date,
        default: Date.now
      }
    }],
    fullstack: [{
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedDate: {
        type: Date,
        default: Date.now
      }
    }],
    designer: [{
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedDate: {
        type: Date,
        default: Date.now
      }
    }],
    qa: [{
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedDate: {
        type: Date,
        default: Date.now
      }
    }],
    devops: [{
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assignedDate: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Client Information
  clientInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(email) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: 'Invalid email format'
      }
    },
    phone: {
      type: String,
      trim: true
    }
  },
  
  projectAssets: [{
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    fileType: {
      type: String,
      required: true,
      enum: ['fig', 'pdf', 'doc', 'docx', 'zip', 'sketch', 'jpg', 'png', 'svg']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  aiFeatures: {
    autoTaskBreakdown: {
      type: Boolean,
      default: true
    },
    smartTeamAssignment: {
      type: Boolean,
      default: true
    },
    automatedProgressUpdates: {
      type: Boolean,
      default: true
    },
    weeklyClientReports: {
      type: Boolean,
      default: false
    }
  },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'draft'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  complexity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedTasks: {
    type: Number,
    default: 45
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ProjectSchema.index({ projectName: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ startDate: 1 });
ProjectSchema.index({ deadline: 1 });
ProjectSchema.index({ 'clientInfo.email': 1 });
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ 'teamAssignments.frontend.memberId': 1 });
ProjectSchema.index({ 'teamAssignments.backend.memberId': 1 });
ProjectSchema.index({ 'teamAssignments.fullstack.memberId': 1 });
ProjectSchema.index({ 'teamAssignments.designer.memberId': 1 });
ProjectSchema.index({ 'teamAssignments.qa.memberId': 1 });
ProjectSchema.index({ 'teamAssignments.devops.memberId': 1 });

// Virtual for total team size
ProjectSchema.virtual('totalTeamSize').get(function() {
  return Object.values(this.teamAssignments)
    .reduce((total, roleMembers) => total + roleMembers.length, 0);
});

// Virtual for project duration in weeks
ProjectSchema.virtual('durationInWeeks').get(function() {
  if (this.startDate && this.deadline) {
    const diffTime = Math.abs(this.deadline - this.startDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  }
  return 0;
});

// Pre-save middleware
ProjectSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.createdBy; // You'll need to pass the current user ID
  }
  next();
});

// Static method to find projects by team member
ProjectSchema.statics.findByTeamMember = function(memberId) {
  return this.find({
    $or: [
      { 'teamAssignments.frontend.memberId': memberId },
      { 'teamAssignments.backend.memberId': memberId },
      { 'teamAssignments.fullstack.memberId': memberId },
      { 'teamAssignments.designer.memberId': memberId },
      { 'teamAssignments.qa.memberId': memberId },
      { 'teamAssignments.devops.memberId': memberId }
    ]
  });
};

// Instance method to add team member to a role
ProjectSchema.methods.addTeamMember = function(roleId, memberId) {
  if (!this.teamAssignments[roleId]) {
    this.teamAssignments[roleId] = [];
  }
  
  // Check if member is already assigned to this role
  const isAlreadyAssigned = this.teamAssignments[roleId].some(
    assignment => assignment.memberId.toString() === memberId.toString()
  );
  
  if (!isAlreadyAssigned) {
    this.teamAssignments[roleId].push({
      memberId: memberId,
      assignedDate: new Date()
    });
  }
  
  return this.save();
};

// Instance method to remove team member from a role
ProjectSchema.methods.removeTeamMember = function(roleId, memberId) {
  if (this.teamAssignments[roleId]) {
    this.teamAssignments[roleId] = this.teamAssignments[roleId].filter(
      assignment => assignment.memberId.toString() !== memberId.toString()
    );
  }
  
  return this.save();
};

const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = {
  ProjectModel
  
};