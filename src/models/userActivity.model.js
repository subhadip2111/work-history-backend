const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
  message: String,
  url: String,
  author: String,
  date: String
}, { _id: false });

const recentActivitySchema = new mongoose.Schema({
  id: String,
  type: String,
  date: String,
  date_formatted: String,
  action: String,
  description: String,
  icon: String,
  repository: String,
  time_ago: String,
  time_formatted: String,
  user: String,
  details: {
    commits_count: Number,
    branch: String,
    commits: [commitSchema]
  }
}, { _id: false });

const repositorySchema = new mongoose.Schema({
  name: String,
  full_name: String,
  html_url: String,
  description: String,
  language: String,
  forks_count: Number,
  stargazers_count: Number,
  watchers_count: Number,
  open_issues_count: Number,
  default_branch: String
}, { _id: false });

const developerAnalyticsSchema = new mongoose.Schema({
  user: {
    login: String,
    id: Number,
    node_id: String,
    avatar_url: String,
    html_url: String,
    type: String
  },
  repositories: [repositorySchema],
  summary: {
    total_repos: Number,
    total_commits: Number,
    total_additions: Number,
    total_deletions: Number
  }
}, { _id: false });

const userActivitySchema = new mongoose.Schema({
  thisWeekData: {
    period: {
      start: String,
      end: String
    }
  },
  user:{
   type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recentActivity: [recentActivitySchema],
  developerAnalitics: developerAnalyticsSchema
}, { timestamps: true });

const UserActivityModel= mongoose.model("UserActivity", userActivitySchema);
module.exports={
    UserActivityModel
}
